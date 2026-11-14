// Blueprint missing functions still open on 14 Nov 2026 (Z10 reply part, Z7): one annotated image each for the NDC-2799 comment.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const RUN = path.join(__dirname, '..'); const E = 'executions/execu_2026-11-08_desk-automation-order/evidence/bp-bugs/';
const ENV = 'staging-desk.taviportal.com (NDC-Staging) · owner account · Edge · blueprint "QA BP ZM missing" (deleted after)';
const specs = {
  'BP-Z10': { verdict: 'FAIL', label: 'DIFFERS FROM ZOHO', out: 'BP-Z10-reply-trigger-has-no-public-private-filter-vs-zoho.png', ticket: 'Blueprint · NDC-2799 · Z10', title: 'An automatic move on a customer reply cannot be limited to public or private replies',
    date: 'TAVI 14 Nov 2026 (11:35 Cairo) · Zoho 1 Nov 2026 (live; reply options from the API reference)', env: ENV + ' · Zoho Desk techsolutionsegypt',
    panels: [
      { side: 'tavi', img: E + 'zm-customer-triggers.png', w: 1600, h: 900, caption: 'TAVI state "Open": "When the customer replies, run" = QA go, with no reply filter. The rating trigger now has "For these ratings: Good / Okay / Bad" (built)', crop: [1245, 480, 355, 210], boxes: [{ b: [1252, 512, 1588, 570], n: 1 }, { b: [1252, 640, 1440, 682], n: 2 }] },
      { side: 'zoho', img: E + 'zoho-Z10-auto-transition-rating.png', w: 1600, h: 1000, caption: 'Zoho Auto Transition: "Incoming Response" has its own filter (All Threads); "Happiness Rating" has All Rating / Good / Bad', crop: [1130, 330, 470, 370], boxes: [{ b: [1142, 445, 1310, 487], n: 1 }, { b: [1142, 515, 1400, 690], n: 2 }] }],
    rows: [[1, 'Reply trigger filter', 'Choose all, public only or private only replies (Zoho API: REPLY_ALL / REPLY_PUBLIC / REPLY_PRIVATE; dropdown seen live, options not opened)', 'No filter: any customer reply runs the transition', 'DIFFERS'],
      [2, 'Rating trigger filter', 'Choose ratings', 'Good / Okay / Bad checkboxes (built; Okay is extra)', 'SAME']] },
  'BP-Z7': { verdict: 'FAIL', label: 'MISSING', out: 'BP-Z7-no-widget-item-in-transition-form.png', ticket: 'Blueprint · NDC-2799 · Z7', title: 'Widgets (extensions) cannot be added to a transition form',
    date: 'TAVI 14 Nov 2026 (11:35 Cairo) · Zoho not checked live (no extension installed in the test org)', env: ENV,
    leftHead: 'TAVI Desk (screenshots)', rightHead: 'Expected (Zoho help pages; not checked live)', rightLabel: 'Expected',
    panels: [{ img: E + 'zm-during-items.png', w: 1600, h: 900, caption: 'Transition "QA go" › During › "Add item" list (opened): Field, Checklist, Message, Reply to the contact, Internal comment, Attachment, Resolution, Submit for approval, Share. No widget item', crop: [740, 540, 430, 320], boxes: [{ b: [752, 668, 1146, 845], n: 1 }] }],
    rows: [[1, 'Items you can add during a transition', 'A widget item that shows an installed extension in the form (Zoho: 1 per transition on Professional, 3 on Enterprise)', 'No widget item; no widget code in the build', 'MISSING']] },
};
for (const [k, s] of Object.entries(specs)) {
  const f = path.join(RUN, 'evidence/specs', k + '.json'); fs.writeFileSync(f, JSON.stringify({ key: k, ...s }, null, 1));
  console.log(execFileSync('node', [path.join(__dirname, 'annotate-vs-zoho.js'), f]).toString().trim());
}
