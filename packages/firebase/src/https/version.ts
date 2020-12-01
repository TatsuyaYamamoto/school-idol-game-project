import { https } from "firebase-functions";

// eslint-disable-next-line
const pkg = require("../../package.json");

export default https.onRequest((_request, response) => {
  response.send(
    JSON.stringify({
      name: pkg.name,
      version: pkg.version,
    })
  );
});
