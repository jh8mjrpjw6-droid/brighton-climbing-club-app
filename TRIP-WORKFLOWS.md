# Trip services and annual renewal prototype

This change extends the existing React Native / Expo prototype. All records remain in React state and reset when the app restarts. It is not a live booking, membership or notification service. No TestFlight build has been submitted.

## Behaviour

- Domestic trips: organiser can enable lift sharing. Attendees can offer a departure location, outbound/return departure times and passenger capacity, list themselves as looking, and request seats. Only the offering driver can accept. Acceptance checks remaining capacity. Requests can be declined or cancelled, and removing an offer cancels affected requests. Notifications appear in the recipient's in-app list.
- International trips: organiser supplies trip cost/coverage and suggested flights. Pairing preferences, pairing board and lift sharing are hidden. Bunkhouse booking remains optional.
- Bunkhouse: organiser supplies capacity, whole-stay provisional per-person price and an explanation of how numbers may change it. Member must acknowledge the variable cost. A request holds one place for seven days from request; payment instructions include a unique reference. Organiser/committee approval requires explicit payment confirmation before the deadline. Expired holds release capacity. Cancellation releases the place and tells the member to contact the organiser about payment/refunds. No automatic refunds are performed.
- Membership: renewals open on 1 December (Europe/London) for the following calendar year. Secretary configures the annual fee and transfer details. Request snapshots these details. Secretary must confirm receipt before approval updates the membership expiry to 31 December of the renewal year.
- Notifications and committee approval screens use the existing prototype identity and role controls. Secretary was added to the prototype role selector. Members never receive a production self-promotion facility.
- Bank details/fees are intentionally blank; configure through the secretary view. Bookings cannot be requested until valid transfer details are present. The same bank account is used for bunkhouse transfers.
- Existing linked arrangements block changes to trip type, availability, capacity, cost terms or title. Resolve them before changing these settings. The original app contains only one editable trip.

## Before live use

Connect the flows to authenticated accounts, durable shared storage, server-enforced roles and transactions. Scope all offers/bookings to stable trip IDs; remove demo role selectors. Make capacity acceptance and duplicate checks atomic, use authoritative server deadlines, audit approvals and acknowledgements, and deliver recipient notifications through the real notification service. Reconcile late payments rather than silently reallocating paid spaces. Add cancellation/refund policy appropriate to the club. Replace the fixed secretary notification recipient with role-based lookup.

## Validation

Run `node --test workflow.test.js` for date boundaries, seat capacity/driver permissions, hold expiry and paid approval. All changed JavaScript/JSX files were parsed using Babel. Device rendering, Expo bundling and multi-account end-to-end tests have not been run. TestFlight requires a separate build.
