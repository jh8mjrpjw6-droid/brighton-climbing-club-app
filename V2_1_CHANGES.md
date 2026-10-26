# Version 2.1 — member journeys and layout

- Short Membership bottom tab label with single-line fitting prevents word fragments; full accessibility label remains My membership.
- Consistent large rounded green action buttons and selectable controls; selected states stay distinct.
- Home links directly to climbing partners, unofficial member-led trips and role-aware Admin. Payments stay under membership and booking services.
- Any member can post a basic member-led trip, register/withdraw interest, and see interested members. Clear unofficial notice asks participants to organise directly. Creators and administrators can cancel. Records persist on this device.
- Assessments open a dedicated member detail view, with saved profile photo when available and a labelled initials fallback. Category/skill ticks exclude bouldering, with private notes and automatic approval actor/date shown in edit and read-only views. Observation date remains separate.
- Admin on Home and More shows the current effective test role. Existing permission checks remain authoritative, including universal administrator administrative access and private-message exclusions.

Validation: npm test and Expo iOS export. Mocked native checks cannot verify physical iPhone layout. No signed Apple build or TestFlight upload is performed here. This remains a device-local prototype; shared production services remain outstanding.

Build from branch version-2.1-testflight, version 2.1.0, iOS build 15.
