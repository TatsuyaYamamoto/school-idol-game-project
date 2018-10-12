import * as program from "commander";
import * as admin from "firebase-admin";

const serviceAccount = require("../../../../../../../../../.ssh/service_account/school-idol-game-development-firebase-adminsdk-9pa6d-bcd3574005");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://oimo-no-mikiri-development.firebaseio.com"
});

const auth = admin.auth();
const db = admin.firestore();
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
  .command("health")
  .description("health check each resources")
  .action(healthCheck);

program.parse(process.argv);

if (program.args.length === 0) {
  program.outputHelp();
}

async function clearFirestore() {
  // Step1. delete subcollection of ranking

  const rankingSnapshot = await db.collection("ranking").get();

  console.log(
    `"ranking" has ${rankingSnapshot.size} docs. try to delete recursively.`
  );

  for (const rankingDoc of rankingSnapshot.docs) {
    const rankingListSnapshot = await rankingDoc.ref.collection("list").get();
    console.log(
      `"ranking/${rankingDoc.id}" has ${rankingListSnapshot.size} docs.`
    );

    for (const rankingListItemDoc of rankingListSnapshot.docs) {
      await rankingListItemDoc.ref.delete();
    }
  }

  console.log(`"ranking/**/list"'s all docs are deleted.`);

  // Step2. delete root collections
  const cols = ["users", "users_deleted", "highscores", "playlogs", "ranking"];

  await Promise.all(
    cols.map(async col => {
      const snapshot = await db.collection(col).get();

      console.log(`"${col}" has ${snapshot.size} docs. try to delete.`);

      for (const doc of snapshot.docs) {
        await doc.ref.delete();
      }

      console.log(`=> all docs are deleted.`);
    })
  );

  // Step3. Delete all auth users
  await auth.listUsers().then(({ users }) => {
    console.log(`"auth" has ${users.length} users`);

    return Promise.all(users.map(user => auth.deleteUser(user.uid)));
  });
  console.log(`=> all auth users are deleted.`);

  process.exit();
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
