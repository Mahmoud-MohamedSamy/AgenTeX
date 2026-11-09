// Evidence for the new bug: History creation row shows "department_id" + raw id (27 Oct 2026). TAVI vs live Zoho Desk.
// Usage: node spec-dept-bug.js → screenshots/annotated/NDC-new-dept-history-BUG.png
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const P = (img, caption, crop, boxes, w = 1280, h = 720) => ({ img, caption, crop, w, h, boxes: boxes.map(([b, n, kind]) => ({ b, n, kind })) });
const spec = { out: 'NDC-new-dept-history-BUG.png', ticket: 'NEW BUG', label: 'NEW BUG', verdict: 'FAIL',
  title: 'Ticket History | Creation row shows "department_id" and the raw department id instead of the department name',
  date: '27 Oct 2026', env: 'staging-desk.taviportal.com · tenant NDC-Staging · Edge (headless) · mahmoud.mahamed1515 (Desk Administrator) · reference: live Zoho Desk (portal taviportal), read-only',
  panels: [
    P('zoho-desk-history-t101.png', 'ZOHO DESK (reference) — #101 History: the creation entry lists "Department  Anyware Software" (name, no id).', [652, 230, 628, 290], [[[748, 300, 1200, 342], 1, 'PASS']]),
    P('i3-657-history-en.png', 'TAVI — #657 created by the New Ticket form (Customer Support): "Department changed · Field department_id · New 7e1ac409-… · by System"; the creation row has no department.', [664, 300, 616, 360], [[[708, 426, 1048, 536], 2, 'FAIL'], [[708, 572, 1040, 640], 3, 'INFO']]),
    P('i3-657-history-ar.png', 'TAVI — same row in Arabic: "تغيّر القسم · الحقل department_id · الجديد 7e1ac409-… · بواسطة النظام".', [0, 300, 617, 360], [[[230, 426, 600, 536], 4, 'FAIL']]),
    P('v3-656-history.png', 'TAVI control — #656 moved to HR: "Ticket moved to another department · From Customer Support · To HR" — names resolved here.', [664, 300, 616, 220], [[[708, 326, 980, 500], 5, 'PASS']])],
  rows: [
    ['1', 'Zoho Desk creation entry', 'Department shown by name', '"Department  Anyware Software"', 'PASS'],
    ['2', 'TAVI creation (EN)', 'Department name, label "Department"', '"Department changed · Field department_id · Old blank · New 7e1ac409-58b0-41ab-97e1-0e7d5c8c5158 · by System"', 'FAIL'],
    ['3', 'TAVI "Ticket was created" row', 'Lists the department chosen', 'Subject and Status only', 'INFO'],
    ['4', 'TAVI creation (AR)', 'اسم القسم', 'department_id + 7e1ac409-… (بواسطة النظام)', 'FAIL'],
    ['5', 'TAVI department move (control)', 'Names', '"From Customer Support · To HR" — correct', 'PASS']] };
const sf = path.join(__dirname, 'specs', 'NDC-new-dept-history.json'); fs.writeFileSync(sf, JSON.stringify(spec, null, 1));
console.log(execFileSync('node', [path.join(__dirname, 'annotate.js'), sf], { encoding: 'utf8' }).trim());
