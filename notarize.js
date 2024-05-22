// From https://github.com/simonw/til/blob/main/electron/sign-notarize-electron-macos.md
// Based on https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/

const {
  notarize
} = require("@electron/notarize");

exports.default = async function notarizing(context) {
  const {
    electronPlatformName,
    appOutDir
  } = context;
  if (electronPlatformName !== "darwin") return;

  const appName = context.packager.appInfo.productFilename;

  try {
    await notarize({
      appBundleId: "com.bobscnc.LD8F5MWN39",
      appPath: `${appOutDir}/${appName}.app`,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    });
    
    console.log("Notarization using BobsCNC script: successful");
  } catch (error) {
    console.error("Notarization using BobsCNC script: failed:", error);
  }
};