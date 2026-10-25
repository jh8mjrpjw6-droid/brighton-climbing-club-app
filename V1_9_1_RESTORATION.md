# 1.9.1: restore all club events to the main list

Baseline: complete 1.9, a7b89c5e5753d4b6e03c14b9f54d39ef39247d77.

## Confirmed regression

The newer ClubTrips List rendered only trip records. AGM, weekly club nights, socials, courses and committee meetings remained in a separate older Calendar source. Historical screen-function checks and Calendar-only route tests therefore passed while the main list lost those event types. This was a navigation/content regression, not evidence that saved custom events were deleted.

## Fix

- List and Calendar now read eventsModel.build, one shared source for preserved demo AGM, club nights, socials, course entries, committee meetings, saved custom events and permitted trips.
- Monday weekly meets also appear around the current date and throughout the selected calendar month, instead of existing only as five hard-coded March 2027 examples. Generated entries remain demo records, without inventing additional real club schedules.
- Main List defaults to All events and supports Trips, Weekly meets, Meetings, Socials and Courses filters plus search and Upcoming/Past. Date-based ordering and pending-trip publication visibility are retained.
- Meeting/social creation is available from the List as well as Calendar for authorised roles. AGM remains visible to members; committee meetings are restricted in the shared source, including legacy records missing a committeeOnly flag.
- Event forms no longer ask for a redundant day number: the full event date determines the day and month.
- AGM/meet details still open the existing attendance and authorised controls directly. Existing prototype RSVP/phone-calendar demonstration limitations remain; this fix does not claim OS calendar integration or shared server attendance.
- The restored club-night detail no longer falsely says a private message was sent. It respects the 1.9 encrypted-messaging gate.

## Preservation and validation

No prior App.js screen function removed; green assets and the 1.9 storage key unchanged. Mat hire, payment checks, private assessments, administrator policy and blocked plaintext messaging remain.

Regression checks cover presence of every event class, ordinary-member versus committee visibility, weekly dates, date filtering, existing saved events, creation/restart of a new AGM, direct attendance navigation and presence in both list and calendar. Run npm test and Expo iOS export. A signed EAS build, TestFlight upload and phone layout review remain separate steps.
