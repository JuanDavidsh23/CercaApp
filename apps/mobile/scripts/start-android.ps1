$ErrorActionPreference = "Stop"

# Android emulator cannot reach the host LAN IP reliably.
# 10.0.2.2 is the special alias to the host machine from the emulator.
$env:REACT_NATIVE_PACKAGER_HOSTNAME = "10.0.2.2"

adb reverse tcp:8081 tcp:8081 | Out-Null
pnpm exec expo start --android @args
