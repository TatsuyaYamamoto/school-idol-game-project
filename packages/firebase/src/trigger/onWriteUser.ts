import { firestore } from "firebase-functions";

import { UserDocument } from "@sokontokoro/mikan";

import { catchErrorWrapper, getDocUrl, sendToSlack, slackUrl } from "../utils";

export default firestore.document("users/{userId}").onWrite(
  catchErrorWrapper(async (change, _context) => {
    const afterUser = change.after.data() as UserDocument;

    if (!change.before.exists) {
      console.log("received event of creation.");

      const consoleUrl = slackUrl(getDocUrl("users", afterUser.uid), "console");

      await sendToSlack({
        title: `new user joined! ${consoleUrl}`,
        text: `UID: ${afterUser.uid}`,
      });
      return;
    }

    const beforeUser = change.before.data() as UserDocument;

    if (Object.keys(beforeUser.providers) < Object.keys(afterUser.providers)) {
      console.log("received event of link updating.");

      const consoleUrl = slackUrl(getDocUrl("users", afterUser.uid), "console");

      await sendToSlack({
        title: `user linked! ${consoleUrl}`,
        text: `UID: ${afterUser.uid}\nName: ${afterUser.displayName}`,
      });
      return;
    }

    console.log("received undefined event.", beforeUser, afterUser);
  })
);
