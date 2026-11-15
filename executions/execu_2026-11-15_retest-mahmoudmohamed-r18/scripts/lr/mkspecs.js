// Writes scripts/specs/NDC-<n>.json for the Layout Rules lane (run from scripts/specs).
const fs = require('fs'); const ENV = 'NDC-Staging · staging-crm · ndc-staging-owner · Leads › QA RT18 Layout · QA test data, removed at cleanup';
const S = (n, pr, title, v, panels, rows, env = ENV) => fs.writeFileSync('NDC-' + n + '.json', JSON.stringify({ out: `NDC-${n}-retest-${v}.png`, ticket: 'NDC-' + n, priority: pr, title, verdict: v, env, date: '15 Nov 2026', panels, rows }, null, 1));
const B = (b, n, kind = 'PASS') => ({ b, n, kind });
S(2974, 'high', "Layout Rules | Mass update of a rule's primary field is now blocked", 'PASS', [
 { img: '2974-3-field-disabled.png', caption: 'Leads list › 2 records selected › Mass Update › Choose a field: the rule primary fields are greyed out', crop: [512, 292, 580, 500], boxes: [B([555, 498, 885, 543], 1), B([555, 586, 885, 631], 2)] },
 { img: '2974-api-card.png', caption: 'API: mass-update of the primary field refused, nothing saved', crop: [0, 80, 1600, 260], boxes: [B([36, 146, 1564, 225], 3), B([36, 235, 1564, 272], 4)] }],
 [[1, 'Mass Update field list', 'Primary field of a layout rule cannot be mass updated (as in Zoho)', '"QA RT18 type" disabled: "Drives a layout rule — edit these records one at a time"', 'PASS'],
  [2, 'Another rule primary field in the list', 'Blocked', '"QA RT18 filter" (primary of rule QA RT18 filter) disabled too', 'PASS'],
  [3, 'POST records/mass-update type = Refund (order empty)', 'Refused (was 200, both saved)', "422 LAYOUT_RULE_PRIMARY_FIELD \"QA RT18 type cannot be mass updated: it is the primary field of the layout rule 'QA RT18 basic'\"", 'PASS'],
  [4, 'Records after the call', 'Unchanged', 'Both still Question, order empty', 'PASS'],
  [5, 'Mass update of a normal field (control)', 'Still works', 'qa_rt18_note → 200, saved', 'INFO']]);
S(2975, 'high', 'Layout Rules | Inline edit now asks for the rule-mandatory field in "Review details"', 'PASS', [
 { img: '2975-2-after-confirm.png', caption: 'Record page › inline edit QA RT18 type → Refund › Save: "Review details" pop-up asks for QA RT18 order', crop: [520, 300, 1060, 560], boxes: [B([544, 331, 1056, 569], 1)] },
 { img: '2975-3-review-filled.png', caption: 'Order filled in the pop-up, then Save', crop: [520, 300, 560, 300], boxes: [B([560, 420, 1040, 495], 2)] },
 { img: '2975-4-saved.png', caption: 'Recent activity: type Question → Refund and order filled in one save', crop: [290, 480, 910, 130], boxes: [B([430, 524, 830, 588], 3)] }],
 [[1, 'Inline edit type → Refund, confirm', 'Pop-up asking for the mandatory field, with Cancel and Save (Zoho "Review Details")', '"Review details — This change makes these fields mandatory. Fill them in to save it." with QA RT18 order*, Cancel, Save', 'PASS'],
  [2, 'Fill order in the pop-up and Save', 'Change saved', 'PATCH 200; pop-up closes', 'PASS'],
  [3, 'Record read back', 'type Refund + order filled', 'API: Refund / "QA RT18 G4 order"; timeline shows both updates', 'PASS']]);
S(2976, 'high', 'Layout Rules | Deal stage bar now opens "Review details" for the mandatory field', 'PASS', [
 { img: '2976-1-click-negotiation.png', caption: 'Deal "QA RT18 deal G9" (discount 30) › click stage Negotiation: pop-up asks for the approval note', crop: [290, 320, 1290, 270], boxes: [B([544, 331, 1056, 569], 1)] },
 { img: '2976-3-saved.png', caption: 'After filling the note and Save: stage Negotiation, note stored', crop: [290, 335, 1290, 400], boxes: [B([948, 403, 1037, 431], 2), B([1230, 686, 1400, 727], 3)] }],
 [[1, 'Click Negotiation (rule: stage Negotiation and discount > 20 → approval note mandatory)', 'Pop-up asks for the mandatory field before moving (Zoho)', '"Review details" with QA RT18 approval note*, Cancel, Save (the first PATCH 422 is caught by the pop-up)', 'PASS'],
  [2, 'Fill note, Save', 'Stage moves', 'PATCH 200; stage bar on Negotiation', 'PASS'],
  [3, 'Record read back', 'stage negotiation + note', 'API: negotiation / discount 30 / "QA RT18 approved"', 'PASS']],
 'NDC-Staging · staging-crm · ndc-staging-owner · Deals (Transactions) › QA RT18 Deals layout · QA test data, removed at cleanup');
S(2977, 'high', 'Layout Rules | Blueprint transition form now shows the rule-mandatory field', 'PASS', [
 { img: '2977-1-transition-dialog.png', caption: 'Lead "QA RT18 bp rec" › transition "QA to Refund": QA RT18 order* is in the form', crop: [520, 190, 560, 520], boxes: [B([565, 350, 1035, 405], 1)] },
 { img: '2977-2-execute-empty.png', caption: 'Execute with order empty: "This field is required", form stays open', crop: [520, 180, 560, 540], boxes: [B([565, 355, 1035, 435], 2)] }],
 [[1, 'Open transition Question → Refund (rule: Refund makes order mandatory)', "Layout rule's mandatory fields inside the transition form (Zoho)", 'Form shows message, QA RT18 order*, attachment, note', 'PASS'],
  [2, 'Execute with order empty', 'Blocked', '"This field is required."; no request sent, dialog stays', 'PASS'],
  [3, 'Fill order, Execute', 'Record moves with the value', 'POST …/blueprint 200; API: Refund / "QA RT18 G10 order"', 'PASS']]);
const fr = [420, 300, 1010, 480];
S(2979, 'high', 'Layout Rules | A rule on Lead Owner now fires on the form', 'PASS', [
 { img: '2979-1-default-owner.png', caption: 'Create form, owner = ndc-staging-owner: QA RT18 order shown', crop: fr, boxes: [B([451, 334, 1409, 392], 1), B([451, 704, 1409, 758], 2)] },
 { img: '2979-2-other-owner.png', caption: 'Owner changed to another user: order hidden', crop: fr, boxes: [B([451, 334, 1409, 392], 3), B([451, 640, 1409, 760], 4)] },
 { img: '2979-3-owner-back.png', caption: 'Owner picked back: order shown again', crop: fr, boxes: [B([451, 334, 1409, 392], 5), B([451, 704, 1409, 758], 6)] }],
 [[1, 'Rule "Lead Owner is ndc-staging-owner → show order", form opens with that owner', 'Rule applies on a user field (Zoho)', 'Order visible', 'PASS'],
  [2, 'Pick another user', 'Rule stops', 'Order hidden (Sec A shows only note)', 'PASS'],
  [3, 'Pick ndc-staging-owner back', 'Rule applies again', 'Order visible', 'PASS']]);
const fd = [420, 150, 1010, 720];
S(2980, 'high', 'Layout Rules | "Is empty" and "is not empty" rows now apply on the form', 'PASS', [
 { img: '2980-1-radio-no-email-empty.png', caption: 'Rule row: radio = No AND email2 is empty → show reason. email2 empty: reason shown', crop: fd, boxes: [B([451, 284, 1409, 338], 1), B([451, 724, 1409, 840], 2)] },
 { img: '2980-2-email-filled.png', caption: 'email2 filled: reason hidden', crop: fd, boxes: [B([451, 658, 1409, 712], 3)] },
 { img: '2980-3-email-cleared.png', caption: 'email2 cleared again: reason back', crop: fd, boxes: [B([451, 284, 1409, 338], 4)] },
 { img: '2980-4-notempty-filled.png', caption: 'Second row: radio = No AND email2 is not empty → show tmp: tmp shown when filled', crop: [420, 150, 1010, 750], boxes: [B([451, 402, 1409, 456], 5)] }],
 [[1, 'email2 empty at start', '"is empty" row applies', 'reason visible', 'PASS'],
  [2, 'Type an email', 'Row stops matching', 'reason hidden', 'PASS'],
  [3, 'Clear it', 'Row matches again', 'reason visible', 'PASS'],
  [4, '"is not empty" row', 'Applies', 'tmp shown only while email2 has a value', 'PASS'],
  [5, 'API op "isEmpty"', '—', 'still stored as "isNull" / "isNotNull" (editor shows "is empty" / "is not empty"); works the same', 'INFO']]);
S(2981, 'high', 'Layout Rules | The rule editor now offers text, number, date and email rows', 'PASS', [
 { img: '2981-1-api-rows-in-editor.png', caption: 'Rows built through the API now show by label with their operators (no "unknown field")', crop: [290, 370, 860, 370], boxes: [B([345, 458, 1090, 727], 1)] },
 { img: '2981-2-field-list.png', caption: 'Row field list: text, amount, date, email2 now offered', crop: [290, 420, 860, 440], boxes: [B([346, 554, 561, 842], 2)] },
 { img: '2981-3-text-operators.png', caption: 'Text row operators include pattern and length', crop: [290, 420, 860, 400], boxes: [B([530, 503, 717, 791], 3)] }],
 [[1, 'Open a rule with text/number/date/email rows saved through the API', 'Shown by label', 'QA RT18 text "starts with" QA, amount > 5, date after, email2 is not empty', 'PASS'],
  [2, 'Row field list', 'Any field type (Zoho)', 'Text, number, date, email fields listed besides choice/user fields', 'PASS'],
  [3, 'Operators', 'Regex and length rows can be built', 'text: matches/contains pattern, length is / > / ≥ / < / ≤, is empty …; number: = ≠ > ≥ < ≤ between; date: on/after/before/between', 'PASS'],
  [4, 'Date row value', '—', 'saved value 2026-01-01 shows as an empty mm/dd/yyyy box in the editor (side issue, see report)', 'INFO']]);
S(2982, 'high', 'Layout Rules | A missing target no longer switches the whole rule off', 'PASS', [
 { img: '2982-1-form-vip-ticked.png', caption: 'date removed from the layout; vip ticked: note is still mandatory', crop: [420, 150, 1010, 740], boxes: [B([451, 428, 1409, 482], 1), B([451, 833, 1409, 861], 2)] },
 { img: '2982-4-editor.png', caption: 'Editor: only the missing target is flagged, "the rest of the rule still applies"', crop: [290, 240, 1290, 90], boxes: [B([292, 250, 1576, 318], 3)] },
 { img: '2982-5-after-section-option-delete.png', caption: 'After also deleting Sec B (J6) and option Other (J8): Refund still makes order mandatory', crop: [420, 150, 1010, 740], boxes: [B([451, 374, 1409, 428], 4), B([451, 617, 1409, 677], 5)] }],
 [[1, 'Remove date (vip rule: show date + require note) from the layout, tick vip', 'Rest of the rule keeps working', 'note mandatory (aria-required true); Save blocked "This field is required"', 'PASS'],
  [2, 'Rule list / editor', 'Only the missing target flagged', "Banner: \"Parts of this rule no longer exist — they are skipped, the rest of the rule still applies: 'QA RT18 date' is no longer on this layout\"; API staleTargets lists only date", 'PASS'],
  [3, 'Other rules that mention date in one row (basic)', 'Keep working', 'basic still active; Refund → order shown + mandatory', 'PASS'],
  [4, 'J6 section deleted / J8 option deleted', 'Same: only the missing part skipped', 'staleTargets section_unknown / option_retired; Refund → order mandatory, radio Yes → email2 mandatory, vip → note mandatory', 'PASS']]);
S(2983, 'medium', 'Layout Rules | Deleting a field used by a rule is now blocked', 'PASS', [
 { img: '2983-api-card.png', caption: 'DELETE of a field that two rules use', crop: [0, 80, 1600, 230], boxes: [B([36, 167, 1564, 246], 1), B([36, 256, 1564, 293], 2)] }],
 [[1, 'DELETE /fields/{qa_rt18_tmp} (target in rules basic + radio)', 'Blocked (Zoho Desk)', '422 FIELD_IN_USE_BY_RULE, names both rules and says to remove the field from them first', 'PASS'],
  [2, 'After the call', 'Field and rule intact', 'Field still there; basic active, no definitionError', 'PASS']]);
S(2984, 'medium', 'Layout Rules | Deleting a layout now removes its rules', 'PASS', [
 { img: '2984-api-card.png', caption: 'Layout with a rule, then the layout deleted', crop: [0, 80, 1600, 220], boxes: [B([36, 193, 1564, 230], 1), B([36, 240, 1564, 277], 2)] }],
 [[1, 'DELETE layout "QA RT18 J7 Layout" that has a rule', 'Rule removed with the layout (Zoho)', 'Layout 204; GET rule → 404 LAYOUT_RULE_NOT_FOUND', 'PASS'],
  [2, 'Rule list', 'No orphan, no "active" rule with definitionError', 'Rule not listed', 'PASS']]);
const blk = (n, pr, title, why) => S(n, pr, title, 'BLOCKED', [], [[1, 'Sign in as a CRM User (profile User)', 'Needed for the check', why, 'INFO']]);
blk(2985, 'high', 'Layout Rules | Field-permission leak in the timeline — not retested (no CRM User account in this lane)', 'Lane account "Test User 1" has only the Desk Supervisor profile (no CRM User profile); the User-profile account is "Mahmoud Samy" (User, Desk Administrator) — not signed in, per lane rules');
blk(2986, 'medium', 'Layout Rules | Rule list for a CRM User — not retested (no CRM User account in this lane)', 'Lane account "Test User 1" has only the Desk Supervisor profile (no CRM User profile); the User-profile account is "Mahmoud Samy" — not signed in, per lane rules');
S(2987, 'high', 'Layout Rules | A value typed into a field the rule then hides is now kept on create', 'PASS', [
 { img: '2987-1-typed.png', caption: 'Create form, type Refund: "QA keep me" typed in order', crop: [420, 290, 1010, 380], boxes: [B([451, 362, 1409, 400], 1)] },
 { img: '2987-2-hidden-before-save.png', caption: 'type changed to Question: order hidden, then Save', crop: [420, 260, 1010, 260], boxes: [B([451, 462, 1409, 506], 2)] },
 { img: '2987-api-card.png', caption: 'Record read back', crop: [0, 80, 1600, 140], boxes: [B([36, 167, 1564, 204], 3)] }],
 [[1, 'Type "QA keep me" in order (type Refund)', '—', 'order visible and filled', 'INFO'],
  [2, 'Change type so order is hidden, Save', 'Saved', 'POST /records 201', 'PASS'],
  [3, 'Read the record', 'Typed value kept (Zoho)', 'qa_rt18_order = "QA keep me" (was empty)', 'PASS']]);
S(2988, 'medium', 'Layout Rules | Filter options now narrow the map dependency', 'PASS', [
 { img: '2988-1-refund-plus-X.png', caption: 'Map dependency type → tier (Refund: Gold, Bronze) + rule filter X → tier Gold, Silver: only Gold offered', crop: [420, 340, 1010, 240], boxes: [B([451, 354, 1409, 414], 1), B([603, 464, 1409, 561], 2)] }],
 [[1, 'type Refund only', 'Dependency applies', 'tier: Gold, Bronze', 'PASS'],
  [2, 'type Refund + filter X', 'Dependency first, then rule → Gold only (Zoho)', 'tier: Gold (was Gold, Silver)', 'PASS'],
  [3, 'type Question + filter X', 'Rule narrows the full list', 'tier: Gold, Silver', 'PASS']]);
S(2989, 'low', 'Layout Rules | Conflicting actions on one field are now refused', 'PASS', [
 { img: '2989-api-card.png', caption: 'Both conflicting setups refused', crop: [0, 80, 1600, 160], boxes: [B([36, 99, 1564, 157], 1), B([36, 167, 1564, 225], 2)] }],
 [[1, 'set value + suggest value on the same field', 'Refused (Zoho)', '422 conflicting_actions', 'PASS'],
  [2, 'mandatory + read-only on the same field', 'Refused (Zoho INVALID_DATA)', '422 conflicting_actions', 'PASS']]);
S(2990, 'low', 'Layout Rules | Actions per condition now capped at 40 (CRM) and 25 (Desk)', 'PASS', [
 { img: '2990-api-card.png', caption: 'Cap checked on both apps', crop: [0, 80, 1600, 230], boxes: [B([36, 146, 1564, 183], 1), B([36, 193, 1564, 230], 2), B([36, 240, 1564, 298], 3)] }],
 [[1, 'CRM 41 actions', 'Stops at 40 with a message', '422 "A condition may have at most 40 actions; this one has 41." (40 → 201)', 'PASS'],
  [2, 'CRM 500 actions', 'Refused', '422 too_many', 'PASS'],
  [3, 'Desk 26 actions', 'Stops at 25', '422 "… at most 25 actions; this one has 26." (25 → 201)', 'PASS']]);
S(2991, 'low', 'Layout Rules | DELETE through another module now returns 404', 'PASS', [
 { img: '2991-api-card.png', caption: 'Rule on Leads, DELETE sent through Contacts', crop: [0, 80, 1600, 260], boxes: [B([36, 193, 1564, 230], 1), B([36, 240, 1564, 277], 2)] }],
 [[1, 'DELETE /modules/{Contacts}/layout-rules/{Leads rule}', '404 like GET and PUT', '404 LAYOUT_RULE_NOT_FOUND (was 204)', 'PASS'],
  [2, 'Rule after the call', 'Not deleted', 'GET on Leads 200', 'PASS'],
  [3, "Other tenant's owner deletes this tenant's rule (K2)", '404', 'Not checked: no other-tenant account in this round', 'INFO']]);
S(2992, 'low', 'Layout Rules | Rule-mandatory input now carries aria-required', 'PASS', [
 { img: '2992-1-order-mandatory.png', caption: 'type Refund: QA RT18 order mandatory', crop: [420, 400, 1010, 140], boxes: [B([451, 456, 1409, 506], 1)] },
 { img: '2992-api-card.png', caption: 'DOM of the order field', crop: [0, 80, 1600, 230], boxes: [B([36, 146, 1564, 183], 2), B([36, 193, 1564, 251], 3)] }],
 [[1, 'Pick Refund', 'order mandatory', 'Asterisk shown (aria-hidden)', 'PASS'],
  [2, 'Inspect the order input', 'aria-required or required', 'input aria-required="true" (also on its fieldset), wrapper data-field-required="true"', 'PASS'],
  [3, 'Field not mandatory', 'No aria-required', 'note before vip: attribute absent', 'PASS']]);
S(2995, 'low', 'Layout Rules | Related-lists picker: Notes added, entries unique, but names still cut off', 'PARTIAL', [
 { img: '2995-1-related-picker.png', caption: 'Rule editor › Add action › Show related lists › Choose…', crop: [290, 370, 600, 360], boxes: [B([325, 468, 577, 498], 1), B([325, 530, 577, 718], 3, 'FAIL')] }],
 [[1, 'Notes entry', 'Listed (Zoho)', '"Notes" is listed', 'PASS'],
  [2, 'Same relation many times', 'Each related list once', '27 entries, none repeated: each lookup now carries its API name, e.g. "Leads (Lookup 2) · leads.lookup_2_3"', 'PASS'],
  [3, 'Clear name', 'Readable at a glance', 'The picker is narrow: the API-name part is cut ("Leads (Lookup 2) · leads.lookup…"), so 7 lines still read the same', 'FAIL'],
  [4, 'Effect on the record page', '—', 'Leads record page still has no related-list sections (Notes, Activities, Customer Portal, Recent activity only), so the action cannot be seen', 'INFO']]);
S(2996, 'medium', 'Layout Rules | Gap list: 1 of 6 items done (blueprint), 5 still missing', 'PARTIAL', [
 { img: '2996-api-card.png', caption: 'Gap items 1, 2, 3 and 6 checked through the API', crop: [0, 80, 1600, 300], boxes: [B([36, 99, 1564, 157], 1, 'FAIL'), B([36, 167, 1564, 225], 2, 'FAIL'), B([36, 235, 1564, 293], 3, 'FAIL'), B([36, 303, 1564, 361], 6, 'FAIL')] },
 { img: '2977-1-transition-dialog.png', caption: 'Item 4: blueprint transition form now shows the rule-mandatory field (NDC-2977)', crop: [520, 190, 560, 520], boxes: [B([565, 350, 1035, 405], 4)] },
 { img: '2996-6-suggest-again.png', caption: 'Item 5: owner pressed Ignore on "Suggested: 42" and saved; reopening Edit shows it again', crop: [290, 410, 1290, 280], boxes: [B([455, 637, 1549, 676], 5, 'FAIL')] }],
 [[1, 'CRM primary field: text, number, email, phone …', 'Any type except owner, multi-select, lookups, auto number, formula, file, multi-line', '422 "cannot be the primary field of a layout rule" for text, number, email, phone, Company', 'FAIL'],
  [2, 'Desk primary field: text, number, date, email', 'Allowed', '422 for Email, Due Date, Phone, Description', 'FAIL'],
  [3, 'Move a record to another layout', "Layout picker on Edit; new layout's rules apply", 'No picker; PATCH layout_id 200 but created_with_layout_id unchanged', 'FAIL'],
  [4, 'Blueprint transition shows rule-mandatory fields', 'Shown', 'QA RT18 order* in the form, Execute blocked while empty (NDC-2977)', 'PASS'],
  [5, 'Suggest-value pop-up remembered after Ignore', 'Not shown again', 'Shown again on reopen (owner)', 'FAIL'],
  [6, 'Profile permission for a non-admin to manage rules', 'A Customize / Manage layouts permission', 'No such key among 354 permissions; runtime check with a CRM User not run (no User-profile account in this lane)', 'FAIL'],
  [7, 'Z9 (comment): Help Center form must include the primary field', 'Warn / require', 'Not checked this round (needs a Desk Help Center form fixture)', 'INFO']]);
console.log(fs.readdirSync('.').join(' '));
