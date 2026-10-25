// Pure transitions shared by the prototype UI and tests. Live use requires server transactions.
const DAY = 86400000;
const whole = value => Number.isInteger(Number(value)) && Number(value) > 0;
const gbDate = now => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now).split('/').map(Number);
function renewalYear(now = new Date()) {
  const [, month, year] = gbDate(now);
  return month === 12 ? year + 1 : null;
}
function available(offer, requests) {
  return Math.max(0, Number(offer.spaces) - requests.filter(r => r.offerId === offer.id && r.status === 'Accepted').reduce((n, r) => n + r.seats, 0));
}
function acceptLift(offers, requests, id, actor) {
  const r = requests.find(x => x.id === id);
  const offer = r && offers.find(x => x.id === r.offerId);
  if (!r || !offer || offer.driver !== actor || r.status !== 'Requested') throw Error('Only the driver can accept a pending request.');
  if (!whole(r.seats) || r.seats > available(offer, requests)) throw Error('There are no longer enough spaces.');
  return requests.map(x => x.id === id ? { ...x, status: 'Accepted' } : x);
}
function bunkAvailability(capacity, bookings, now = Date.now()) {
  return Math.max(0, Number(capacity) - bookings.filter(b => b.status === 'Confirmed' || (b.status === 'Awaiting payment' && b.deadline > now)).length);
}
function approveBunk(bookings, id, authorised, paid, now = Date.now()) {
  const b = bookings.find(x => x.id === id);
  if (!authorised || !paid || !b || b.status !== 'Awaiting payment' || b.deadline <= now) throw Error('Approval requires payment confirmation and an unexpired request.');
  return bookings.map(x => x.id === id ? { ...x, status: 'Confirmed', paidAt: now } : x);
}
module.exports = { DAY, whole, renewalYear, available, acceptLift, bunkAvailability, approveBunk };
