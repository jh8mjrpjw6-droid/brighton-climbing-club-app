# Version 2.2 — restoration and Trips Committee

Baseline: complete version 2.1, commit 03c077d. Source branch: version-2.2-testflight. Expo version 2.2.0; local iOS/Android build number 16. EAS uses remote versioning and auto-increments the actual signed build number.

## Fixed and restored

- Saved account roles now determine normal access, including combined roles. Explicit Test settings role overrides are visibly separate, reset on identity changes and are not saved. The default Stu account retains its approved administrator access.
- Trips Committee can assign/remove Trip Organiser only, create trips, publish pending trips and edit/manage any official trip. Administrators assign the committee role and retain every administrative capability. No additional assessor-appointment or private-message content powers are granted.
- Official trip creation stays visible in List, Calendar and Organiser admin. AGM/committee/social creation stays role-filtered. A working authorised weekly-meet form can create 1–52 weekly dates.
- News, provider courses, partner requests and their approval/publication states now persist across restarts. Approved provider courses enter the shared Events list/calendar and open their actual course details/email enquiry.
- Event venue edits, welcoming contacts and individual date cancellation/restoration persist and project into Home/List/Calendar. Cancelled events reject new RSVP actions. The general event editor saves event details with actor/time audit.
- Pending, expired or unknown members cannot book official trips or add member-led signups. Approved-member catalogues feed the directory, assessor/role/organiser choices and per-day preferences.
- Official waiting lists retain consent and order without consuming places. Organisers/Trips Committee/admin can promote the earliest eligible member within the appropriate allocation after a place opens. Membership, capacity and competence are rechecked; newcomer promotions remain requests requiring organiser approval.
- Assessment history shows the selected member’s readable added/removed categories, before/after skills, notes, observation date, approval date and actor. It excludes unrelated financial/trip/member audit events. Historical underlying records are preserved.
- Light surfaces and explicit input colours fix the member-led form and uncovered Admin/payment pages. Larger green menu/action buttons remain, with distinct action/new-activity colours. Bottom navigation now has recognisable icons and distinct People/Membership labels.
- Profile photos, trip menus and news attachments use native pickers and copy selected files into durable app document storage. Assessments display the saved member photo; directory photos respect visibility preference. Menu/news attachments open through the native share/open sheet.
- Notification switches persist. Approved news/trips can create preference-filtered in-app notices on this device. Unsupported claims about live contact requests, scheduled reminders and phone calendar writes are removed from active controls.

## Preserved

Original storage key/schema, Expo project/bundle identity and green icon/splash assets; all prior named App.js screen functions; newcomer approval, capacity holds, UK day-by-day groups/preferences, driver/admin lift decisions, accommodation, quantity/price/stock-based mat hire, bank confirmation, meals, real attendance/history, Chair-appointed private assessments, no self-assessment, and separate observation/approval dates. International trips still have no lift sharing or climbing pairings. Bouldering remains experience rather than a competence approval.

## Validation

- 97 model and mocked native UI tests pass, including the 72 original tests and new create/save/restart, permission, membership, waitlist, photo/menu, catalogue, notification and audit checks. The original lift test now explicitly chooses a non-admin role because saved administrator access is correctly active by default.
- Expo iOS export and prebuild configuration validation run before release preparation.
- No physical iPhone test or signed EAS/Apple submission is claimed. Check text contrast, larger accessibility text, keyboard/back navigation, tabs, pickers and file opening on the new TestFlight build.

## Still requires a live service

This is a device-local prototype. Shared authenticated accounts/database, server permissions/stock/audit, cross-phone updates, actual push/scheduled reminders, live Pay by Bank and OS calendar writes remain external service work. Manual transfer instructions and authorised receipt checks remain the payment route. Course enquiries open email and do not create a provider booking in the app.

Private messaging stays disabled until reviewed participant-only E2EE exists. Administrators/committee never get message-reading access. Seven-day direct/organiser and trip-end lift deletion notices remain. Contact-sharing delivery is unavailable and now says so rather than claiming a request was sent. Native selected files remain on this device; they are not uploaded to a shared server.

## Build and install

In the existing Codespace:

```bash
cd /workspaces/brighton-climbing-club-app
git fetch origin
git switch version-2.2-testflight
git pull --ff-only
npm ci
npm test
npx eas-cli@latest build --platform ios --profile production
```

Wait for that version 2.2 build to finish successfully, then submit that specific build using the EAS build ID shown by the build command:

```bash
npx eas-cli@latest submit --platform ios --id YOUR_2_2_BUILD_ID
```

Using the explicit ID avoids accidentally submitting an older successful build if the new build fails. After Apple processes it, update from TestFlight and verify version 2.2.0. Do not delete/reinstall merely to upgrade: the original local storage key and saved records are retained.
