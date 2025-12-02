// app.config.ts à la racine
import "dotenv/config";
import type { ExpoConfig } from "expo/config";

export default ({ config }: { config: ExpoConfig }) => ({
  ...config,
  extra: {
    ...config.extra,
    NOTIFICATION_BASE_URL: process.env.NOTIFICATION_BASE_URL,
  },
});
