# Web Forms | A form with no website listed shows on no website, although the Embed dialog says any website can show it
**Summary**: When a web form has no website in "Websites the form is on", the "Add it to your website" code shows nothing on any website. The Embed code dialog tells the admin the opposite: "No website is listed in the form's settings, so any website can show it." This happens in CRM and in Desk.
**Steps to reproduce**:
1. Open Settings › Web Forms (CRM) or Setup › Channels › Web Forms (Desk) and pick a form whose "Websites the form is on" list is empty.
2. Click Embed code and read "How to use it": step 3 says any website can show the form.
3. Copy the "Add it to your website" code and paste it into a page on a website (for example http://127.0.0.1:5500).
4. Open that page in a browser where you are not signed in.
**Expected result**: The form appears on the page, as the dialog says. Zoho Desk (checked live on 19 Nov 2026) has no website list at all: its feedback widget code shows the form on any website it is pasted into.
**Actual result**: Nothing appears. The form's session request answers 404 and the form request answers 404 "This form is not available." Adding the website to "Websites the form is on" makes the form appear and submit, so only the empty-list case is broken. Seen on CRM "QA RT18 2959 form" (Leads) and Desk "QA RT22 2751 desk empty" (Tech).
**Additional notes**: Either the empty list should allow every website (as the dialog and Zoho Desk do), or the dialog should say that a website must be listed before the code works. Found while retesting NDC-2751. Evidence: screenshots/annotated/BUG-wf-empty-website-list-vs-zoho.png
**Environment**: NDC-Staging, staging-crm.taviportal.com and staging-desk.taviportal.com, Edge (signed out on the test website), 19 November 2026. Zoho Desk reference: desk.zoho.com portal techegysolutions.
