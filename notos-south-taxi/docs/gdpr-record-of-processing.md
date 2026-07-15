# Record of Processing Activities (GDPR Art. 30)

**Controller:** Martin Preci, trading as Notos South Taxi
**Address:** Apollonos 10, Vouliagmeni 166 71, Greece
**Contact:** precimartin4@gmail.com
**Document date:** 2026-07-15
**Next review:** 2027-07-15 (or on any change to the processors or data below)

> This is an internal accountability record kept under Article 30(1) GDPR. It was
> prepared from the booking system's actual data flows as a starting point. It is
> not legal advice; Martin should review it, correct anything inaccurate, and keep
> it up to date. A data-protection lawyer's sign-off is recommended before relying
> on it in any dealing with the supervisory authority.

---

## 1. Purposes of processing

- Taking and fulfilling taxi / private-transfer bookings.
- Taking the online booking deposit and confirming payment.
- Notifying the assigned driver so the trip can be performed.
- Sending the customer a booking confirmation and any update.

**Legal basis:** performance of the transport contract with the customer,
Art. 6(1)(b) GDPR. Retention of proof of payment rests on a legal obligation
under Greek tax law, Art. 6(1)(c).

## 2. Categories of data subjects

- Customers who make a booking through the website.

## 3. Categories of personal data

- Identity: full name.
- Contact: email address, phone number.
- Trip details: pickup and drop-off locations, date and time, optional flight
  number, free-text notes, passenger / luggage / child-seat counts.
- Payment: payment confirmation reference only. No card details are collected or
  stored by us; card data is handled directly by Viva Wallet.

No special-category data (Art. 9) is intentionally collected. Customers should be
discouraged from entering sensitive information in the free-text notes field.

## 4. Recipients / processors

| Processor | Purpose | Personal data shared | Location | Transfer safeguard |
|-----------|---------|----------------------|----------|--------------------|
| Viva Wallet | Payment processing | Name, email, phone, payment reference | EEA (Greece) | N/A (within EEA) |
| Upstash | Booking database (KV) | Full booking record | Check active region | Verify; SCCs if non-EEA |
| Resend | Confirmation + driver notification email | Full booking record incl. email | US | Standard Contractual Clauses / provider DPA |
| CallMeBot | WhatsApp notification to the driver | Name, phone, pickup/drop-off, time, vehicle, price (email deliberately excluded) | Outside EEA (unverified) | **None in place, see section 7** |
| Geoapify | Address autocomplete (custom addresses only) | Partial address text entered by the customer | EU | Provider terms |
| Google Maps | Distance calculation (custom addresses only) | Address text | US | Standard Contractual Clauses / adequacy |

## 5. Transfers to third countries

Some processors (notably Resend and Google) are based outside the EEA, mainly in
the United States. Where personal data is transferred outside the EEA, the intended
safeguard is the European Commission's Standard Contractual Clauses or an adequacy
decision, as applicable to each provider. CallMeBot is the exception, see section 7.

## 6. Retention

- **Operational booking data** (name, contact, pickup/drop-off, trip details) is
  deleted automatically within 48 hours of the scheduled trip time. This is enforced
  by a per-booking time-to-live in the Upstash KV store, keyed off the pickup time
  (`RETENTION_BUFFER_SECONDS` in `lib/db.ts`).
- **Proof of payment** is retained by Viva Wallet for the period required by Greek
  tax law (currently 5 years). We do not separately retain operational personal data
  beyond the 48-hour window.

## 7. Residual risk: CallMeBot (accepted and documented)

CallMeBot is a free third-party relay used to send the new-booking WhatsApp alert to
the driver. The following gap is known and has been assessed:

- **Issue:** no written Art. 28 data-processing agreement is in place with CallMeBot,
  and its processing location / transfer safeguards are not documented by the provider.
- **Why it remains:** a compliant WhatsApp Business API provider that offers a DPA is a
  paid service, and the business has decided not to take on that cost at this stage.
- **Mitigations applied:**
  - The customer's email address is deliberately **excluded** from the WhatsApp
    message; only the data the driver needs to perform the pickup is sent (name, phone,
    route, time, vehicle, price).
  - Operational data is short-lived (48h retention, section 6).
  - CallMeBot is disclosed to customers as a recipient in the public privacy notice.
- **Decision:** the controller accepts this residual risk for now, having minimized the
  data exposed. It will be revisited if the booking volume grows, if a customer
  complaint arises, or if an affordable DPA-backed alternative becomes available.

_Accepted by: Martin Preci — date: ____________________ (sign on adoption)_

## 8. Data-subject rights

Customers may exercise access, rectification, erasure, restriction, portability, and
objection by emailing precimartin4@gmail.com. Requests should be actioned promptly
(within one month, Art. 12(3)). Customers can also lodge a complaint with the Hellenic
Data Protection Authority (www.dpa.gr). The website also lets a customer edit safe
booking details themselves before the trip, using their booking reference plus the
email they booked with.

## 9. Technical and organisational security measures (Art. 32)

- Payment card data never touches our systems; it is handled by Viva Wallet (PCI-DSS).
- HTTPS/HSTS enforced; a Content-Security-Policy and standard security headers are set
  on every route.
- Booking data is short-lived (48h) and auto-expires; no long-term customer database.
- The booking API validates and length-caps all input, rejects oversized bodies, and
  uses a honeypot against bots.
- Self-service booking edit/cancel is gated on booking reference plus matching email.
- Secrets (API keys, tokens) are stored as environment variables, not in the codebase.

---

*Maintained in the repository so it stays close to the system it describes. Update this
file whenever a processor is added or removed, the retention window changes, or the
CallMeBot decision in section 7 is revisited.*
