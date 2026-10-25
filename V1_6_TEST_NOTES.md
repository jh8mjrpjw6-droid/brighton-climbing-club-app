# Brighton Climbing Club 1.6 TestFlight update

## Baselines and preserved behaviour

Compared against version-1.5-testflight and version-1.4.3-build-8, including the features missing from 1.5. The exact green icon, adaptive icon and splash image are restored from 1.4.3. Existing Expo project, owner, bundle identifier and remote automatic build numbering remain unchanged.

Preserved screens and entry points: public guest preview; club-night RSVP, welcoming contacts and cancellation; calendar chronological/month views; committee meeting and AGM creation, locations and attendance; social creation and attendee lists; courses, provider portal and approvals; news and message approval; membership cards, onboarding, trials and administration; membership renewal; member grades, photo/privacy controls; partner finding/contact-sharing consent; day-by-day partner preferences and organiser groups; meal attendance, multiple menus, pre-orders and reminders; lift requests/acceptance; bunkhouse payment confirmation; safeguarding email; committee/admin role management.

Intentional changes: the old novice-support endorsement editor is replaced by private observed-participation competence records. Generic committee/admin status no longer grants assessment editing. Only the Chair can appoint/remove assessors, and only current appointees can assess other members. This does not confer teaching/supervisory authority. Members see approved trip categories only. Home, trip and profile sections use expandable panels to reduce scrolling.

## Demo data

- Portland sport weekend: UK, two lifts, Friday group meal, two newcomer places within the total.
- Peak District trad weekend: UK, lift, provisional-price bunkhouse, Saturday meal, newcomer allocation.
- North Wales: UK, lift, multi-pitch and abseil requirements.
- Fontainebleau: international bouldering, suggested flights and trip cost, no lifts or pairings.
- Costa Blanca: international sport, suggested flights and trip cost, Monday meal, no lifts or pairings.
- Past Peak District weekend: confirmed attendance and partners for history testing.

All are clearly marked DEMO, not actual bookings or flight recommendations. UK lift drivers have demo trip bookings. Blank bank details and renewal fees must be configured through the Secretary test view; no live financial details were invented.

## Testing on a device

In More, choose a test role. Expand Test account to select a demo member when testing requests and approvals. Test identities and test roles are independent controls, not production authentication.

Alice Denning starts as a Chair-appointed assessor. Stephen Wilmot can be used with the Chair test role to appoint another assessor. Switch to that appointed person and Appointed Assessor role to record observations for another member. Use Member role to verify only approved categories appear, not notes, assessor identity or decision history.

Trip requirements use observed/confirmed categories and skills. Missing requirements are explained at joining. Newcomer requests reserve an allocation within the total and require explicit organiser acceptance. Organisers can confirm actual attendance from the trip start date, select actual partners, and correct it later; booking alone does not create experience history. Members can add a clearly member-reported note/correction.

Qualifications are hidden behind an optional toggle. Records distinguish training from assessment passed and allow date, awarding body, optional certificate/registration number and optional expiry. No qualification automatically grants a trip approval.

Meal headings are derived from the organiser's date/time, separate from the choices deadline. Partner preferences and groups use actual trip dates, not fixed Saturday/Sunday labels.

## Persistence and limitations

New trip records, lift/bunkhouse requests, meals, member courses/qualifications/experience, attendance, assessor appointments and full before/after audit events persist locally via the Expo-compatible AsyncStorage version. The new audit is append-only through the app's decision flows, retaining withdrawals and removed assessors. Load/save errors are surfaced and can be retried.

This remains a device-local prototype. It does not provide cross-phone synchronisation, authenticated server-side authorisation, tamper-proof audit storage, payment processing, external notifications, actual phone-calendar integration or certificate verification. Existing reminder/menu/email mock behaviours remain demonstrations. Do not use for real competence decisions or bookings until the shared backend and access controls exist. Prior 1.5 in-memory data cannot be migrated after the app was closed because it was never stored.

## Validation

Run npm test for model and mocked React screen regressions. Tests cover Chair-only appointments, assessor revocation, member-safe approval projection, requirement gaps, newcomer capacity/acceptance, attendance/history, partner validation, UK-only demo lifts, date validation, restart persistence, international UI, meal dates, private UI and historical meeting/social/profile routes. Expo iOS export validates the Hermes bundle. UI tests use mocked native components and do not replace device rendering checks. Online Expo compatibility lookup timed out; the storage dependency is matched to this Expo installation's bundledNativeModules.json.

Version 1.6.0 is prepared; no signed EAS build or TestFlight submission has been started by this change.
