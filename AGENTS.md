# Brighton Climbing Club app rules

## Administrator access — permanent requirement

Club Administrator can use every administrative feature, including features added in future updates. Use `access.js` (`allows` / `features`) as the central permission policy. Do not add a new role check that excludes Club Administrator. Cover new restricted operations with an administrator test and an ordinary-member denial test.

An administrator can appoint assessors, record another member's assessment, decide trip/newcomer bookings, manage members and renewal, publish trips/news/courses, manage events and roles, and override lift decisions. Record administrator overrides and the actor/time in the audit. Chair appointments and driver decisions remain the normal pathways for other roles.

Administrator access does not remove data validation: payment confirmation, capacity, consent, valid observation dates and no self-assessment still apply. It does not grant access to other members' private message bodies. Member-facing approvals must not reveal private assessment notes or audit details.

## Preserve previous work

Compare each release against its immediate predecessor. Preserve approval pathways, historical screen functions, persisted records and green icon/splash assets unless explicitly changed by the user. International trips have no lift sharing or climbing pairings.

Main navigation should group related tasks and open actual working content in one step. Lists/forms may scroll; keep text readable. Assessment observation dates use a selectable calendar, default to UK today for a new record, and remain separate from the automatic approval timestamp.

Run `npm test` and an Expo iOS export before preparing a test release. Mocked screen checks do not establish physical phone layout fit. This is a device-local prototype: do not claim cross-phone message delivery, server-enforced authorisation/deletion, or Apple submission without evidence.
