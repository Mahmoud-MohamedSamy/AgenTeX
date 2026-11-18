# Global Sets | Deleting an unused value, or opening "Where is this value used" on it, crashes the Settings page

**Summary**
In the Edit Global Set dialog, the Unused Values section shows two icons on each unused value: "Where is this value used" and Delete. Clicking either one replaces the whole Settings page with "Something went wrong". So an unused value can't be deleted from the screen, and any unsaved edits in the dialog are lost. Deleting the same value through the API works. Found while retesting NDC-2870 (gap item 2, "Delete an unused value for good").

**Steps to Reproduce**
1. Go to CRM > Setup > Modules and Fields > Global Sets.
2. Open a set that has at least one unused value (e.g. "QA RT19 GS Tier", unused value "Copper"; any value removed from the list goes to Unused).
3. In Edit Global Set, scroll to Unused Values.
4. Click the "Where is this value used" icon next to the unused value.
5. Reload, open the set again, and click the Delete (bin) icon next to the same unused value.

**Expected Result**
- Step 4: a panel lists where the value is still used, or says it is not used.
- Step 5: a confirmation, then the value is deleted for good. A value still in use is refused with a clear message.
- The page keeps working in both cases.

**Actual Result**
- Steps 4 and 5: the page shows "Something went wrong · An unexpected error occurred. Try refreshing the page or contact support if the problem persists." (Try again / Copy error details). The browser console shows a TypeError reading 'length'.
- The value is not deleted, and edits not yet saved in the dialog are lost.
- Control: the API works. POST …/global-sets/{id}/values/delete returns 200 for an unused value (deleted), 422 NOT_UNUSED for a used value, 409 IN_USE for an unused value still on a record, and 422 for two values at once.

**Environment**
staging-crm.taviportal.com (NDC-Staging), ndc-staging-owner, Edge, 16 Nov 2026.

**Suggested priority**: High (crashes the Setup page; the only screen path to delete a value is broken)

**Related**: NDC-2870 (Global Sets gap list, item 2)

**Evidence**: BUG-gs-unused-value-crash-FAIL.png, BUG-gs-unused-value-crash-vs-zoho.png

**Zoho CRM comparison**
Zoho deletes values only from Edit Global Set > gear > View / Add Unused Values, one value at a time. A value still in use is refused ("Option delete not allowed"), and two at once are refused ("More than one picklist value cannot be deleted"). The page keeps working. Seen live in a Zoho CRM test org on 11 Nov 2026.
