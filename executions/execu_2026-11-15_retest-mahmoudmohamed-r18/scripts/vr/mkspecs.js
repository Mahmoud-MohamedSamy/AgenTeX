// writes specs/NDC-<n>.json for the validation-rules retests (run from scripts/)
const fs = require('fs'); const D = '15 Nov 2026'; const ENV = 'NDC-Staging · staging-crm · ndc-staging-owner · Leads › QA RT18 VR Layout';
const card = (n, cap, h, boxes) => ({ img: `${n}-api-card.png`, caption: cap, full: true, crop: [0, 0, 1600, h], boxes });
const S = (n, pri, verdict, title, env, panels, rows) => fs.writeFileSync(`specs/NDC-${n}.json`, JSON.stringify({ out: `NDC-${n}-retest-${verdict}.png`, ticket: `NDC-${n}`, priority: pri, title, verdict, env, date: D, panels, rows }, null, 1));

S(3009, 'high', 'PASS', 'Validation Rules | A stale save from a second editor tab is now refused with "changed by someone else"', ENV + ' · rule "QA RT18 K3" · two tabs, same owner session · QA test data, removed at cleanup',
  [{ img: '3009-1-tab1-stale-save.png', caption: 'Tab A (old copy) changes the description and saves after tab B: the editor stays open and shows the conflict message', crop: [340, 40, 1250, 850], boxes: [{ b: [352, 176, 1248, 228], n: 1, kind: 'INFO' }, { b: [1158, 812, 1574, 874], n: 2, kind: 'PASS' }] },
   card(3009, "Network: both tabs send rowVersion 1; tab B 200, tab A 409; the rule keeps tab B's text", 320, [{ b: [36, 146, 1564, 183], n: 3, kind: 'PASS' }, { b: [36, 193, 1564, 251], n: 2, kind: 'PASS' }, { b: [36, 261, 1564, 298], n: 4, kind: 'PASS' }])],
  [[1, 'Open the same rule in tab A and tab B; tab A types "changed in tab 1 (stale)"', 'Setup', 'Both editors loaded with rowVersion 1', 'INFO'],
   [2, 'Tab A saves after tab B', 'Refused with a clear message (was: saved silently)', 'PUT 409 VALIDATION_RULE_CONFLICT; toast "This validation rule was changed by someone else; reload it and try again."; editor stays open', 'PASS'],
   [3, 'Editor sends the version', 'rowVersion in the PUT', 'Both PUTs carry rowVersion=1; tab B 200', 'PASS'],
   [4, 'Reload the rule', "Tab B's change kept", 'description "changed in tab 2", rowVersion 2 (was 5 → 7 with both written)', 'PASS']]);

S(3010, 'high', 'PASS', 'Validation Rules | A CRM User is no longer blocked by a rule on a field that is read-only or hidden for them', 'NDC-Staging · staging-crm · ndc-staging-owner + Mahmoud Samy (CRM profile User) · Leads › QA RT18 VR Layout · rule "QA RT18 H6 note required" · field permission set for the test, removed after',
  [{ img: '3010-1-u1-form-read_only.png', caption: 'CRM User, note read-only: the field is greyed with a lock; Full Name filled, note left empty', crop: [420, 330, 1020, 340], boxes: [{ b: [470, 508, 1410, 546], n: 1, kind: 'INFO' }] },
   { img: '3010-2-u1-saved-read_only.png', caption: 'Save → POST 201, "Record saved successfully" (was: refused "note is required")', crop: [1100, 780, 500, 120], boxes: [{ b: [1298, 822, 1574, 874], n: 2, kind: 'PASS' }] },
   { img: '3010-3-u1-form-hidden.png', caption: 'CRM User, note hidden: the field is not on the form; Save → 201', crop: [420, 500, 1020, 260], boxes: [{ b: [452, 570, 1410, 722], n: 3, kind: 'PASS' }] },
   card(3010, 'API: the rule still refuses the owner (who can edit the field), and other rules still apply to the CRM User', 520, [{ b: [36, 167, 1564, 225], n: 4, kind: 'PASS' }, { b: [36, 235, 1564, 293], n: 2, kind: 'PASS' }, { b: [36, 371, 1564, 429], n: 3, kind: 'PASS' }, { b: [36, 439, 1564, 497], n: 5, kind: 'PASS' }])],
  [[1, 'Field qa_rt18v_note read-only for profile User', 'Setup', 'effective permission read_only for Mahmoud Samy', 'INFO'],
   [2, 'CRM User saves a lead without the note (read-only)', 'Not blocked (was: 422 "note is required")', 'UI Save → 201 "Record saved successfully"; API 201', 'PASS'],
   [3, 'Same with the field hidden for User', 'Not blocked (was: 422)', 'Field not on the form; UI 201, API 201', 'PASS'],
   [4, 'Owner (can edit the field) saves without the note', 'Rule still runs', '422 "QA RT18 H6 note is required" in both modes', 'PASS'],
   [5, 'CRM User breaks a rule on a field they can edit', 'Still refused', '422 "QA RT18 text cannot start with BAD"', 'PASS'],
   [6, 'Desk (Desk Agent)', '—', 'Not rechecked (CRM-only lane)', 'INFO']]);

S(3011, 'high', 'PASS', 'Validation Rules | A value typed in a blueprint transition form is now checked by the validation rules', ENV + ' · blueprint "QA RT18 VR BP" (Open → Reject asks QA RT18 v text) · rule "text cannot start with BAD" · QA test data, removed at cleanup',
  [{ img: '3011-2-execute-bad.png', caption: "Transition \"QA to Reject\": typed BAD-bp, Execute → refused in the form with the rule's message", crop: [544, 170, 512, 560], boxes: [{ b: [570, 268, 1030, 324], n: 1, kind: 'PASS' }, { b: [570, 420, 1030, 456], n: 2, kind: 'INFO' }] },
   card(3011, 'API: BAD value 422, record stays in Open; good value 200', 300, [{ b: [36, 167, 1564, 225], n: 1, kind: 'PASS' }, { b: [36, 235, 1564, 272], n: 3, kind: 'PASS' }])],
  [[1, 'Execute the transition with "BAD-bp"', 'Refused with "Text cannot start with BAD" (was: 200, value saved)', 'POST transition 422 BLUEPRINT_VALIDATION_FAILED; form shows "Transition field validation failed. • qa_rt18v_text: QA RT18 text cannot start with BAD"; record stays Open', 'PASS'],
   [2, 'Message wording', 'Same as a normal save', 'Rule text shown, prefixed with the API name "qa_rt18v_text:" instead of the field label (minor)', 'INFO'],
   [3, 'Execute with a good value', 'Transition works', '200; record moves to Reject with "fine-bp"', 'PASS']]);

S(3014, 'medium', 'PASS', 'Validation Rules | A field used in a rule\'s "Applies when" can no longer be deleted', ENV + ' · rule "QA RT18 J2 rule" · field qa_rt18v_j2 · QA test data, removed at cleanup',
  [card(3014, 'API: the delete is refused with FIELD_IN_USE_BY_RULE naming the rule; field and rule unchanged', 320, [{ b: [36, 167, 1564, 246], n: 1, kind: 'PASS' }, { b: [36, 256, 1564, 293], n: 2, kind: 'PASS' }])],
  [[1, 'Delete field qa_rt18v_j2 (used only in "Applies when")', 'Refused like the checked field (was: 204)', '422 FIELD_IN_USE_BY_RULE naming "QA RT18 J2 rule"', 'PASS'],
   [2, 'Rule after', 'Not broken', 'Field still exists; rule Active, conditionError null; record with j2 = y and no email → 422 (rule works)', 'PASS'],
   [3, 'Same family (J3/J4, Desk)', '—', 'Not rechecked: removing a pick value was blocked by the blueprint first; Desk not in this lane', 'INFO']]);

S(3015, 'medium', 'PARTIAL', 'Validation Rules | Deleting a layout now switches its rules off and flags them, but still gives no warning', ENV + ' · layouts "QA RT18 J6 / J6b Layout" + one rule each · QA test data, removed at cleanup',
  [{ img: '3015-3-delete-dialog.png', caption: 'Layouts › Delete "QA RT18 J6b Layout": the dialog does not mention the active validation rule', crop: [540, 330, 520, 240], boxes: [{ b: [646, 376, 1000, 462], n: 1, kind: 'FAIL' }] },
   { img: '3019-3-list-reload.png', caption: 'After the delete: both rules switched off, "(deleted layout)" and a warning under the name', crop: [292, 540, 1284, 112], boxes: [{ b: [300, 546, 1570, 650], n: 2, kind: 'PASS' }] },
   card(3015, 'API and UI delete both 204 with no warning; the rule is disabled and flagged', 340, [{ b: [36, 99, 1564, 136], n: 1, kind: 'FAIL' }, { b: [36, 193, 1564, 251], n: 1, kind: 'FAIL' }, { b: [36, 146, 1564, 183], n: 2, kind: 'PASS' }])],
  [[1, 'Delete a layout that has an active rule', 'Delete warns about the rules', 'API 204 with no warning; UI dialog only says "permanently deletes the layout and its access settings"', 'FAIL'],
   [2, 'Rules after the delete', 'Removed, or switched off and flagged (was: Active, orphaned)', 'Active switched off; list shows "(deleted layout)" + "This rule\'s layout was deleted, so the rule is not applied. Edit it to choose another layout, or delete it."; GET status disabled', 'PASS']]);

S(3017, 'medium', 'PASS', 'Validation Rules | A "top of the form" message is now scrolled into view', ENV + ' · rule "QA RT18 E2 top" (pick = Reject, Show the error: At the top of the form) · QA test data, removed at cleanup',
  [{ img: '3017-1-before-save.png', caption: 'New lead, scrolled down to QA RT18 v pick = Reject, Save clicked from here', crop: [420, 330, 1022, 290], boxes: [{ b: [452, 508, 1410, 552], n: 1, kind: 'INFO' }] },
   { img: '3017-2-after-save.png', caption: 'After Save: the page scrolls to the top and the message is in view (role="alert", focus moved to it)', crop: [418, 100, 1024, 360], boxes: [{ b: [418, 154, 1442, 200], n: 2, kind: 'PASS' }] }],
  [[1, 'Scroll to the checked field, pick a refused value, click Save', 'Setup', 'page scrolled 757 px down; no request sent (refused client-side)', 'INFO'],
   [2, 'Where the user sees the message', 'Page scrolls to the message (or field marked) (was: out of view, page did not move)', 'Scroll 757 → 32 px; "QA RT18 E2 pick cannot be Reject" at the top in view; banner has role="alert"; focus on the banner', 'PASS'],
   [3, 'Field mark', 'Optional ("or")', 'Pick field not marked (no aria-invalid / red border)', 'INFO']]);

S(3018, 'medium', 'PARTIAL', 'Validation Rules | The refused field is now marked and linked to its message, but the message is still not announced', ENV + ' · rule "QA RT18 text no BAD" · QA test data, removed at cleanup',
  [{ img: '3018-1-refused.png', caption: 'New lead, QA RT18 v text = BAD-m4, Save: message under the field, focus in the field', crop: [420, 440, 1022, 300], boxes: [{ b: [602, 508, 1410, 546], n: 1, kind: 'PASS' }, { b: [600, 550, 800, 568], n: 3, kind: 'FAIL' }] }],
  [[1, 'aria-invalid on the input', 'aria-invalid="true" (was: missing)', 'aria-invalid="true"', 'PASS'],
   [2, 'aria-describedby → message', 'Points to the message (was: missing)', 'aria-describedby="live-field-…-error" → "QA RT18 text cannot start with BAD"', 'PASS'],
   [3, 'Message announced', 'role="alert" or a live region', 'Field message has no role and no aria-live; no alert / live region on the page contains it', 'FAIL'],
   [4, 'Focus', 'Goes to the refused field', 'Focus on the QA RT18 v text input', 'PASS'],
   [5, 'Desk ticket form (focus went to Subject)', '—', 'Not rechecked (CRM-only lane)', 'INFO']]);

S(3019, 'low', 'PASS', 'Validation Rules | The CRM rule list shows the layout name on a fresh page load', ENV + ' · 7 QA RT18 rules · 3 fresh loads (English)',
  [{ img: '3019-3-list-reload.png', caption: 'Fresh load of Leads › Validation Rules: Layout column shows "QA RT18 VR Layout" (or "(deleted layout)"), no ids', crop: [292, 326, 1284, 440], boxes: [{ b: [972, 380, 1128, 760], n: 1, kind: 'PASS' }] }],
  [[1, 'Reload the list (3 times, first read at 3.5 s)', 'Layout name, as on Desk (was: raw id "9f0069ec-…")', '7 rows each time, 0 ids; 5 rows "QA RT18 VR Layout", 2 rows "(deleted layout)"', 'PASS'],
   [2, 'Arabic', '—', 'Not rechecked (would change the owner\'s language setting)', 'INFO']]);

S(3020, 'low', 'PASS', 'Validation Rules | Deleting a rule through another module\'s address now answers 404', ENV + ' · rule "QA RT18 K3" addressed through Contacts',
  [card(3020, 'API: GET, DELETE and PUT via Contacts all 404; the rule is still on Leads', 350, [{ b: [36, 146, 1564, 183], n: 1, kind: 'PASS' }, { b: [36, 99, 1564, 136], n: 2, kind: 'PASS' }, { b: [36, 240, 1564, 277], n: 3, kind: 'PASS' }])],
  [[1, 'DELETE /modules/{Contacts}/validation-rules/{Leads rule}', '404, same as GET (was: 204)', '404 VALIDATION_RULE_NOT_FOUND', 'PASS'],
   [2, 'GET / PUT through Contacts', '404', '404 / 404, description unchanged', 'PASS'],
   [3, 'GET on Leads', 'Rule still there', '200', 'PASS'],
   [4, 'Desk (Tickets via Desk Contacts)', '—', 'Not rechecked (CRM-only lane)', 'INFO']]);

S(3021, 'medium', 'FAIL', 'Validation Rules | Gap list: none of the checked gaps is built yet', 'NDC-Staging · staging-crm · ndc-staging-owner · Leads · API probes, temporary rules deleted right away',
  [card(3021, 'Item-by-item recheck of the gap list', 530, [{ b: [36, 99, 1564, 157], n: 1, kind: 'FAIL' }, { b: [36, 167, 1564, 204], n: 2, kind: 'FAIL' }, { b: [36, 214, 1564, 251], n: 3, kind: 'FAIL' }, { b: [36, 261, 1564, 319], n: 4, kind: 'INFO' }, { b: [36, 329, 1564, 366], n: 5, kind: 'FAIL' }, { b: [36, 376, 1564, 434], n: 6, kind: 'FAIL' }, { b: [36, 444, 1564, 502], n: 7, kind: 'INFO' }])],
  [[1, 'Function code inside the product', 'Write the check in the product', 'Function rule still needs an outside https URL (422 without it)', 'FAIL'],
   [2, 'Relative dates (${CURRENTTIME})', 'Accepted', '422 "is not a date (use yyyy-MM-dd)" for today, ${CURRENTTIME}, ${TODAY}', 'FAIL'],
   [3, 'Show every failing condition', 'All messages', 'Record failing 2 branches gets 1 message (first match)', 'FAIL'],
   [4, 'Desk: prompt when removing the checked field from a layout', 'Prompt, rule switched off', 'Not rechecked (CRM-only lane)', 'INFO'],
   [5, 'Web forms (G12) testable', 'Public session works', 'POST /web-forms/public/{key}/session 404 for all 4 forms', 'FAIL'],
   [6, 'Possible bug: internal function URLs', 'Refused', '169.254.169.254, localhost, 10.0.0.5 all saved (201, deleted)', 'FAIL'],
   [7, 'Help Center CAPTCHA, Kanban (NDC-2993), merge, signature timestamp', '—', 'Not rechecked', 'INFO']]);
