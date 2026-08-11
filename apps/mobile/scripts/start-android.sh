#!/usr/bin/env bash
export PATH="$PATH:/home/cohorte6/Android/Sdk/platform-tools"
export REACT_NATIVE_PACKAGER_HOSTNAME="10.0.2.2"
adb reverse tcp:8081 tcp:8081 2>/dev/null || true
pnpm exec expo start --android "$@"
