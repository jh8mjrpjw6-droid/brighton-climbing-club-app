# Startup dependency correction

Reported symptom: iOS app closes after the launch logo, before sign-in. A device crash report is still required to identify the exception; this change is not a confirmed diagnosis.

The 2.2 lockfile installed expo-font 58.0.10 for vector-icons and a second 57.0.4 copy under Expo SDK 57. Native autolinking selected the SDK 58 copy. Declare expo-font ~57.0.4 directly so Expo, icon rendering, and native autolinking share the SDK-compatible copy.

Validation: startup dependency check; native autolinking resolves one expo-font 57.0.4; 97 workflow/UI tests; successful Hermes iOS export. These checks do not replace a signed iPhone launch test. Expo's online compatibility check also reported newer SDK 57 patch releases for Expo/splash-screen; automatic install was blocked by a proxy timeout. No SDK-wide upgrade was included.

Build from version-2.2-testflight after pulling this commit:

```sh
git switch version-2.2-testflight
git pull --ff-only
npm ci
npm run check:startup
npm test
npx eas-cli@latest build --platform ios --profile production --clear-cache
```

Record the returned build ID and remote iOS build number. Submit that exact completed build, not an unspecified latest build:

```sh
npx eas-cli@latest submit --platform ios --id BUILD_ID
```

No signed build or Apple submission was performed for this correction. Keep existing app data. If the replacement still closes, obtain the newest BCC .ips crash report from iPhone Settings > Privacy & Security > Analytics & Improvements > Analytics Data and match its app version/build to the installed TestFlight build.
