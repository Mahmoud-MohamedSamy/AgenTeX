# Bug list — Custom Views v3 Backlog run (execu_2026-10-04_17-47-37)

Each defect has an annotated TAVI-vs-Zoho image (`screenshots/`). Severity is the tester's recommendation.

## 1. API accepts expired access tokens (JWT exp not enforced) as long as the session is alive

- **Case:** CVS-A10 · **Severity:** High
- **Steps to reproduce:**
  1. Sign in via POST /api/v1/iam/auth/login (x-tenant-id header) and keep the access_token; do not refresh it
  2. Wait until the token's exp claim has passed (token lifetime is 5 min)
  3. Call GET /api/v1/modules/{Leads}/views?kind=list with that bearer
- **Expected:** 401 for an expired token, no data
- **Actual:** 200 OK with the full view list 197 s after exp (server clock checked via Date header); only logout/revocation makes the token fail (401 SESSION_REVOKED)
- **Evidence:** [run-174737-d749-CVS-A10-vs-zoho.png](../bugs/screenshots/run-174737-d749-CVS-A10-vs-zoho.png)

## 2. today / yesterday / tomorrow criteria cut days at UTC midnight instead of the tenant's Cairo time

- **Case:** CVS-D08 · **Severity:** High
- **Steps to reproduce:**
  1. Set Date Time Permission on 4 FieldPermissions leads to 3 Oct 23:50, 4 Oct 00:10, 4 Oct 23:50 and 5 Oct 00:10 Cairo time
  2. Create a view: Name starts with 'QA CV' + Date Time Permission = Today
  3. Open it on 4 Oct (any time after 03:00 Cairo); repeat with Yesterday and Tomorrow
- **Expected:** Today -> the 00:10 and 23:50 records of 4 Oct; Yesterday -> 3 Oct 23:50; Tomorrow -> 5 Oct 00:10 (Cairo dates, as the app displays them)
- **Actual:** Today -> 4 Oct 23:50 and 5 Oct 00:10 (the app itself shows the latter as 05/10/2026 12:10 AM); Yesterday -> 3 Oct 23:50 and 4 Oct 00:10; Tomorrow -> none. Same in the Filter panel. See report for the 23:50/00:10 runs
- **Evidence:** [run-174737-d749-CVS-D08-vs-zoho.png](../bugs/screenshots/run-174737-d749-CVS-D08-vs-zoho.png)

## 3. Lookup criterion value is a plain text box - no record picker, so 'equals <record>' cannot be built in the UI

- **Case:** CVS-D16 · **Severity:** Medium
- **Steps to reproduce:**
  1. Leads > New custom view on the FieldPermissions layout
  2. Add criterion Lookup Permission > Equals
  3. Try to choose a contact (e.g. 'lead01') as the value; save
- **Expected:** A searchable list of the lookup module's records (as in Zoho); the view returns the leads linked to the chosen record
- **Actual:** Only a free-text box ('Value'), no suggestions; the typed name is stored literally and the view returns 0 records. Works only if the record UUID is pasted (server logic is correct)
- **Evidence:** [run-174737-d749-CVS-D16-vs-zoho.png](../bugs/screenshots/run-174737-d749-CVS-D16-vs-zoho.png)

## 4. Number criteria accept non-numeric values ('1e9' in the editor; 'abc', '15,000', Arabic digits via API) and silently match nothing

- **Case:** CVS-D05 · **Severity:** Medium
- **Steps to reproduce:**
  1. Deals > New custom view, Amount equals, type '1e9', Save
  2. Open the view
  3. API: POST /modules/{Deals}/views with amount equals 'abc'
- **Expected:** '1e9' read as 1000000000 or rejected with a message; API 400/422 for 'abc'
- **Actual:** Editor saves the string '1e9' -> 0 records; API returns 201 for 'abc', '15,000', '١٥٠٠٠', '1e9' and stores the raw strings (0 matches). Zoho's amount box only accepts digits
- **Evidence:** [run-174737-d749-CVS-D05-vs-zoho.png](../bugs/screenshots/run-174737-d749-CVS-D05-vs-zoho.png)

## 5. API stores a criteria operator that is invalid for the field type (contains on a currency field)

- **Case:** CVS-D19 · **Severity:** Medium
- **Steps to reproduce:**
  1. POST /api/v1/modules/{Deals}/views with criteria [{field:'amount',operator:'contains',value:'1'}] and pattern null
  2. GET /modules/{Deals}/records?view_id=<new view>
- **Expected:** 400/422 validation error, no view created
- **Actual:** 201 Created; the view applies a text match on Amount (29 of 51 deals for '1'). Unknown fields/operators are correctly rejected with 422
- **Evidence:** [run-174737-d749-CVS-D19-vs-zoho.png](../bugs/screenshots/run-174737-d749-CVS-D19-vs-zoho.png)

## 6. Grid appends unchosen Tags and Source columns to a view with a chosen column list; Manage Columns says 8 while 10 are shown

- **Case:** CVS-C09 · **Severity:** Low
- **Steps to reproduce:**
  1. Leads > New custom view, choose 8 columns and order them
  2. Save and open the view
  3. Open Manage columns
- **Expected:** Exactly the 8 chosen columns, in order
- **Actual:** 8 columns in the right order + Tags + Source appended; Manage Columns shows 'VISIBLE (8)'; Tags/Source cannot be chosen or removed in the editor
- **Evidence:** [run-174737-d749-CVS-C09-vs-zoho.png](../bugs/screenshots/run-174737-d749-CVS-C09-vs-zoho.png)

## 7. Empty or spaces-only view name: Save is silently disabled, 'Enter a name for the view.' is never shown

- **Case:** CVS-C02 · **Severity:** Low
- **Steps to reproduce:**
  1. Leads > New custom view
  2. Leave the name empty or type 3 spaces, tab out
  3. Look at the form and the Save button
- **Expected:** The message 'Enter a name for the view.' (Zoho: 'Custom view name cannot be empty.')
- **Actual:** No message anywhere; Save just turns disabled
- **Evidence:** [run-174737-d749-CVS-C02-vs-zoho.png](../bugs/screenshots/run-174737-d749-CVS-C02-vs-zoho.png)

## 8. ?view= with a deleted or foreign view id falls back to an arbitrary view ('QA CV tab2') instead of All Leads and overwrites the last-used view

- **Case:** CVS-B14 · **Severity:** Low
- **Steps to reproduce:**
  1. As OWNER open /modules/{Leads}?view=<deleted view id> (or another user's private view id)
- **Expected:** Fall back to All Leads (Zoho: 'The view you are trying to access is not available. Go To All Leads')
- **Actual:** Toast 'That view is no longer available. Showing your default view.' then 'QA CV tab2' opens and lastListViewId is rewritten to it
- **Evidence:** [run-174737-d749-CVS-B14-vs-zoho.png](../bugs/screenshots/run-174737-d749-CVS-B14-vs-zoho.png)

## 9. Deep link ?view= to a view of a non-default layout is dropped on a full page load

- **Case:** CVS-B14 · **Severity:** Low
- **Steps to reproduce:**
  1. Create a view on the Leads FieldPermissions layout
  2. Open /modules/{Leads}?view=<that id> in a new tab (full load), or reload while on it
- **Expected:** The FieldPermissions layout and the view open
- **Actual:** The Standard layout opens and ?view= is discarded; the view is only reachable by in-app navigation
- **Evidence:** [run-174737-d749-CVS-B14-vs-zoho.png](../bugs/screenshots/run-174737-d749-CVS-B14-vs-zoho.png)

