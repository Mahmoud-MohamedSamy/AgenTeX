# Validation Rules | Edit validation rule dialog: fields touch the dialog edges and label / option styles are inconsistent

**Summary**
In CRM Settings > Modules and Fields > Validation Rules, the Edit validation rule dialog has no inner padding in its body, and uses two different styles for field labels and for radio groups.

**Steps to Reproduce**
1. Open CRM > Settings > Modules and Fields > any module > Validation Rules.
2. Click the pencil icon on an existing rule.
3. Look at the dialog body.

**Expected Result**
- The body has the same left and right padding as the header ("Edit validation rule").
- All field labels use one style.
- Both radio groups use the same layout.

**Actual Result**
1. Labels, inputs, dropdowns, toggles and radios start right at the dialog's left border. On the right, the inputs run up to the scrollbar. "Rule name *" sits directly on the header divider.
2. "Rule name *" and "Description" are in sentence case, while "LAYOUT" and "FIELD TO CHECK", which are also field labels, are in uppercase section-header style.
3. Under "When the rule is broken" the options are stacked with hints. Under "Show the error" they are side by side.

**Environment**
ndc-crm.anyware.software, Settings > Modules and Fields > Validation Rules, Edge, 18 Nov 2026.

**Suggested priority**: Low

**Evidence**: BUG-crm-valrule-dialog-layout-UI.png
