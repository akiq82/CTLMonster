/**
 * Expo Config Plugin: Health Connect Android 14+ activity-alias
 *
 * Android 14 (API 34) requires an activity-alias with
 * VIEW_PERMISSION_USAGE_INTERNAL_APP intent filter for Health Connect
 * permissions dialog to work correctly.
 */

const { withAndroidManifest } = require("expo/config-plugins");

function addHealthConnectActivityAlias(androidManifest) {
  const mainApplication = androidManifest.manifest.application?.[0];
  if (!mainApplication) return androidManifest;

  // Find main activity name
  const mainActivity = mainApplication.activity?.find(
    (a) =>
      a.$?.["android:name"] === ".MainActivity" ||
      a.$?.["android:name"]?.endsWith(".MainActivity")
  );
  if (!mainActivity) return androidManifest;

  const mainActivityName = mainActivity.$["android:name"];

  // Check if activity-alias already exists
  const aliases = mainApplication["activity-alias"] ?? [];
  const exists = aliases.some(
    (a) =>
      a.$?.["android:name"] === "ViewPermissionUsageActivity"
  );
  if (exists) return androidManifest;

  // Add activity-alias for Health Connect permission usage display
  const alias = {
    $: {
      "android:name": "ViewPermissionUsageActivity",
      "android:exported": "true",
      "android:targetActivity": mainActivityName,
      "android:permission": "android.permission.START_VIEW_PERMISSION_USAGE",
    },
    "intent-filter": [
      {
        action: [
          {
            $: {
              "android:name":
                "android.intent.action.VIEW_PERMISSION_USAGE",
            },
          },
        ],
        category: [
          {
            $: {
              "android:name": "android.intent.category.HEALTH_PERMISSIONS",
            },
          },
        ],
      },
    ],
  };

  mainApplication["activity-alias"] = [...aliases, alias];

  return androidManifest;
}

module.exports = function withHealthConnectPermissions(config) {
  return withAndroidManifest(config, (config) => {
    config.modResults = addHealthConnectActivityAlias(config.modResults);
    return config;
  });
};
