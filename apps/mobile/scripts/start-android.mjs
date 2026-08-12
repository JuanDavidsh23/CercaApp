#!/usr/bin/env node
// Cross-platform launcher for the Android dev build.
// Resolves the Android SDK, wires up adb reverse so the emulator can reach
// the Metro bundler, and then starts Expo.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join, delimiter } from "node:path";

function resolveSdkRoot() {
  const fromEnv = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT;
  if (fromEnv) return fromEnv;

  const defaults = {
    win32: join(process.env.LOCALAPPDATA ?? "", "Android", "Sdk"),
    darwin: join(homedir(), "Library", "Android", "sdk"),
    linux: join(homedir(), "Android", "Sdk"),
  };
  return defaults[process.platform] ?? defaults.linux;
}

const sdkRoot = resolveSdkRoot();
const platformTools = join(sdkRoot, "platform-tools");

if (!existsSync(platformTools)) {
  console.error(
    `Android SDK platform-tools not found at ${platformTools}.\n` +
      "Install the SDK via Android Studio and set ANDROID_HOME to its location.",
  );
  process.exit(1);
}

const env = {
  ...process.env,
  ANDROID_HOME: sdkRoot,
  ANDROID_SDK_ROOT: sdkRoot,
  PATH: `${process.env.PATH ?? ""}${delimiter}${platformTools}${delimiter}${join(sdkRoot, "emulator")}`,
  // The emulator cannot reach the host LAN IP reliably; 10.0.2.2 is its alias
  // for the host machine.
  REACT_NATIVE_PACKAGER_HOSTNAME: "10.0.2.2",
};

// Best effort: fails harmlessly when no device is attached yet.
spawnSync(join(platformTools, "adb"), ["reverse", "tcp:8081", "tcp:8081"], {
  env,
  stdio: "ignore",
});

const result = spawnSync(
  "pnpm",
  ["exec", "expo", "start", "--android", ...process.argv.slice(2)],
  { env, stdio: "inherit", shell: process.platform === "win32" },
);

process.exit(result.status ?? 1);
