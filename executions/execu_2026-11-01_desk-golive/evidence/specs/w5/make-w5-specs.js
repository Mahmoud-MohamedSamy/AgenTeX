const fs = require('fs'), path = require('path');
const env = 'TAVI: staging-desk.taviportal.com, NDC-Staging (Wonder Travel), owner · Zoho Desk: test org techsolutionsegypt (Tech), live screens, read-only · Edge';
const NZ = 'Not checked live: the Zoho trial Setup pages (Products / Departments) stayed on the loading spinner on 13 Nov.';
const S = [
 { out: 'W5-E7-vs-zoho.png', ticket: 'E7 · W5-31', verdict: 'FAIL', label: 'BUG · High', title: 'Department disabled/deleted with ticket transfer: ticket record keeps the old department',
   panels: [{ img: 'w5/W5-31-drill.png', w: 1280, h: 720, crop: [258, 56, 1022, 664], caption: 'TAVI · Analytics › Overview, Customer Support: Open Tickets 19 (list and report show 18)', boxes: [{ b: [276, 310, 431, 480], n: 1 }, { b: [300, 64, 524, 96], n: 2 }] }],
   rows: [[1, 'Counts after the transfer', NZ, 'Dashboard counts the moved ticket (19); Customer Support list and report show 18. records filter department = Customer Support → 0 for the moved ticket.', 'BUG'],
          [2, 'Department on the moved ticket', 'Zoho asks for a target department and moves the tickets (help docs, not seen live).', 'Desk ticket says Customer Support (history "department changed"), but the ticket record field Department still holds the deleted department. Reproduced with a temp department; 4 round-14 tickets (#1363–#1366) were in the same state.', 'BUG']] },
 { out: 'W5-E4-vs-zoho.png', ticket: 'E4 · W5-60', verdict: 'FAIL', label: 'BUG · High', title: 'New Product cannot be saved from the screen (Departments rejected)',
   panels: [{ img: 'w5/W5-60-save-error-field.png', w: 1280, h: 720, crop: [268, 96, 1012, 560], caption: 'TAVI · Setup › Products › New Product › Save (Name + Code filled, Departments = Sales pre-filled)', boxes: [{ b: [470, 360, 1225, 420], n: 1 }, { b: [464, 425, 954, 446], n: 2 }, { b: [1203, 107, 1259, 143], n: 3 }] }],
   rows: [[1, 'Departments value', NZ, 'Sales (pre-filled, valid department). Same result after choosing Marketing.', 'INFO'],
          [2, 'Save result', NZ, '422 RECORD_VALIDATION_FAILED: Departments: ["<id>"] is not a valid department id. The form sends a list; the API accepts one id (API call with a single id → 201).', 'BUG'],
          [3, 'Save / Save and New', 'Expected: the product is created.', 'Nothing is created.', 'BUG']] },
 { out: 'W5-E1-vs-zoho.png', ticket: 'E1 · W5-44b', verdict: 'FAIL', label: 'BUG · Low', title: 'Mass Update: field added with value left on "Select" silently empties it',
   panels: [{ img: 'w5/W5-44-update-filled.png', w: 1280, h: 720, crop: [340, 160, 600, 400], caption: 'TAVI · Tickets › 2 selected › Update: Priority added, value left on "Select"', boxes: [{ b: [388, 338, 892, 378], n: 1 }, { b: [768, 502, 904, 540], n: 2 }] },
            { img: 'zw5/z-e1-values.png', w: 1600, h: 900, crop: [60, 50, 700, 430], caption: 'Zoho · Tickets › 1 selected › Update › Priority: value list', boxes: [{ b: [281, 228, 505, 270], n: 1 }, { b: [283, 312, 503, 346], n: 1 }] }],
   rows: [[1, 'How "no value" is shown', 'The empty choice is a labelled option "-None-" (pre-selected, ticked), so the agent sees the field will be set to none.', 'Placeholder "Select" — looks like nothing is chosen yet.', 'DIFFERS'],
          [2, 'Result of Update', 'Not tried (Save would change Zoho data).', 'Accepted: "2 updated"; both tickets Priority High/Low → empty (history "priority High → null"), no warning.', 'BUG']] },
 { out: 'W5-17-vs-zoho.png', ticket: 'W5-17', verdict: 'FAIL', label: 'BUG · Medium', title: 'Contract with End date before Start date is accepted',
   panels: [{ img: 'w5/W5-17-contract-dates.png', w: 1280, h: 720, crop: [300, 56, 980, 664], caption: 'TAVI · QA GL W5 Contract bad dates: Start 01/12/2026, End 01/11/2026 (saved, UPCOMING)', boxes: [{ b: [320, 684, 600, 720], n: 1 }, { b: [1186, 146, 1280, 172], n: 2 }] },
            { img: 'zw5/z-k-submit-empty.png', w: 1600, h: 900, crop: [190, 100, 1210, 720], caption: 'Zoho · Contracts › Add Contract: Start 20 Nov, End 10 Nov, Submit (name/account left empty, nothing saved)', boxes: [{ b: [612, 395, 882, 490], n: 1 }, { b: [222, 520, 492, 612], n: 2 }] }],
   rows: [[1, 'End date earlier than Start date', 'Refused: "Contract Start Date should be less than Contract End Date".', 'Saved (201); stored start 2026-12-01, end 2026-11-01.', 'DIFFERS'],
          [2, 'Status / end-date checks', 'Also refuses an end date in the past: "Contract end date cannot be less than current date."', 'Status "upcoming"; no message.', 'DIFFERS']] },
 { out: 'W5-E2-vs-zoho.png', ticket: 'E2 · W5-39', verdict: 'FAIL', label: 'BUG · Low', title: 'Contacts export: the Name column is empty',
   panels: [{ img: 'w5/W5-39-csv.png', w: 1280, h: 720, crop: [0, 0, 880, 300], caption: 'TAVI · Setup › Data › Export › Contacts (CSV) — downloaded file', boxes: [{ b: [347, 89, 413, 279], n: 1 }, { b: [413, 89, 615, 279], n: 2 }] }],
   rows: [[1, 'Name column', 'Not checked live (Zoho trial export page did not load).', 'Empty on every row.', 'BUG'],
          [2, 'First / Last Name', '-', 'Filled (QA GL W5 / Contact 1 …), so the full name is known.', 'INFO']] },
 { out: 'W5-E3-vs-zoho.png', ticket: 'E3 · W5-68', verdict: 'FAIL', label: 'BUG · Low', title: 'Audit Log shows an internal field name and names tickets by contact email',
   panels: [{ img: 'w5/W5-68-audit.png', w: 1280, h: 720, crop: [268, 340, 1012, 320], caption: 'TAVI · Setup › Audit Log after deleting and restoring imported ticket #3460', boxes: [{ b: [414, 440, 992, 464], n: 1 }, { b: [414, 497, 884, 520], n: 2 }, { b: [414, 553, 878, 576], n: 2 }] }],
   rows: [[1, 'Field name', 'Not compared (wording).', '"cleared Ticket\'s EngineDeletedAt" — internal name, not a field users know.', 'BUG'],
          [2, 'Ticket name', 'Not compared (wording).', '"deleted / restored a Ticket named qa-gl-w5-c1@example.com" — the contact email, not #3460 and its subject.', 'BUG']] }
];
for (const s of S) fs.writeFileSync(path.join(__dirname, s.out.replace('-vs-zoho.png', '.json')), JSON.stringify({ ...s, date: '13 Nov 2026', env, out: 'w5/' + s.out }, null, 1));
console.log(S.length);
