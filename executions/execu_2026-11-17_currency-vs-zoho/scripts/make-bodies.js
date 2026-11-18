// Writes the two Plane work-item bodies (bug + gap ticket) as JSON files for plane-rest.js.
const fs = require('fs'), path = require('path');
const A = ['e1364b0b-d3cd-4167-8261-6194577a480a', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b', '9529016b-e67d-42b9-815c-263f673b8252'];
const LABEL = '67b53066-afec-470b-9efe-64fa3fea537b'; // Global Settings
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', BACKLOG = '34d8facd-e0c8-42ee-b397-f3afdc6a5a6f';

const bug = {
  name: 'Currency | Changing the currency in Company Settings does not change the home currency',
  priority: 'high', state: BUG, assignees: A, labels: [LABEL],
  description_html: `
<h3>Summary</h3>
<p>When the company currency is changed in Company Settings › Edit company details and saved, the save succeeds, but the Currencies section still shows the old home currency, even after the page is refreshed.</p>
<h3>Environment</h3>
<ul><li>App: TAVI CRM, ndc-crm.anyware.software › Settings › Company Settings</li><li>Account: org owner (ndc-owner)</li><li>Browser: Edge 156, Windows</li><li>Recording: <a href="https://jam.dev/c/926007f3-9105-47da-a546-f336ba902885">Jam 926007f3</a> (17 Nov 2026)</li></ul>
<h3>Steps to reproduce</h3>
<ol><li>Go to Settings › Company Settings.</li><li>Click <b>Edit</b> on the company details card.</li><li>Change <b>Currency</b> from United Arab Emirates Dirham to <b>Egyptian Pound</b>.</li><li>Click <b>Save</b>. The message "Company details saved" appears.</li><li>Look at the <b>Currencies</b> section on the same page, then refresh the page (F5) and look again.</li></ol>
<h3>Expected result</h3>
<p>The Currencies section shows <b>Home currency: EGP · Egyptian Pound</b>, and the exchange rates are shown against EGP. If the home currency can't be changed while other currencies exist, the Edit dialog should say so and not allow the change.</p>
<h3>Actual result</h3>
<ul><li>The company details save with Currency = Egyptian Pound, and still show it after the refresh.</li><li>The Currencies section still shows <b>Home currency: AED · United Arab Emirates Dirham</b>, and the USD row still shows "1 USD = 50 AED".</li><li>So the page shows two different home currencies, and the user gets no warning.</li></ul>
<h3>Evidence</h3>
<ul><li>Image 1: the Currency field set to Egyptian Pound just before Save (Jam 0:12).</li><li>Image 2: after the refresh, the Currencies section still shows AED (Jam 0:21).</li><li>The company profile save returns currency EGP, while the currencies list still returns home currency AED (Jam network, 0:13 and 0:18).</li></ul>
<h3>Related</h3>
<p>NDC-2217 (Company currency and primary contact can't be cleared once set).</p>`
};

const row = (n, b, z, t) => `<tr><td>${n}</td><td>${b}</td><td>${z}</td><td>${t}</td></tr>`;
const gap = {
  name: 'Currencies | Missing currency functions compared with Zoho CRM',
  priority: 'medium', state: BACKLOG, assignees: A, labels: [LABEL],
  description_html: `
<h3>Summary</h3>
<p>The TAVI "Add currency" dialog and the currencies list in Settings › Company Settings were compared with Zoho CRM's currency settings (Setup › Company Settings › Currencies). 2 behaviours match Zoho, and 4 Zoho functions are missing in TAVI.</p>
<p><b>Scope:</b> this comes from screenshots of both products (17 Nov 2026); neither was re-checked live. The Zoho screenshot is the <b>Edit</b> currency dialog (Edit US Dollar - USD), and the TAVI screenshot is the <b>Add</b> currency dialog. The annotated image is attached.</p>
<h3>Missing functions</h3>
<table><thead><tr><th>#</th><th>Function</th><th>Zoho CRM</th><th>TAVI CRM now</th></tr></thead><tbody>
${row('G1', 'Code or symbol', 'Code/Symbol is a dropdown: show the ISO code (USD) or the symbol ($).', 'Symbol is a free-text box (€). There is no choice between code and symbol, and any text can be typed.')}
${row('G2', 'Automatic exchange rate', 'Update Type: Automatic or Manual. The manual rate box shows the currency code in front of it (USD | 15.65).', 'Manual rate only ("How many AED one EUR is worth"). No Automatic option.')}
${row('G3', 'Number format', 'Format section: Symbol Position (before or after the value), Digit Separators (1,234,567 and others), Decimal Places, and a live Preview (USD 1,234,567).', 'No Format section: no symbol position, digit separators, decimal places or preview.')}
${row('G4', 'Currencies list', 'Columns: Currency (link), Format, Update Type, Exchange Rate with an info icon, Last Modified By with date, and a Status toggle. A search box sits above the list.', 'Columns: Currency, Symbol, Exchange rate, Status, then edit, activate and delete icons. No Format, Update Type or Last Modified By columns, and no search.')}
</tbody></table>
<h3>Already the same as Zoho</h3>
<ul><li>Choosing the currency from a list.</li><li>Making a currency active or inactive (TAVI uses a checkbox in the dialog and a power button in the list; Zoho uses a status toggle).</li></ul>
<h3>Expected</h3>
<p>The Add/Edit currency dialog and the currencies list offer G1–G4 as Zoho CRM does.</p>
<h3>Reference</h3>
<p>Comparison report: https://claude.ai/artifact/XxkjsbwYUc883hCJHLuuna (private; ask the QA team for access).</p>`
};

const out = path.join(__dirname, '..', 'plane');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'bug.json'), JSON.stringify(bug));
fs.writeFileSync(path.join(out, 'gap.json'), JSON.stringify(gap));
console.log('ok');
