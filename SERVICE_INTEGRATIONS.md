# Live payments and private messaging: required service work

## Pay by Bank

Desired journey: a server-created reservation with fixed quantity/amount/reference → authenticated payment request → provider-hosted bank selection → bank app approval → app payment-status screen. Bank credentials stay with the bank/provider.

TrueLayer documents hosted payment pages and payment links:
- https://docs.truelayer.com/docs/hosted-payment-page
- https://docs.truelayer.com/docs/payment-links-docs
- https://docs.truelayer.com/docs/payment-webhooks
- https://docs.truelayer.com/docs/create-a-payment

This is a researched integration option, not a selected or contracted provider. Club onboarding/eligibility, beneficiary account, fees, provider credentials, backend hosting and redirect registration must be established first. No payment provider account, secrets or live links are present in this repository.

Backend requirements:
1. Authenticate the member and authorised administrator separately from demo roles.
2. Create stock holds transactionally and calculate amount in integer pence from server-owned trip configuration. Never accept a price, beneficiary or paid flag supplied by the client.
3. Create an expiring payment session tied to reservation/member/reference with idempotency and a fixed beneficiary. Store credentials/signing keys only server-side.
4. Use a registered return URI. Opening or returning from a payment link is not proof of payment.
5. Verify provider-signed webhooks and reconcile amount, currency, reservation, beneficiary and provider payment ID exactly once. Distinguish failure, pending, execution and receipt. TrueLayer's settled status applies only to its merchant account; execution to an external club bank account does not by itself guarantee receipt. Keep organiser confirmation where receipt has not been independently verified.
6. Reconcile payment after a hold expires without overselling stock. Handle late payments and refunds with an explicit organiser workflow.
7. Notify the member of verified payment state; do not equate pressing Pay with confirming a booking. Existing newcomer/competence approval pathways remain separate.

Current build supports manual transfer instructions and organiser/committee/admin receipt confirmation. It does not move funds or provide the hosted bank-selection flow.

## Participant-only end-to-end encryption

Requirement: only explicitly participating members' trusted devices hold content-decryption keys. Chair, committee, Club Administrator, club operators and messaging server must have no content-reading route or escrow/recovery key.

Use a maintained, reviewed E2EE protocol and client implementation, not custom cryptography. Matrix's client-side E2EE design is one candidate for investigation, not an integrated dependency or a promise that every Matrix deployment meets the requirement:
- https://matrix.org/faq/
- https://matrix.org/docs/matrix-concepts/end-to-end-encryption/

Before enabling sending:
- Deploy authenticated messaging service and reviewed native client integration; verify device keys and participant membership, key changes and group membership changes.
- Store device private keys using platform-protected storage; participant-controlled encrypted recovery only, with no server/admin plaintext access. Revoke lost devices and communicate the limits of revocation for previously downloaded material.
- Encrypt message bodies on the sender device and decrypt on recipient devices. Keep plaintext out of server logs, analytics, crash reports, admin tools, notifications and backups. Metadata such as participants and timestamps must be minimised but is not necessarily hidden by content encryption.
- Explicitly prevent privileged roles silently joining existing conversations or receiving historic keys. Adding a participant must be visible and must not share past content without participant consent.
- Display and acknowledge the deletion policy before the first send, and show it in each conversation. Each direct/organiser message expires seven days after sending; replying cannot extend older messages. Lift conversations expire at the UK end of the trip.
- Enforce server encrypted-record deletion even when phones are offline; independently filter/purge client caches and encrypted attachments at expiry or next device activation. Define backup retention and key expiry. Do not claim deletion can erase screenshots, recipient copies or an offline device before it next runs.
- Test cross-device privacy, unauthorised access, no-admin keys, lost-device recovery, offline expiry, notification content and logs before making an E2EE claim.

Current code deliberately blocks production send and removes the previous plaintext demo composer. Synthetic message fixtures exist only in tests to retain participant/expiry policy coverage. Existing local plaintext test conversations are cleared on upgrade. No E2EE transport, keys, server or cryptographic guarantees exist yet; disabling entry avoids collecting new private text during this gap.
