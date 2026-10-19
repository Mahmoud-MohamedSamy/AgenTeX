// One-off (19 Oct): 2104 → PASS with the agreed behaviour; 1819 functional pass; several images per ticket.
const fs = require('fs'); const f = __dirname + '/make-report-html.js'; const L = fs.readFileSync(f, 'utf8').split('\n');
const at = (re) => { const i = L.findIndex(l => re.test(l)); if (i < 0) throw new Error('miss ' + re); return i; };
let i = at(/id: 'NDC-2104'/);
L[i] = L[i].replace(/v: 'DEC', action: '.*?', img: 'NDC-2104-retest-DECISION.png',/, "v: 'PASS', action: 'Decision 19 Oct: keep the label \"Last Activity\" = last modified time → Done + comment', img: ['NDC-2104-retest-PASS.png', 'NDC-2104-retest-DECISION.png'],");
L[i + 2] = "    summary: 'Retested 19 Oct with the agreed behaviour (label kept, value = last modified): \"Last Activity is Today\" returned nothing before the edit; editing QA RT tz L2 moved its Last Activity to 19/10/2026 10:07 AM and the criteria then returned L2 only (API and view grid agree). A note alone does not move it, as agreed.' },";
i = at(/id: 'NDC-1819'/);
L[i] = L[i].replace("img: 'NDC-1819-retest-PARTIAL.png',", "img: ['NDC-1819-retest-PARTIAL.png', 'NDC-1819-functional-PARTIAL.png'],");
L[i + 2] = "    summary: '4 pass, 5 partial, 4 missing (retested twice). Functional pass on the new features, 19 Oct: sort, hide, records per page, drag-resize and Reset Column Size (kept after reload), Manage Columns search/show/hide, row Edit / Delete / Add Note and most periods work. New defects: (a) a locked column (Phone, Full Name) can be hidden from its header menu and then cannot be shown again — Show is disabled; only Reset to default restores it, and that also drops Company; (b) Clip Text does not clip date cells; (c) periods disagree: Overdue = 2 while Today & Overdue = 110 including 20 Completed — 110 of 118 tasks came from an Excel import with text due dates (\"09/21/2026 11:00 AM\"), which Overdue skips and the other buckets count; All open also lists Completed tasks; (d) sort is not kept after reload.',";
i = at(/<summary>Annotated evidence<\/summary>/);
L[i] = L[i].replace('<figure><img src="${img(t.img)}" alt="${t.id} annotated retest evidence"><figcaption>${t.img} — click to enlarge</figcaption></figure>',
  "${[].concat(t.img).map(m => `<figure><img src=\"${img(m)}\" alt=\"${t.id} annotated retest evidence\"><figcaption>${m} — click to enlarge</figcaption></figure>`).join('')}");
if (!L[i].includes('[].concat(t.img)')) throw new Error('figure not patched');
fs.writeFileSync(f, L.join('\n')); console.log('patched');
