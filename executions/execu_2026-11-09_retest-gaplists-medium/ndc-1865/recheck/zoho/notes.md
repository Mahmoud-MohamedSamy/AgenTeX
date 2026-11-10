# Lane J: Zoho Desk comparison for findings C, D, E, G (10 Nov 2026, read-only)

Zoho screens: the techsolutionsegypt trial session loaded the Tickets list, but every Setup page (Departments, Templates, Integrations) stayed on the loading skeleton or showed "One of the scripts for this page has caused an error" across 3 tries each (raw/j1-setup.png, j2-setup.png, j3-setup.png, g-departments.png, c-templates.png). No write requests were sent. So all four points rest on Zoho help docs.

## C. Template subject in a reply
- Zoho: "You can apply the email template while replying to tickets... click the Template icon... The content from your template will be added to the response." Templates have a Subject field, but the docs describe applying a template as adding its content to the reply; no doc says the reply subject changes. A Zoho community answer says the subject of a ticket reply can't be customised in the editor. Templates sent as an alert do use the template subject (not a thread reply).
- Sources: https://help.zoho.com/portal/en/kb/desk/customization/templates/articles/using-ticket-and-email-templates-in-a-ticket-in-zoho-desk ; https://help.zoho.com/portal/en/kb/desk/customization/templates/articles/creating-and-managing-email-templates ; https://help.zoho.com/portal/en/community/topic/setting-the-email-subject-when-replying-to-a-ticket
- TAVI vs Zoho: same (reply keeps the thread subject). Not a bug.

## D. Delete sync Desk ⇄ CRM
- Zoho: sync runs on create, update, delete and mass update. Under Setup → Integrations/Marketplace → Zoho CRM → Configuration Details → Preferences, the admin chooses, for contacts, accounts (and products), what a delete on the other side does: delete the record and its associates (to the Recycle Bin), delete only if it has no associates (else remove the mapping), or never delete and only remove the mapping. Same choices both directions.
- Sources: https://help.zoho.com/portal/en/kb/desk/integrations-and-marketplace/sales-and-marketing/articles/integrating-zoho-desk-with-zoho-crm ; https://help.zoho.com/portal/en/kb/desk/faqs/integration/articles/faqs-zoho-desk-integration-with-zoho-crm
- TAVI vs Zoho: differs. Zoho makes delete behaviour a setting; TAVI just leaves the CRM copy (and parks the later sync). Gap, not necessarily a bug.

## E. Sync failure reporting
- Zoho: Sync History (last 7 days: date, direction, record type, added/updated/failed counts) and a Failure Log listing each failed record with time and reason, and a "Try Again" button per record. Docs list common errors (record mapped to another entity, wrong field type, missing mandatory field). No "parked" queue or automatic give-up count is documented.
- Sources: https://help.zoho.com/portal/en/kb/desk/faqs/integration/articles/faqs-zoho-desk-integration-with-zoho-crm ; https://help.zoho.com/portal/en/kb/desk/integrations-and-marketplace/sales-and-marketing/articles/integrating-zoho-desk-with-zoho-crm
- TAVI vs Zoho: similar design (TAVI has Sync History + Failure Log too); the "Parked" counter has no Zoho equivalent. The 423 shown vs 226 listed mismatch is TAVI-only and still a bug candidate (counts must match).

## G. Department visibility
- Zoho: a department is public or private through "Display in Help Center". Unchecked = private: used for internal ticketing, customers can't see it in the Help Center. A public department can be switched to private later (Edit → toggle). The default department can't be changed or disabled.
- Sources: https://help.zoho.com/portal/en/kb/desk/organization-settings/articles/managing-departments-in-help-desk ; https://help.zoho.com/portal/en/kb/desk/faqs/organization-settings/articles/faqs-organization-setting
- TAVI vs Zoho: Zoho keeps whatever the admin picks, so a department created as public must stay public. If TAVI saves "public" as "private" on create, that differs and is a bug (needs a TAVI recheck to confirm the save, which is outside this lane).
