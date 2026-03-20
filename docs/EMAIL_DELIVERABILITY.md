# Email deliverability (reduce spam folder) — `info@metalloscrap.com`

Most “lands in spam” issues are **not** fixed in React. They are fixed with **DNS** and **EmailJS / SMTP “From”** settings.

## 1. EmailJS template (do this first, 2 minutes)

In [EmailJS](https://www.emailjs.com/) → **Email Templates** → open the template used by the site (`template_q926awn`):

| Field | Recommended |
|--------|-------------|
| **From Name** | `Shreela Group` or `info@metalloscrap.com` |
| **From Email** | **Use Default Email Address** (checked) = your SMTP service’s verified sender (e.g. `info@metalloscrap.com`). There is no separate `from_email` field in the editor when this is on — that is correct. Never set From to the visitor’s address. |
| **To Email** | `{{to_email}}` or fixed `info@metalloscrap.com` |
| **Reply-To** | **`{{reply_to}}`** (required) so **Reply** goes to the customer — **not** `info@metalloscrap.com` |

If **From Email** is the visitor’s Gmail, corporate filters will often mark mail as **forged** (SPF/DKIM fail) → spam.

The app now sends `from_name: 'Shreela Group — Website'` and **never** sends the visitor as `from_email`.

## 2. DNS records (Hostinger — main fix for company inboxes)

Do this where **DNS for metalloscrap.com** is managed (usually Hostinger hPanel → **Domains** → **DNS / Zone Editor**).

### SPF (TXT on `@` or root domain)

- You must have **only one** SPF TXT record.
- It must **include** the servers allowed to send mail for your domain. For **Hostinger mail**, use the SPF value Hostinger shows in **Emails** → **Domain** → **DNS records** (often something like `v=spf1 include:spf.hostinger.com ...`).

If you use a different SMTP in EmailJS, the SPF `include:` must match **that** provider’s docs.

### DKIM

- In Hostinger **Emails** (or **Email Deliverability**), enable **DKIM** and add the **TXT** records they give you (selector + public key).
- Without DKIM, many **Microsoft 365 / corporate** filters score you as untrusted.

### DMARC (TXT on `_dmarc.metalloscrap.com`)

Start in monitoring mode:

```txt
v=DMARC1; p=none; rua=mailto:info@metalloscrap.com
```

After SPF + DKIM pass consistently (check reports), you can move to `p=quarantine` or `p=reject` with care.

## 3. Verify

1. Send a normal message from `info@metalloscrap.com` (same SMTP as EmailJS).
2. Paste the test address from [mail-tester.com](https://www.mail-tester.com) and send there — aim for **8+/10** and fix every red item (SPF, DKIM, DMARC, blacklist).

## 4. Code change summary

- Removed the fallback that sent `from_email: formData.email` (visitor address), which can cause **authentication failures** and spam placement.
- Single send path with `reply_to` for the visitor and a stable `from_name` for display if your template uses it.

If anything breaks after template edits, confirm variable names in EmailJS still match: `to_email`, `from_name`, `user_name`, `user_email`, `user_subject`, `user_message`, `subject`, `message`, `reply_to`.

**Email body (HTML):** Paste the HTML from `docs/emailjs-template-contact.html` into EmailJS → **Content** (HTML mode). Omit the `<!-- ... -->` comment at the top when pasting. Hostinger webmail and other modern clients render HTML email normally; SMTP only delivers the bytes—the inbox app does the rendering.
