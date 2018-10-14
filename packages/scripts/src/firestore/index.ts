import * as program from "commander";
import * as admin from "firebase-admin";

import importFirestore from "./import";
import clearFirestore from "./clear";

const serviceAccount = require("../../../../../../../../../.ssh/service_account/school-idol-game-development-firebase-adminsdk-9pa6d-bcd3574005");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://oimo-no-mikiri-development.firebaseio.com"
});

export const auth = admin.auth();
export const db = admin.firestore();
db.settings({
  timestampsInSnapshots: true
});

program.version("1.0.0");

program
  .command("clear")
  .description("clear firebase resources without metadata")
  .action(clearFirestore);

program
  .command("publish <topic> <data>")
  .description("send FCM message")
  .action(publish);

program
  .command("import <database>")
  .description("import docs from mysql records")
  .option("-u --user <user>", "user to use when connecting to server", "root")
  .option(
    "-p --password <password>",
    "password to use when connecting to server",
    ""
  )
  .option("-h --host <host>", "hostname to connect", "localhost")
  .option(
    "-l --no-login-user-log",
    "ignore loading and write playlog of login user"
  )
  .option(
    "-a --no-anonymous-user-log",
    "ignore loading and write playlog of anonymous user"
  )
  .option(
    "-c --limit-user-count <n>",
    "for debug. count of loading target user",
    /^([1-9][0-9]*|0)$/,
    0
  )

  .action(importFirestore);

program
  .command("health")
  .description("health check each resources")
  .action(healthCheck);

program.parse(process.argv);

if (program.args.length === 0) {
  program.outputHelp();
}

async function healthCheck() {
  console.log("should auth user === /databases/{database}/documents.users");
  await auth.listUsers().then(({ users }) => {
    return users.map(user => user.uid);
  });
}

async function publish(topic: string, data: any, _cmd: any) {
  const message = {
    data: JSON.parse(data),
    topic
  };
  console.log("message: ", message);

  const response = await admin.messaging().send(message);

  console.log("Successfully sent message:", response);

  process.exit();
}
