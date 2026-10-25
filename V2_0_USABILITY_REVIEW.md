# BCC 2.0: integrated usability pass

Baseline: complete 1.9.1, commit 922db0f023ff6912aa03ab2503f13a667183d533. This combines the review and implementation in the existing Expo app. It is not a separate prototype or replacement project.

## Main navigation

| Destination | Working content |
| --- | --- |
| Home | Next recorded booking, personal bookings/payments, membership card, unread updates, weekly club night and next trip |
| Events | Shared All events List / Calendar source, type/search/date filters, AGM, weekly meets, trips, courses, socials and authorised committee events |
| Members | Direct directory, privacy-respecting contact controls, existing partner finder |
| My membership | Card/renewal, bookings/payments, trip approvals, courses, experience/history, qualifications and privacy; authorised member-management sections remain here |
| More | News, courses, messages availability notice, committee/club information, administrator/editorial tools, safeguarding, settings and sign out |

News and Courses no longer occupy separate bottom tabs but their existing detail, submission, provider and approval workflows remain. The five-tab bar now has selected-state accessibility labels, slightly larger labels and a minimum height that can expand rather than a fixed height. Main destinations preserve the existing underlying records and route functions.

## Reviewed journeys and integrated changes

| Journey | Problem found | Implemented result / evidence |
| --- | --- | --- |
| Find the next thing to do | Home mixed generic club information with unrelated tools | Next recorded booking and personal next steps lead to actual content; only one coming-up trip is previewed |
| Find an event | Earlier trips-only regression hid AGM and meets | 1.9.1 shared event source retained and visible event-class regressions still pass |
| Join a trip | Booking state and next actions were scattered across menus | Successful join opens My arrangements; booking/request status stays explicit; the join panel does not turn into an unrelated open details panel |
| Arrange travel, accommodation, mats or meal | Repeated launcher pages and duplicated action buttons | One My arrangements status/action list opens each existing working form directly; hidden panel triggers avoid a second menu; member-visible groups show names/dates without private assessment material |
| Pay for an extra | Members had to find the correct trip/service again | My payments lists only the current member's accommodation, mats and renewals with amount, status, reference and deadline; tapping a pending item opens the actual transfer details; Back returns to payments |
| Check personal bookings | No consolidated view, event responses were component-local | My bookings includes recorded trip places/newcomer requests and event RSVPs, with Upcoming/Past; weekly/AGM/social RSVP now persists on the device and is audited |
| Renew membership | Renewal must not become another generic booking flow | Existing card/renewal and Secretary/admin bank checks retained; entry/back context preserved; no automatic payment inferred |
| Organise a trip | Alerts were detached from decision controls | Needs attention links open the actual newcomer form, group planner or lift controls directly; accommodation/mat payment controls and activity log retained |
| Review skills | Need to simplify without weakening approval rules | Existing date picker, Chair appointment/admin override, private audit and no self-assessment remain; grouping still cannot grant competence or approve a newcomer booking |
| Check updates | Header permanently claimed 3 unread | Count derives from this member's actual local unread updates and clears when opened; no decorative invented badge |
| Open profile / sign out | Header showed SB for every identity and tapping avatar signed out | Correct member initials; avatar opens My membership; explicit Sign out lives in Settings and support |
| Complete a form with keyboard open | First button tap could merely dismiss keyboard | Native scroll forms use keyboardShouldPersistTaps=handled |

The panel implementation now supports direct opening from a task/payment row. Stable title keys avoid transferring an open panel's state to a different panel when conditional content changes. These are navigation changes; existing payment/approval transitions are reused.

## Permissions, privacy and history retained

- Administrator central all-current/future-features rule retained; no access to other participants' private message content.
- Trip, news, partner-course and membership approval paths retained, including payment confirmation, capacity/hold rules, driver/admin decisions and private assessment audit.
- Bouldering stays experience, not an approval category. Optional mat hire remains available for offered bouldering trips.
- International trips have no lift sharing or climbing pairings.
- Actual climbing attendance/history remains separate from an RSVP or booking. Event RSVP does not grant a skill approval or fabricate actual trip attendance.
- Public booking/payment projections filter by actor and permitted event visibility. Committee events remain role-filtered. Private assessment notes are not added to personal booking summaries.
- Green icon/splash assets, Expo identity and storage key retained. New eventResponses/notificationsSeen fields are optional; existing saved data remains usable.
- No historical App.js screen function was removed. News, courses, committee information, providers, safeguarding, privacy settings, partner finding, meal choices, old events and calendar routes remain reachable.

## Verification and honest limits

70 model and mocked native screen tests pass. The suite walks trip joining/extras, renewal, event creation/restart, weekly meet RSVP/restart, personal payment deep links/back, organiser newcomer decisions, ordinary/admin permissions, publication, privacy and all prior capacity/assessment rules. Expo iOS export passes.

This is a source/mock journey review, not a measured usability study or physical phone test. No invented usability score or claim that every screen fits every device. Directories, forms and logs may scroll; readable type and reachable controls take priority. Check small screens, larger accessibility text, keyboard focus, status wording and back navigation in TestFlight before judging the layout complete.

Shared cross-phone accounts, inventory transactions, actual push delivery, scheduled background reminders, bank-provider payments and server audit remain backend work. Private sending stays disabled until the E2EE service exists. OS calendar actions are not integrated; the updated RSVP screens no longer claim a calendar item was actually created. Some legacy demo controls (for example date-specific welcoming-contact/cancellation editors) remain prototype controls and need shared persistence/backend enforcement before live use.

No signed EAS build or Apple submission was started for 2.0.
