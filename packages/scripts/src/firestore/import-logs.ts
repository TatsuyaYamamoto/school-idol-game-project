import { app, firestore } from "firebase-admin";
import DocumentReference = firestore.DocumentReference;
import * as mysql from "mysql";
import { PlaylogDocument } from "@sokontokoro/mikan";
import { longToDate, query, splitList } from "./import";

export const MIGRATION_TMP_VALUE_USER_REF = "ANONYMOUS_IN_OLD_SYSTEM";

export default async function(database: string, options: any) {
  const { user, password, host, limitUserCount } = options;

  console.log(`start import play logs.
 mysql database     : ${database}
 firebase project id: ${
   (<any>app().options.credential).certificate.projectId
 }`);

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

  // const userColRef = admin.firestore().collection("users");
  const playlogColRef = firestore().collection("playlogs");

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

  // TODO query user ref from old database user ids

  /************************************************************************
   * playlog (login user only)
   */
  const userPlaylogs: {
    doc: PlaylogDocument;
    ref: DocumentReference;
  }[] = [];

  // Create doc
  for (const user of savedUsers) {
    const gamelogs = await query(
      connection,
      `SELECT * FROM game_log WHERE USER_ID = "${user.oldSystemUid}"`
    );

    for (const l of gamelogs) {
      const newLogRef = playlogColRef.doc();
      const game = l[`GAME`].toLowerCase();

      // FOR UNSUPPORTED GAME OR BUG!
      const member = l[`member`]
        ? l[`member`].toLowerCase()
        : game === "honocar"
          ? "honoka"
          : game === "shakarin"
            ? "rin"
            : game === "maruten"
              ? "hanamaru"
              : game === "yamidori"
                ? "kotori"
                : // game === "oimo"
                  "hanamaru";

      userPlaylogs.push({
        ref: newLogRef,
        doc: {
          userRef: user.newSystemUserRef as any,
          game,
          member,
          point: l[`POINT`],
          label: {},
          userAgent: l[`USER_AGENT`],
          language: l[`LOCALE`],
          languages: l[`LOCALE`],
          createdAt: longToDate(parseInt(l[`PLAY_DATE`]))
        } as PlaylogDocument
      });
    }
  }

  console.log(`load login user game log. count: ${userPlaylogs.length}`);

  // execute batchs
  for (const batchTarget of splitList(userPlaylogs, 400)) {
    const batch = firestore().batch();

    batchTarget.forEach(item => batch.set(item.ref, item.doc));

    await batch.commit();
    console.log(`exec playlog batch`);
  }

  console.log("success to save playlog doc.");

  /************************************************************************
   * playlog anonymous user
   */
  const anonymousGameLogs = await query(
    connection,
    "SELECT * FROM game_log WHERE USER_ID IS NULL"
  );

  console.log(`load anonymous game log. count: ${anonymousGameLogs.length}`);

  const batchTargetList = splitList(anonymousGameLogs, 400);

  for (const logs of batchTargetList) {
    const batch = firestore().batch();

    for (const l of logs) {
      const newLogRef = playlogColRef.doc();
      const game = l[`GAME`].toLowerCase();

      // FOR UNSUPPORTED GAME OR BUG!
      const member = l[`member`]
        ? l[`member`].toLowerCase()
        : game === "honocar"
          ? "honoka"
          : game === "shakarin"
            ? "rin"
            : game === "maruten"
              ? "hanamaru"
              : game === "yamidori"
                ? "kotori"
                : // game === "oimo"
                  "hanamaru";

      batch.set(newLogRef, {
        userRef: MIGRATION_TMP_VALUE_USER_REF as any,
        game,
        member,
        point: l[`POINT`],
        label: {},
        userAgent: l[`USER_AGENT`],
        language: l[`LOCALE`],
        languages: l[`LOCALE`],
        createdAt: longToDate(parseInt(l[`PLAY_DATE`]))
      } as PlaylogDocument);
    }

    await batch.commit();
    console.log(`exec playlog batch`);
  }

  connection.end();
  console.log("end 🍊");
  process.exit();
}
