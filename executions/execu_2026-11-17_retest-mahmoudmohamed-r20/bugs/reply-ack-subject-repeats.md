# Email | Reply acknowledgement subject repeats "Re:" and the ticket number

**Summary**
When a customer replies to a ticket email, the reply acknowledgement takes the customer's reply subject and adds "Re:" and the ticket number again, although both are already there. The customer receives "Re: Re: QA RT19 NTF 3000 ack test [#4745] [#4745]". Each further reply in the same conversation adds one more "Re:" and one more [#4745]. The reply itself is added to the right ticket and the acknowledgement text is correct. Found while retesting NDC-3000.

**Steps to Reproduce**
1. In a department with "Acknowledging a reply" turned on, send an email from a customer mailbox to the department's support address (e.g. subject "QA RT19 NTF 3000 ack test").
2. The customer receives the new-ticket acknowledgement "Re: QA RT19 NTF 3000 ack test [#4745]".
3. Reply to that acknowledgement from the customer mailbox (the mail client sends "Re: Re: QA RT19 NTF 3000 ack test [#4745]").
4. Look at the subject of the reply acknowledgement in the customer inbox.

**Expected Result**
- The subject has one "Re:" and the ticket number once, e.g. "Re: QA RT19 NTF 3000 ack test [#4745]", and stays the same for every further reply.
- Zoho Desk (checked live 17 Nov): the reply acknowledgement uses its template subject "[##${Cases.Request Id}##] Your reply has been received", and agent replies add one "Re:" and add the ticket tag only when it is missing, so the subject never repeats the tag.

**Actual Result**
- Subject "Re: Re: QA RT19 NTF 3000 ack test [#4745] [#4745]" (received 17 Nov 2026, 14:18 Cairo).
- The reply was added to #4745 and the body "Thanks — we have your reply on ticket #4745 and will get back to you shortly." is correct.

**Environment**
staging-desk.taviportal.com (NDC-Staging), QA RT19 NTF Dept with its own hosted address, customer = the QA lead's own Gmail, 17 Nov 2026. Zoho Desk test portal for the comparison.

**Suggested priority**: Low (cosmetic, grows with each reply)

**Related**: NDC-3000

**Evidence**: BUG-reply-ack-subject-repeats-FAIL.png
