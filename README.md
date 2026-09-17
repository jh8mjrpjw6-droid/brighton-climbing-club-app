# Brighton Climbing Club app

This is the installable Expo project for the BCC committee beta.

## Current approved scope

- Green BCC branding with the supplied cliff logo and a separate Home tab
- Member sign-in plus a limited guest view of trips, events, joining and contact links
- Trip creation, organiser details, beginner support, wet-weather plans, accommodation, social menu and notifications
- Trip partner selection, decide-later option, mixing-partners preference and organiser pairing board
- News feed and trip reports with optional member notifications
- Digital membership card with Full, Trial, Pending and Expired states
- Administrator-only membership approvals and trial/full membership controls
- Member-first committee-role assignment with multiple roles per person
- Chair, Vice Chair and Secretary administrator access
- Protected Club Administrator access for Stu Block as app maintainer
- Committee and administrator permissions remain active until removed; they are separate from membership expiry
- Profile-photo prototype, partner links and safeguarding email hand-off

## Important beta limitation

The interface and permissions are demonstrator data held on the device. Before public release, authentication, the shared database, server-side role enforcement, secure notifications and audit history must be connected.

## TestFlight build

1. Install dependencies with `npm install`.
2. Sign into the `stublock` Expo account with `npx eas-cli@latest login`.
3. Build with `npx eas-cli@latest build --platform ios --profile production`.
4. Submit with `npx eas-cli@latest submit --platform ios --latest`.

An active Apple Developer Program membership is required for the build and submission.
