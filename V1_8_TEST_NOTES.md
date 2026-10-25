# BCC 1.8 test release

Based on the complete 1.7 commit 90446b8d12f4c721c425d0ed70e8cc60a1619f4d. Green icon/splash assets, Expo owner/project/bundle identity, local storage key and historical screen functions are retained.

## Simpler navigation

- Membership has My membership / Members / Manage members tabs. Manage members appears only where a role has access; Applications, searchable Records, Renewals, Assessments and Roles open working content directly. Unauthorised sections are not supplied to the screen.
- Trips retains List / Calendar, with Organiser admin for organisers and committee. An organiser's queue lists their assigned trips; committee/admin retain broader access. Choosing a trip in that queue opens its actions directly. Within each trip, Overview and Organiser admin provide direct access to requests, log, WhatsApp, travel and accommodation.
- Meal buttons open the actual meal form; climbing-preference buttons open the actual preferences. Organiser messaging opens individual conversations directly. Committee/support shortcuts remain for continuity.
- Assessment member selection is immediately available, without a separate launcher page. The calendar picker defaults new records to today's UK date, retains existing observation dates on edit, disables future dates and records approval time independently.

## Climbing arrangements

Unpaired / Paired / Everyone views show confirmed attendees for a selected day. Red background plus a text label identifies missing trip-specific approvals; amber indicates an approved newcomer allocation where requirements are met. Profiles, member-declared lead/second/partner preferences, approved categories and existing group numbers are visible. Pair/Change opens selectable attendees directly, with members meeting recorded requirements first and unpaired members first within that list. Sorting does not determine compatibility or supervision suitability.

Groups can contain two or more attendees. Existing multiple-group membership is supported, and groups remain day-specific. Edit, remove, notify and full profile access remain. Missing approvals require explicit review and recorded participation arrangements before saving. Grouping never creates a skill approval or approves a newcomer booking. Group changes retain before/after audit records and persist.

## Administrator rule explicitly changed by the user

Club Administrator is the central all-features role for current and future changes. `access.js` maps every feature permission to true for this role, including new keys. AGENTS.md records the rule for future contributors. The user explicitly authorised overriding the previous Chair-only appointment and driver-only lift restrictions for administrators.

Administrators can appoint/remove assessors and record another member's competence without a separate appointment. Those decisions have an explicit override audit flag. Administrators can accept/decline others' pending lift requests with actor/time/override metadata, driver notification and the existing audit. They can configure and approve renewals, manage membership/roles, publish trips/news/courses, create meeting/social events, manage any trip's groups/attendance/newcomer decisions and use existing accommodation approval controls.

No self-assessment; no bypass of capacity, payment confirmation, booking/consent or date validation. Private message contents remain participant-only. Membership record, renewal and committee role changes now persist and record audit changes. Assessor records and member-visible approval categories remain separate.

## Validation and limits

Run npm test for retained and new model/screen regressions, including ordinary-member denials, central future-feature policy, administrator overrides, calendar choice, direct membership tabs and day-by-day groups. Expo iOS export validates bundle generation. No new dependencies are required. Physical phone layout review and a signed EAS build remain necessary.

All 1.7 local-prototype limitations continue: messages/notifications are simulated on a device, not delivered across phones; role selection is a demo control; server-side enforcement, retention and authentication remain backend work. No Apple upload has been started by this change.
