# BCC 1.7 TestFlight: navigation, messaging and organiser activity

Baseline: version-1.6-testflight, commit f2795207a117a2735377d988f094aaaa32bcc1ef. The prior 1.4.3 restorations are retained. Existing green icon/adaptive/splash assets and Expo project identity are unchanged.

## What changed

- Main trip and member pages use menu buttons leading to full-screen native panels. Back returns to the previous panel. Forms, conversations, directories and logs can scroll; keyboard avoidance keeps controls reachable. Long lists are deliberately scrollable rather than reducing text size to force a fixed height. Physical-device layout review is still required.
- Trips have a visible List / Calendar switch. Display mode, month and upcoming/past selection are remembered. The compact month grid shows up to two labels per day; tapping a day opens its complete event list. Event creation and the colour key are menu screens.
- Courses completed is a multi-select checklist with Select all and Clear. Existing provider/date metadata and custom courses are preserved; optional details use their own screens.
- The personal member page contains membership/card/renewal, trip approvals, completed courses, experience, history, professional qualifications and privacy. Committee names are at More → About the club → Committee. Authorised administration is at More → Committee tools. Other support/settings and demo-role controls are at More → Settings and support.
- More → Member directory respects directory/contact/grade preferences. Member direct messages, organiser conversations and lift conversations are available within the test app. Multiple organisers remain supported (one to three per trip).
- Lift passengers request seats; only the offering driver accepts/declines. Each driver/passenger pair can exchange trip-scoped messages. Organisers/committee see pending request status without acquiring acceptance rights.
- Joining requires confirmation of the member's WhatsApp number and the displayed consent statement. Organisers receive a test notification. Consent text, number confirmation, timestamp and manual addition are retained in the private log. WhatsApp addition remains manual; a pending newcomer place must be approved before recording addition.
- Manage trip has action counts for requests, missing partners, requirements needing review, pending lift decisions and WhatsApp additions. Action counts and new-activity markers are distinct. The searchable event log supports activity-type and date filters. Message bodies are never copied to the audit log.

## Message retention and privacy

Each direct/organiser message expires seven days after sending; replying does not extend older messages. Lift messages expire at the UK end of the trip (including daylight-saving adjustment). Participant checks restrict message visibility; committee status does not grant access to private conversations. Notifications contain a sender notice, not the message body.

Expired messages are filtered on read and removed from local state on launch, foreground and periodic checks while running. Related empty conversations and expired message notifications are removed. Because this is a local prototype, data cannot be physically purged while the phone app is not running. Shared delivery, push notifications, reliable server-side retention/deletion, protected role enforcement and an updated club privacy notice require the shared backend. Do not describe the prototype as cross-phone messaging or server-enforced deletion.

## Retained approval pathways

| Pathway | Authority and prerequisite retained | Verification |
| --- | --- | --- |
| Trip publication | Organiser submits pending; Digital & Media / Club Administrator approves | Screen regression: hidden from ordinary members until approved |
| News / club-wide posts | Submitted pending; editorial/admin approval before publication | Screen regression |
| Partner courses | Provider submits; committee/admin approval before member visibility | Screen regression |
| Membership applications | Secretary, Membership Secretary or admin; full membership now requires confirmed payment | Screen regression including restart |
| Membership renewal | Opens 1 December; Secretary confirms transfer before updating expiry | Date-model and screen regressions |
| Assessor appointments | Chair only; appointment/revocation audited | Model regression |
| Competence approvals | Current Chair-appointed assessor, not self; private full audit retained | Model and private-screen regressions |
| Newcomer places | Reserved within capacity; assigned organiser / authorised trip manager approves arrangements | Model regression |
| Bunkhouse space | Organiser/authorised committee confirms payment within seven-day hold | Existing hold/payment model regression |
| Lift acceptance | Offering driver only, subject to capacity | Existing model and new message/acceptance screen regression |
| Actual trip attendance | Organiser / authorised trip manager; starts from trip date; partner record retained | Model regression |
| Committee / AGM / social events | Existing Secretary/admin and Social & Culture Secretary/admin creation permissions | Historical screen regression |

An older gap was corrected: the full-membership onboarding button previously did not enforce the payment checkbox. It now does. Trial approval is unchanged. Checklists/approvals persist so approved applications do not reappear or stay available for repeat approval.

Other retained features: guest preview, club-night RSVP/welcoming contacts/cancellation, course-provider portal and email enquiries, membership/trial administration, role assignment, grade and image/privacy preferences, consent-based partner finding/contact sharing, day-by-day preferences/groups, meal attendance/date/menus/pre-orders/reminders, UK lift/bunkhouse workflows, international flight/cost sections without lifts/pairings, attendance history, optional qualifications, safeguarding email and club partners. No previous App.js screen function was removed. Some legacy reminders, menu uploads, external notifications and calendar actions remain prototype demonstrations as before.

## Data and validation

The existing local storage key/schema is reused, preserving saved 1.6 records; new messaging, consent and UI preference fields are optional until used. Bank details and prices are not invented. Demo data stays clearly labelled. Test identities/roles remain test controls, not production sign-in.

Run npm test. The suite covers earlier competence/capacity/payment rules plus messaging retention/privacy, consent/addition, search filters, directory conversations, publication gates, membership payment approval, driver-only acceptance and calendar day navigation. Expo iOS export checks the bundle; mocked native screen tests do not replace TestFlight device review. No signed EAS build or Apple upload has been started for 1.7.
