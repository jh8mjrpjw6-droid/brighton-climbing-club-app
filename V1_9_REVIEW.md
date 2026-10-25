# BCC 1.9: ease-of-use review and changes

Baseline: complete 1.8, commit 9945fdfeeaccc1b33bb12a178dc18b162dd0a286. Review method: source walkthrough of all screen functions and regression checks of the principal member, organiser, committee and administrator journeys. This is not a physical-device or real-user usability study.

## Journey review

| Area | Finding and disposition |
| --- | --- |
| Welcome / guest | Retained sign-in choices and guest event preview. No new setup steps. Demo sign-in remains visibly distinct from production authentication. |
| Home / weekly night | Coming-up cards previously had no action. They are now compact buttons opening the actual trip directly, sorted by date. Club-night details remain behind one useful menu. Placeholder contact messaging no longer claims to send a message. |
| Trips | Added search by title, location or climbing type; clear no-results state; chronological Upcoming and reverse-chronological Past. Kept remembered List / Calendar switch and organiser tab. |
| Calendar | Retained compact month and direct full day-event list. No change to historical meeting, AGM or social event paths. |
| Trip overview | Retained concise summary and direct meals/preferences/conversation entry. Optional mat hire appears only for bouldering trips offering it. No mats section on unrelated trips. |
| Joining | Bouldering no longer requires a competence approval. WhatsApp consent and number confirmation remain. Other explicitly required rope skills/categories still apply to mixed trips. |
| Organiser work | Retained action counts, direct group planner, newcomer decisions, attendance, WhatsApp list and searchable private log. Added Mat hire reservations, pending counts and Mat hire log filter. |
| Climbing arrangements | Retained day tabs, Unpaired / Paired / Everyone, red requirement labels, declared preferences, profile access and audit. Removing bouldering approval avoids false red warnings for that activity. |
| Lifts / accommodation | Existing capacity, driver/admin decision rules, cost acknowledgment, seven-day hold and bank confirmation retained. Mat reservations now also block trip withdrawal until resolved. |
| Mat hire | One working screen: availability, per-mat whole-trip price, quantity −/+, calculated total, reservation, then bank instructions immediately on that screen. No extra Pay launcher page. Expiry, confirmation and cancellation/refund implications are explicit. |
| Membership / directory | Retained personal, directory and authorised management tabs. Existing search and payment gates remain. No additional personal-page administration menus. |
| Assessments | Retained calendar date selection and default UK today for new records. Bouldering removed from assessable categories; historical private audit retained. Professional Bouldering Wall Instructor qualifications remain member-declared education. |
| News | Full articles previously filled the main feed. Now the feed is a compact title menu; tapping a title opens the complete article and any report link in one step. Publication approval unchanged. |
| Courses / provider | Retained direct course detail/booking enquiry, member course multi-select and provider submission/committee approval paths. |
| More / committee / safeguarding | Retained committee information and support shortcuts. Administrator all-features rule remains central. |
| Messaging | Critical privacy conflict found: previous device-local demo messages were plaintext, not E2EE. Sending is now blocked at both the production model and UI. No private text input is offered. Notices explain future participant-only E2EE and deletion policy. Old local demo conversations are removed on migration; this does not establish deletion from pre-existing backups or old installed builds. |

## Mat booking rules

Optional on any bouldering trip, including international trips; international trips still have no lift sharing or climbing pairings. Organiser supplies stock, price per mat for the entire trip, and collection/return notes. Demo Fontainebleau has a clearly fictional six-mat, £12-per-mat example for new test data. Existing saved trips are not silently assigned new prices or services; organisers can enable hire by editing the trip.

Member must hold a confirmed trip place. Whole-number quantity reserves that many mats; duplicate active requests and excess stock are rejected. Reservation snapshots the exact total and bank details/reference. The payment hold is seven days or UK trip end, whichever is sooner. Expired holds free stock and cannot be approved late. Paid reservations keep their stock. Organiser, authorised committee or Club Administrator confirms receipt; a member cannot self-confirm payment. Member can cancel an unpaid hold; organiser/admin handles paid cancellations and refunds separately. Cancellation does not move money.

Existing paid/held quantities prevent stock being reduced below reservations or hire silently being disabled. Later price changes do not rewrite existing invoices. Requests, confirmations and cancellations retain actor/time and before/after audit and local notifications.

## Privacy and payment integration limits

Pay by Bank and end-to-end encrypted messaging are not connected in this build. Manual bank transfer remains the functioning prototype payment route. SERVICE_INTEGRATIONS.md records the needed live-service work; no fake bank-selection or encryption claim is shown to members.

The participant-only message-content rule overrides administrator access. Administrators still manage every administrative feature, including future ones; they never acquire message decryption keys. Future composition must show deletion warnings: direct/organiser messages expire individually after seven days; lift messages at the UK trip end. Recipients can still copy or screenshot before deletion.

## Validation and remaining usability work

Model and mocked native screen checks cover retained approval pathways, bouldering migration, quantity/stock/payment/expiry/cancellation, actor audit, administrator access, plaintext-send blocking, immediate payment display, home navigation, search and article opening. Expo iOS export validates bundling. Green assets and historical App.js screen functions remain unchanged.

A TestFlight phone review is still needed for small screens, larger accessibility text, keyboard visibility and calendar touch targets. Long forms, directories, message notices and event logs may scroll; forcing these into a fixed height would hide controls or reduce readability. Shared stock transactions, bank reconciliation, secure production roles and all cross-phone services still require the backend.
