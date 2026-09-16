# Brighton Climbing Club iPhone beta

This is the installable Expo project for the BCC TestFlight demonstrator.

## Current scope

- BCC member home, calendar, directory and partner board
- Full and Trial membership cards with editable expiry dates
- Admin, Committee, Trip Organiser, Member and Trial Member demonstration roles
- Trip application questions and organiser approvals
- Membership-approval gate: pending applicants cannot request trip places
- Separate Trad, Sport and Indoor grade fields
- Top-rope and lead-belaying sign-off indicators
- Separate photo-consent choices for member communications, the website and social media
- Local demonstration data only; changes are not yet shared between devices

## Build for TestFlight

1. Install Node.js and EAS CLI.
2. Run `npm install`.
3. Run `npx eas-cli@latest login` and sign into the `stublock` Expo account.
4. Run `npx eas-cli@latest init` to create the Expo project ID.
5. Run `npx eas-cli@latest build --platform ios --profile production`.
6. Run `npx eas-cli@latest submit --platform ios --latest`.

An active paid Apple Developer Program membership is required for steps 5 and 6.
