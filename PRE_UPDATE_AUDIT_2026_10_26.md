# Brighton Climbing Club — review before the next update

Reviewed 26 October 2026. Current reviewed source: version-2.1-testflight, commit 03c077d. This is a source review and mocked native journey audit, not a physical iPhone test. No application changes or Apple submission are included in this review.

## Findings

| Priority | Area | Evidence and consequence | Required correction |
| --- | --- | --- | --- |
| High | Official creation appears missing | ClubExperience.js ClubTrips restricts trip/meeting/social creation to List mode. Organiser admin shows no creation controls. The form and authorised routes remain present. Runtime reproduction confirmed switching List → Organiser admin removes the trip creation button. | Keep an authorised Create event entry visible in every Events mode and on Admin. Preserve distinct official and member-led paths. |
| High | Trips Committee role | Not in roleOptions, test roles, canManageTrip or TripPublication. Existing trip approval is Digital & Media / Digital & Brand Lead / Administrator; an ordinary Trip Organiser manages only assigned trips. | Add Trips Committee. Allow assignment/removal of Trip Organiser only, creation, approval, editing and management of every official trip. Administrator assigns Trips Committee and retains universal administration. Preserve privacy/data validation rules. |
| High | News and courses disappear | App.js stores both collections in component useState. Runtime creation → restart reproduces loss of submitted news and provider courses. Approval changes are also in those same arrays. | Save submissions, decisions and publication state through the existing persistent club store; keep editorial/provider approval boundaries and audit. |
| High | Partner requests disappear / actions are demonstrations | partnerRequests is component useState. Interest/contact-sharing actions only show alerts; no delivery or actual consent exchange occurs. CurrentUser in PartnerFinderWithConsent is the fixed top-level Stu identity rather than the selected actor. | Persist requests and use the current actor. Make statuses honest. Do not claim interest/contact requests were delivered before the real service exists. Respect each member’s directory/contact/partner visibility preferences. |
| High | Event changes are not saved | CalendarEventDetailWithAttendance keeps venue/contacts in local useState. Save meeting location only closes the editor and shows an alert. Runtime changing venue → Back → reopen restores the old venue. | Persist per-event overrides and read them in List, Calendar, event detail and Home. Log actor/time and keep committee visibility. |
| High | Weekly cancellation / welcoming contacts | CommitteeClubNight keeps cancellation and contacts in local state. Cancellation → leave Home → reopen loses the cancellation. Event detail has a separate contact state. | Persist date-specific cancellation and contacts in the shared event record, consistently across Home/List/Calendar. Cancelled dates must not accept new RSVPs. |
| High | Pending membership booking restriction | demoMembership changes the displayed membership, but is not supplied to TripOverview or join transitions. Runtime Pending Approval + ordinary Member + Jordan Lee still books the Fontainebleau trip. Expired membership is similarly not consulted by joining code. | Enforce approved, valid membership at the action and model boundary, including member-led signups. Retain permitted browsing. An admin role must not silently fabricate approval/payment/competence. |
| High | Saved roles do not determine effective permission | Role assignments persist, but permission checks are based on separately selected demoLevel. Assigning a role does not itself change that member’s effective role. This is a prototype wiring gap rather than proof of server authorisation. | Connect account roles to effective access; support multiple held roles. Isolate explicit test overrides from account permissions. Check assignment/removal, restart and ordinary-member denials. |
| Medium | Private audit is raw JSON and mixes subjects | AssessmentCentre renders all data.audit entries, including unrelated trip/financial/member events, using JSON.stringify. Runtime unrelated bank-info audit entry appears in Private audit history. Selecting a member does not filter that history. | Show readable assessment/assessor changes only, with member filter, added/removed labelled categories/skills, dates, actor, notes, scope and old/new values. Preserve the full immutable underlying records and restrict private access. |
| Medium | Unreadable member-led form | MemberJourneys s.page has no light background, so Frame green shows through. Dark headings/labels are unreadable; TextInput has no explicit text colour. Screenshot confirms. | Use a light content surface and explicit input/placeholder colours. Check every form and modal against the shared colour/button scheme on a real phone. |
| Medium | Bottom navigation | Current labels are Members and Membership, with P/M letter icons. They are visually confusing; My membership is also repeated as an inner section label. | Use People for the directory, Membership for the personal area; use recognisable icons and single-line labels. Remove redundant section headings where they add no navigation. |
| Medium | Newly approved members are not integrated everywhere | Directory, assessment picker, trip organiser picker and messaging member catalogue use hard-coded member arrays. Approving a new member does not automatically add them to these catalogues. | Derive active-member choices from shared member records, with role-appropriate filtering and migration of existing demo names. |
| Medium | Provider courses are separate from Events | eventsModel.build uses hard-coded course examples, trips and custom events, not the App.js courses array. Publishing a new provider course therefore does not put it in the shared Events list/calendar. | Include approved provider courses in the shared event source and open the actual provider course details, preserving external email booking. |
| Medium | Waiting list | No waiting-list implementation was found in current production JS. join throws “This trip is full.” Historical App.js snapshots 1.4.3, 1.6, 1.9.1 and 2.0 also contain no waiting-list references. | Treat as an earlier discussed capability still unimplemented, not a proven deletion in 2.1. Restore an explicit waitlist journey without overbooking or bypassing newcomer/competence checks. |
| Medium | Weekly meet creation | Weekly Monday examples are generated and date-specific contacts can be edited superficially, but no general working weekly-meet creation/series editor exists. | Preserve existing meets and add the authorised creation/edit/cancellation workflow required for club meets. Do not silently invent new real schedules. |
| Medium | Photos and menu attachments | Assessment displays photoUri if already supplied, but there is no working profile-photo selection flow. UploadButton only shows a future-picker alert; meal menu buttons also show alerts rather than opening stored attachments. | Add real file/photo selection and persistence when implementing these functions; maintain photo permissions and existing menu records. Do not label an alert as a completed upload. |
| Medium | Notification preferences / reminders | Notification switches have fixed true values and no-op handlers. Static reminder examples are mixed with real local updates; some historical controls still claim calendar/reminder actions without integration. | Persist preferences; distinguish real local updates from examples; remove unsupported delivery/calendar/scheduling claims until integrated. |

## Approved functions that remain in the reviewed source

- Home partner link, unofficial member-led trips, enhanced Admin entry, and payments off Home.
- Shared main List/Calendar event source, AGM/committee/social creation for permitted roles, ordinary member AGM/weekly-meet RSVPs, private committee-event visibility.
- Official trip submission and a separate publication-approval workflow (subject to discoverability and Trips Committee changes above).
- Capacity, separate newcomer allocation within total places, organiser decisions and missing-competence checks.
- UK day-by-day climbing preferences/groups, group changes and audit; international trips have no lift sharing or climbing pairings.
- Driver acceptance of lifts and audited administrator override; bunkhouse price acknowledgement, pending holds and bank receipt confirmation.
- Optional quantity-based bouldering mat hire, whole-trip price, stock holds, payment details and organiser/committee/admin receipt confirmation.
- Group meal date/time, choices, deadline and organiser pre-order list; attachment controls remain placeholders as noted above.
- Actual attendance/history separate from bookings and competence; self-declared grades/courses/qualifications remain separate from private assessment.
- Chair-appointed assessors, no self-assessment, observation date picker separate from approval time, private notes, approval actor/time, bouldering excluded from participation categories.
- Membership applications, trial/full records, editable dates, bank-confirmed renewal, card and granular photo/privacy settings (subject to gaps above).
- More retains News, Courses, committee details and safeguarding email.
- Central administrator inheritance remains, with the explicit exception of other participants’ private message bodies.

## Service work still outstanding — not a new loss

The repository is explicitly a device-local TestFlight prototype. Shared accounts, server-enforced permissions, cross-phone records/stock, actual push/scheduled notifications, live Pay by Bank and OS calendar integration are not connected. Manual transfer instructions and receipt confirmation are the implemented payment pathway. Course enquiries open the member’s email application and do not create an in-app provider booking.

Private messaging is intentionally disabled until a reviewed participant-only E2EE service exists. Preserve that block. The agreed deletion notices are seven days per direct/organiser message and trip end for lift messages; administrator access must never grant content-reading keys. This review does not demonstrate working encrypted messaging or server deletion.

## Verification performed

- Existing npm test: 72/72 passed on unchanged 2.1 source.
- Seven temporary diagnostic native journey checks reproduced: creation hidden by organiser mode; news lost after restart; course lost after restart; venue Save lost after reopen; weekly cancellation lost after reopen; pending member able to book; unrelated raw financial audit shown in assessment history.
- These diagnostic checks assert the observed defects; they are not passing regression tests for repaired behaviour.
- Compared App.js screen-function inventory against 1.4.3, 1.6, 1.9.1 and 2.0: no named historical screen functions removed. This alone does not establish feature reachability or correctness.
- Read current permissions, event projection, booking, assessment, persistence, communications, payments and planning implementations and prior release notes.
- User screenshots establish the physical contrast/navigation/history defects. No physical-device retest, signed build, Apple submission or new release has been performed.

## Next-update acceptance requirements

1. Retain existing records/storage identity, Expo identity and green icon/splash assets.
2. Implement Trips Committee without granting general administrator, membership, assessor-appointment or message-reading powers. Admin can perform all administrative actions; existing validation still applies.
3. Make official creation visible from List, Calendar and Organiser admin. Keep AGM, weekly meets, socials and courses visible in shared event views.
4. Fix the confirmed contrast, audit formatting and navigation faults.
5. Cover record persistence/reopening, member restrictions, approved-member catalogues and publication projections rather than only testing whether old screen functions still exist.
6. Add permission-positive/negative and actual create → save → restart → reopen journey checks for changed areas, then run all prior tests and an Expo iOS export.
7. Phone-check small screens, keyboard, accessibility text, input contrast, bottom labels and back navigation before claiming layout complete.

This audit establishes the repair scope. Features above are not marked fixed or shipped.
