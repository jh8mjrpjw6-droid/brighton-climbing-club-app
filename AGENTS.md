# Brighton Climbing Club app rules

## Administrator access — permanent requirement

Club Administrator can use every administrative feature, including features added in future updates. Use `access.js` (`allows` / `features`) as the central permission policy. Do not add a new role check that excludes Club Administrator. Cover new restricted operations with an administrator test and an ordinary-member denial test.

An administrator can appoint assessors, record another member's assessment, decide trip/newcomer bookings, manage members and renewal, publish trips/news/courses, manage events and roles, and override lift decisions. Record administrator overrides and the actor/time in the audit. Chair appointments and driver decisions remain the normal pathways for other roles.

Administrator access does not remove data validation: payment confirmation, capacity, consent, valid observation dates and no self-assessment still apply. It does not grant access to other members' private message bodies. Member-facing approvals must not reveal private assessment notes or audit details.

## Preserve previous work

Compare each release against its immediate predecessor. Preserve approval pathways, historical screen functions, persisted records and green icon/splash assets unless explicitly changed by the user. International trips have no lift sharing or climbing pairings.

Main navigation should group related tasks and open actual working content in one step. Lists/forms may scroll; keep text readable. Assessment observation dates use a selectable calendar, default to UK today for a new record, and remain separate from the automatic approval timestamp.

Run `npm test` and an Expo iOS export before preparing a test release. Mocked screen checks do not establish physical phone layout fit. This is a device-local prototype: do not claim cross-phone message delivery, server-enforced authorisation/deletion, or Apple submission without evidence.

## Bouldering, hire and private messages

Bouldering is experience, not a competence approval. Do not reintroduce indoor/outdoor bouldering approval categories or gate bouldering trips on them. Retain professional bouldering instructor qualifications as declared education, separate from participation approval. Preserve historical audit entries when migrating existing assessment data.

Bouldering mat hire is optional per bouldering trip (UK or international), quantity-based, priced per mat for the whole trip. Reserve stock while payment is pending; require organiser/committee/admin bank-payment confirmation before confirming. Payment links require a configured provider and backend: never infer payment success from opening/returning from a URL.

Only conversation participants may read message content. This overrides administrator all-features access: no admin/committee/operator reading, plaintext logging, notification previews or escrow keys. A reviewed end-to-end encryption implementation and service are prerequisites for enabling real messaging. Current send is deliberately blocked; do not restore plaintext demo entry as a shortcut. Show the deletion warning before messaging: each direct/organiser message seven days, lift messages at trip end. Do not promise that recipients cannot copy or screenshot.

## Event visibility regression guard

List and Calendar must use the same shared `eventsModel.build` source. The default main list is All events: trips, weekly meets, AGM, socials, courses and authorised committee meetings. Do not replace it with a trip-only feed. Test actual visible event classes, attendance entry points and newly created events after restart in both views; retaining screen functions alone is not proof that the features remain reachable.
