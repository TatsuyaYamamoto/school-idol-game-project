import * as admin from "firebase-admin";
import * as mysql from "mysql";
import {
  HighscoreDocument,
  PlaylogDocument,
  UserDocument
} from "@sokontokoro/mikan";

export const MIGRATION_TMP_VALUE_USER_REF = "ANONYMOUS_IN_OLD_SYSTEM";
export const MIGRATION_TMP_VALUE_CREDENTIAL_REF = "NO_CREDENTIAL_IN_OLD_SYSTEM";
export const MIGRATION_TMP_VALUE_PHOTO_URL = "NO_PHOTO_URL_IN_OLD_SYSTEM";

export default async function(database: string, options: any) {
  const {
    user,
    password,
    host,
    loginUserLog,
    anonymousUserLog,
    limitUserCount
  } = options;

  console.log(`start migration.
 mysql database     : ${database}
 firebase project id: ${
   (<any>admin.app().options.credential).certificate.projectId
 }
 login user log     : ${loginUserLog ? "enable" : "disable"}
 anonymous user log : ${loginUserLog ? "enable" : "disable"}
 limit user count   : ${limitUserCount === 0 ? "no limit" : limitUserCount}`);

  const connection = mysql.createConnection({
    host,
    user,
    password,
    database,
    supportBigNumbers: true,
    bigNumberStrings: true
  });

  connection.connect();
  console.log(`connect mysql`);

  const userColRef = admin.firestore().collection("users");
  const highscoreColRef = admin.firestore().collection("highscores");
  const playlogColRef = admin.firestore().collection("playlogs");

  /************************************************************************
   * USER/firestore
   */

  /**
   * 1. Create docs
   */
  const users = await query(
    connection,
    limitUserCount === 0
      ? "SELECT * FROM user"
      : "SELECT * FROM user LIMIT " + limitUserCount
  );
  console.log(`load users. count: ${users.length}`);

  const savedUsers: {
    oldSystemUid: string;
    newSystemUid: string;
    newSystemUserRef: any;
  }[] = [];
  const userDocs: UserDocument[] = [];

  for (const user of users) {
    const newUserRef = userColRef.doc();

    savedUsers.push({
      oldSystemUid: user[`ID`],
      newSystemUid: newUserRef.id,
      newSystemUserRef: newUserRef
    });

    userDocs.push({
      uid: newUserRef.id,
      isAnonymous: false,
      displayName: user[`NAME`],
      photoURL: MIGRATION_TMP_VALUE_PHOTO_URL,
      highscoreRefs: {
        /* pending */
      },
      providers: {
        [`twitter.com`]: {
          userId: user[`ID`],
          credentialRef: MIGRATION_TMP_VALUE_CREDENTIAL_REF as any,
          linkedAt: longToDate(parseInt(user[`CREATE_DATE`]))
        }
      },
      createdAt: longToDate(parseInt(user[`CREATE_DATE`])),
      updatedAt: longToDate(
        parseInt(user[`UPDATE_DATE`] || user[`CREATE_DATE`])
      ),
      duplicatedRefsByLink: []
    });
  }

  /**
   * 2. import docs
   */
  let userCount = 0;

  for (const batchTargetUsers of splitList(userDocs, 100)) {
    const batch = admin.firestore().batch();

    batchTargetUsers.forEach(user => {
      batch.set(userColRef.doc(user.uid), user);
      userCount++;
    });

    await batch.commit();
    console.log("commit users with batch");
  }

  console.log(`success to import ${userCount} docs to users`);

  /************************************************************************
   * USER/authenticate
   */

  const result = await admin.auth().importUsers(
    userDocs.map(userDoc => {
      const providerData = Object.keys(userDoc.providers).map(providerId => {
        const provider = userDoc.providers[providerId];
        return {
          uid: provider.userId,
          providerId
        };
      });

      return {
        uid: userDoc.uid,
        providerData
      };
    })
  );

  console.log(`success to import as auth user. 
  success count: ${result.successCount}
  error count: ${result.failureCount}`);

  for (const e of result.errors) {
    console.error(e);
  }

  /************************************************************************
   * highscores
   */

  /**
   * 1. Create docs
   */
  const scoreDocs: any[] = [];

  for (const user of savedUsers) {
    const scores = await query(
      connection,
      `SELECT * FROM score WHERE USER_ID = "${user.oldSystemUid}"`
    );

    console.log(
      `load gamelog. user: ${user.oldSystemUid}, game: ${scores
        .map(s => s[`GAME`].toLowerCase())
        .join(", ")}`
    );

    for (const s of scores) {
      scoreDocs.push({
        userRef: user.newSystemUserRef,
        game: s[`GAME`].toLowerCase(),
        member: s[`member`].toLowerCase(),
        point: s[`POINT`],
        label: {},
        count: s[`COUNT`],
        createdAt: longToDate(parseInt(s[`CREATE_DATE`])),
        updatedAt: longToDate(parseInt(s[`FINAL_DATE`] || s[`CREATE_DATE`])),
        brokenAt: longToDate(parseInt(s[`UPDATE_DATE`] || s[`CREATE_DATE`])),
        testUserId: s[`USER_ID`]
      } as HighscoreDocument);
    }
  }

  console.log(`load scores. count: ${scoreDocs.length}`);

  /**
   * 2. Import docs
   */
  let highscoreCount = 0;
  for (const batchTargetScoreDocs of splitList(scoreDocs, 100)) {
    const batch = admin.firestore().batch();
    batchTargetScoreDocs.forEach(scoreDoc => {
      highscoreCount++;
      batch.set(highscoreColRef.doc(), scoreDoc);
    });
    batch.commit();
    console.log("commit highscores with batch");
  }

  console.log(`success to import ${highscoreCount} docs to highscore`);

  /************************************************************************
   * playlog (login user only)
   */
  if (!loginUserLog) {
    console.log("ignore login user playlog process");
  } else {
    for (const user of savedUsers) {
      const gamelogs = await query(
        connection,
        `SELECT * FROM game_log WHERE USER_ID = "${user.oldSystemUid}"`
      );

      const batch = admin.firestore().batch();

      for (const l of gamelogs) {
        const newLogRef = playlogColRef.doc();
        batch.set(newLogRef, {
          userRef: user.newSystemUserRef,
          game: l[`GAME`].toLowerCase(),
          member: l[`member`].toLowerCase(),
          point: l[`POINT`],
          label: {},
          userAgent: l[`USER_AGENT`],
          language: l[`LOCALE`],
          languages: l[`LOCALE`],
          createdAt: longToDate(parseInt(l[`PLAY_DATE`]))
        } as PlaylogDocument);
      }
      batch.commit();
    }

    console.log("success to save playlog doc");
  }

  /************************************************************************
   * playlog anonymous user
   */
  if (!anonymousUserLog) {
    console.log("ignore anonymous user playlog process");
  } else {
    const anonymousGameLogs = await query(
      connection,
      "SELECT * FROM game_log WHERE USER_ID IS NULL LIMIT 10"
    );

    console.log(`load anonymous game log. count: ${anonymousGameLogs.length}`);

    const batchTargetList = splitList(anonymousGameLogs, 3);

    for (const logs of batchTargetList) {
      const batch = admin.firestore().batch();

      for (const l of logs) {
        batch.set(playlogColRef.doc(), {
          userRef: MIGRATION_TMP_VALUE_USER_REF as any,
          game: l[`GAME`].toLowerCase(),
          member: l[`member`].toLowerCase(),
          point: l[`POINT`],
          label: {},
          userAgent: l[`USER_AGENT`],
          language: l[`LOCALE`],
          languages: l[`LOCALE`],
          createdAt: longToDate(l[`PLAY_DATE`])
        } as PlaylogDocument);
      }

      batch.commit();
    }
  }

  connection.end();
  console.log("end 🍊");
  process.exit();
}

export function splitList<T>(targetList: T[], maxSize: number): T[][] {
  const init2DList = [[]];

  return targetList.reduce((prev2DList: any[][], item) => {
    let currentList = prev2DList[prev2DList.length - 1];

    if (maxSize <= currentList.length) {
      prev2DList.push([item]);
    } else {
      currentList.push(item);
    }

    return prev2DList;
  }, init2DList);
}

function longToDate(longValue: number) {
  if (/* ex. 1482579369787 */ 1 * 1000 * 1000 * 1000 * 1000 < longValue) {
    return new Date(longValue);
  } /* ex. 1451691249 */ else {
    return new Date(longValue * 1000);
  }
}

async function query(connection: mysql.Connection, sql: string) {
  return new Promise<any[]>((resolve, reject) => {
    connection.query(sql, function(
      error: Error,
      result: any | any[],
      _fields: any
    ) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}
