import { https } from "firebase-functions";

import * as pkg from "../../package.json";

export default https.onRequest((_request, response) => {
  response.send(
    JSON.stringify({
      name: pkg.name,
      version: pkg.version,
    })
  );
});
