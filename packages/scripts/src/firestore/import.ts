import * as admin from "firebase-admin";
import DocumentReference = admin.firestore.DocumentReference;
import * as mysql from "mysql";
import {
  HighscoreDocument,
  UserDocument,
  CredentialDocument,
} from "@sokontokoro/mikan";

export const MIGRATION_TMP_VALUE_USER_REF = "ANONYMOUS_IN_OLD_SYSTEM";

export default async function (database: string, options: any) {
  const { user, password, host, limitUserCount } = options;

  console.log(`start migration.
 mysql database     : ${database}
 firebase project id: ${
   (<any>admin.app().options.credential).certificate.projectId
 }
 limit user count   : ${limitUserCount === 0 ? "no limit" : limitUserCount}`);

  const connection = mysql.createConnection({
    host,
    user,
    password,
    database,
    supportBigNumbers: true,
    bigNumberStrings: true,
  });

  connection.connect();
  console.log(`connect mysql`);

  const userColRef = admin.firestore().collection("users");
  const highscoreColRef = admin.firestore().collection("highscores");
  const credentialColRef = admin.firestore().collection("credentials");

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
    newSystemUserRef: DocumentReference;
  }[] = [];
  const userDocs: UserDocument[] = [];
  const importCredentials: {
    doc: CredentialDocument;
    ref: DocumentReference;
  }[] = [];

  for (const user of users) {
    const newUserRef = userColRef.doc();
    const newCredentialRef = credentialColRef.doc();

    savedUsers.push({
      oldSystemUid: user[`ID`],
      newSystemUid: newUserRef.id,
      newSystemUserRef: newUserRef,
    });

    userDocs.push({
      uid: newUserRef.id,
      isAnonymous: false,
      displayName: user[`NAME`],
      photoURL: null,
      highscoreRefs: {
        /* pending */
      },
      providers: {
        [`twitter.com`]: {
          userId: user[`ID`],
          credentialRef: newCredentialRef as any,
          linkedAt: longToDate(parseInt(user[`CREATE_DATE`])),
        },
      },
      createdAt: longToDate(parseInt(user[`CREATE_DATE`])),
      updatedAt: longToDate(
        parseInt(user[`UPDATE_DATE`] || user[`CREATE_DATE`])
      ),
      duplicatedRefsByLink: [],
    });

    importCredentials.push({
      doc: {
        userRef: newUserRef as any,
        providerId: `twitter.com`,
        data: {},
        createdAt: longToDate(parseInt(user[`CREATE_DATE`])),
        updatedAt: longToDate(parseInt(user[`CREATE_DATE`])),
      },
      ref: newCredentialRef,
    });
  }

  /**
   * 2. import user docs
   */
  let userCount = 0;

  for (const batchTargetUsers of splitList(userDocs, 100)) {
    const batch = admin.firestore().batch();

    batchTargetUsers.forEach((user) => {
      batch.set(userColRef.doc(user.uid), user);
      userCount++;
    });

    await batch.commit();
    console.log("commit users with batch");
  }

  /**
   * 3. import credential docs
   */
  for (const batchTargetCredentials of splitList(importCredentials, 100)) {
    const batch = admin.firestore().batch();

    batchTargetCredentials.forEach((credential) => {
      batch.set(credential.ref, credential.doc);
    });

    await batch.commit();
    console.log("commit credentials with batch");
  }

  console.log(`success to import ${userCount} docs to users`);

  /************************************************************************
   * USER/authenticate
   */

  const result = await admin.auth().importUsers(
    userDocs.map((userDoc) => {
      const providerData = Object.keys(userDoc.providers).map((providerId) => {
        const provider = userDoc.providers[providerId];
        return {
          uid: provider.userId,
          providerId,
        };
      });

      return {
        uid: userDoc.uid,
        providerData,
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
  const importScores: {
    doc: HighscoreDocument;
    ref: DocumentReference;
  }[] = [];
  const updateUsers: {
    doc: Partial<UserDocument>;
    ref: DocumentReference;
  }[] = [];

  for (const user of savedUsers) {
    const scores = await query(
      connection,
      `SELECT * FROM score WHERE USER_ID = "${user.oldSystemUid}"`
    );

    console.log(
      `load gamelog. user: ${user.oldSystemUid}, game: ${scores
        .map((s) => s[`GAME`].toLowerCase())
        .join(", ")}`
    );

    let highscoreRefs: { [game: string]: DocumentReference | any } = {};

    for (const s of scores) {
      const highscoreRef = highscoreColRef.doc();
      const game = s[`GAME`].toLowerCase();

      importScores.push({
        ref: highscoreRef,
        doc: {
          userRef: user.newSystemUserRef as any,
          game,
          member: s[`member`].toLowerCase(),
          point: s[`POINT`],
          label: {},
          count: s[`COUNT`],
          createdAt: longToDate(parseInt(s[`CREATE_DATE`])),
          updatedAt: longToDate(parseInt(s[`FINAL_DATE`] || s[`CREATE_DATE`])),
          brokenAt: longToDate(parseInt(s[`UPDATE_DATE`] || s[`CREATE_DATE`])),
          testUserId: s[`USER_ID`],
        } as HighscoreDocument,
      });

      highscoreRefs[game] = highscoreRef;
    }

    updateUsers.push({
      doc: {
        highscoreRefs,
      },
      ref: user.newSystemUserRef,
    });
  }

  console.log(`load scores. count: ${importScores.length}`);

  /**
   * 2. Import highscore docs
   */
  let highscoreCount = 0;
  for (const batchTargetScoreDocs of splitList(importScores, 100)) {
    const batch = admin.firestore().batch();
    batchTargetScoreDocs.forEach((score) => {
      highscoreCount++;
      batch.set(score.ref, score.doc);
    });
    await batch.commit();
    console.log("commit to set highscore docs with batch");
  }

  /**
   * 3. Update user docs
   */
  for (const batchTargetUsers of splitList(updateUsers, 100)) {
    const batch = admin.firestore().batch();
    batchTargetUsers.forEach((user) => {
      batch.update(user.ref, user.doc);
    });
    await batch.commit();
    console.log("commit to update user docs with batch");
  }

  console.log(`success to import ${highscoreCount} docs to highscore.`);

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

export function longToDate(longValue: number) {
  if (/* ex. 1482579369787 */ 1 * 1000 * 1000 * 1000 * 1000 < longValue) {
    return new Date(longValue);
  } /* ex. 1451691249 */ else {
    return new Date(longValue * 1000);
  }
}

export async function query(connection: mysql.Connection, sql: string) {
  return new Promise<any[]>((resolve, reject) => {
    connection.query(
      sql,
      function (error: Error, result: any | any[], _fields: any) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}
