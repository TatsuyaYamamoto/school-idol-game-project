const appEnv = process.env.APP_ENV;
require("dotenv").config({ path: `.env.${appEnv}` });

const appEnvVariables = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => key.startsWith("APP_"))
);

module.exports = {
  trailingSlash: true,
  env: {
    ...appEnvVariables,
  },
};
