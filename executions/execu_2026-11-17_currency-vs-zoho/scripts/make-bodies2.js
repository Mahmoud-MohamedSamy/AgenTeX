// Plane bodies for the 17 Nov live check: NDC-3102 update + bugs B1-B4.
const fs = require('fs'), path = require('path');
const A = ['e1364b0b-d3cd-4167-8261-6194577a480a', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b', '9529016b-e67d-42b9-815c-263f673b8252'];
const LABEL = '67b53066-afec-470b-9efe-64fa3fea537b';
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', BACKLOG = '34d8facd-e0c8-42ee-b397-f3afdc6a5a6f';
const ENV = '<h3>Environment</h3><ul><li>TAVI CRM: staging-crm.taviportal.com, tenant NDC-Staging, account ndc-staging-owner</li><li>Zoho CRM (reference): test org, checked live in Edge</li><li>Date: 17 Nov 2026</li></ul>';
const out = path.join(__dirname, '..', 'plane'); fs.mkdirSync(out, { recursive: true });
const W = (n, o) => fs.writeFileSync(path.join(out, n + '.json'), JSON.stringify(o));

const r = (id, f, z, t) => `<tr><td>${id}</td><td>${f}</td><td>${z}</td><td>${t}</td></tr>`;
W('gap2', { state: BACKLOG, assignees: A, description_html: `
<h3>Summary</h3>
<p>TAVI CRM's currency settings (Settings › Company Settings › Currencies) compared with Zoho CRM (Setup › Company Settings › Currencies). Both were checked <b>live</b> on 17 Nov 2026: TAVI on NDC-Staging, and Zoho in a test org where a currency was added, edited, used on a deal and deactivated. This list replaces the earlier one, which was based on two screenshots.</p>
<p><b>Correction:</b> the earlier version said both products read the exchange rate the same way. They don't; see G5.</p>
${ENV}
<h3>Missing functions</h3>
<table><thead><tr><th>#</th><th>Function</th><th>Zoho CRM (live)</th><th>TAVI CRM now</th></tr></thead><tbody>
${r('G1', 'Code or symbol', 'Code/Symbol is a dropdown (for Euro: € or EUR).', 'Symbol is a free-text box (up to 8 characters).')}
${r('G2', 'Automatic exchange rate', 'Update Type: Automatic (the default; rates from Open Exchange Rates, updated every 30 minutes) or Manual.', 'Manual rate only.')}
${r('G3', 'Number format', 'Format section: Symbol Position (Before/After Value), Digit Separators (1,234,567.89 / 1.234.567,89 / 1 234 567.89 / 1 234 567,89 / 12,34,567.89), Decimal Places (0, 2, 3, 4, 5, 6) and a live Preview. Defaults follow the currency (Euro: € 1.234.567,89). Records show amounts in that format.', 'No format options. Amounts always show as 1,000.00.')}
${r('G4', 'Home currency format', 'The home currency has its own Edit with the same Format options (code/symbol, position, separators, decimals, preview).', 'Not available.')}
${r('G5', 'Exchange rate direction', 'Written as one unit of the home currency in the other currency: "1 EGP = € 0.0175".', 'Written the other way: "How many EGP one EUR is worth" (1 EUR = 50 EGP). Needs a decision, because rates copied from Zoho would be inverted.')}
${r('G6', 'Currencies list', 'Search Currency box; columns Currency Name (link), Format, Update Type, Exchange Rate (with info icon), Last Modified By with date; All Status filter (Active / Inactive); status toggle per row.', 'Columns Currency, Symbol, Exchange rate, Status, plus edit / activate / delete icons. No search, no status filter, no Format / Update Type / Last Modified By.')}
${r('G7', 'Currency detail, history and trend', 'Clicking a currency opens a view with Info, Exchange Rate Trends (a chart) and Logs, e.g. "Exchange Rate was updated from 0.0175 to 0.02 by …" and "Euro - EUR was added by …".', 'No detail view, no rate history, no trend.')}
${r('G8', 'Exchange Rate Preferences', 'A second tab with: "Allow users to refresh the exchange rate of records" (a refresh icon on each record updates its rate to the current one) and "Auto update the exchange rate of records" per module (Leads, Accounts, Deals, Tasks, Quotes, Sales Orders, Purchase Orders, Invoices, Campaigns, Vendors, Cases, Solutions) when the record is edited.', 'Not available.')}
${r('G9', 'Warnings', 'Before the first extra currency: the currency and exchange rate fields will be added to the modules; an added currency can only be deactivated, not deleted; report filters comparing currency fields across modules stop working. Before deactivating: it can\'t be used for new records, users\' preferred currency and create-record actions fall back to the home currency, auto update stops.', 'No warnings.')}
${r('G10', 'Confirm the home currency once', '"Once you confirm your home currency, you cannot change it later." After confirming, Edit on the home currency changes only its format.', 'No confirm step and no lock (see NDC-3101).')}
</tbody></table>
<h3>Already the same as Zoho</h3>
<ul>
<li>Rate 0 or negative is refused; Save is disabled while the rate is empty.</li>
<li>A record keeps the rate it was saved with when the rate changes in Settings.</li>
<li>Records show the amount in their currency plus the home value ("$ 1,000.00 ≈ E£ 50,000.00").</li>
<li>A deactivated currency can't be picked for new records; existing records keep it.</li>
<li>The home currency can't be added again as an extra currency; duplicate codes are refused.</li>
</ul>
<h3>Related bugs found in the same check</h3>
<p>Filed separately: record currency not linked to Settings, Create Deal currency field and $ symbol, deleting a used currency, add-currency validation. Home currency: NDC-3101.</p>
<h3>Not checked</h3>
<ul><li>Whether picking an Account sets the deal currency in TAVI (Zoho does: an EGP account switched a € 1,000 deal to EGP 57,142.86).</li><li>Who can manage currencies (profile permission), reports across currencies, TAVI audit log entries for currency changes.</li></ul>
<h3>Evidence</h3><p>Two annotated images attached: the Add currency dialog (G1–G3), and the list, logs and rate preferences (G6–G8).</p>` });

const bug = (k, name, pri, body) => W(k, { name, priority: pri, state: BUG, assignees: A, labels: [LABEL], description_html: body });

bug('b1', 'Currency | A currency added in Settings cannot be used on records', 'high', `
<h3>Summary</h3><p>A currency added and made active in Settings › Company Settings › Currencies can't be used on a record. The record Currency field (Deals and other modules) is a separate fixed pick list, and a record's currency must be in both lists. The Currencies section itself says "Records can be in any active currency".</p>
${ENV}
<h3>Steps to reproduce</h3><ol><li>Go to Settings › Company Settings › Currencies and add Euro (rate 50, Active).</li><li>Create a Deal (Transactions) with Currency = EUR and Amount 1000, then save.</li><li>Create another Deal with Currency = USD (a value in the Currency list that was not added in Settings), then save.</li></ol>
<h3>Expected result</h3><p>The record Currency field lists the active currencies from Settings (home currency plus EUR), and the deal saves in EUR. This is how Zoho CRM works: Euro appears in the Deal Currency field straight after it is added.</p>
<h3>Actual result</h3><ul><li>EUR is refused: "Currency: 'EUR' is not one of the allowed values (EGP, USD, AED, JOD, KWD, OMR, SAR)."</li><li>USD is refused: "Currency USD is not one of the organization's currencies."</li><li>A record saves only when the code is in both the fixed pick list and Settings. Then the exchange rate and home value are filled correctly.</li></ul>
<h3>Evidence</h3><p>Annotated image attached (TAVI API results next to Zoho Create Deal with EUR).</p>`);

bug('b2', 'Currency | Create Deal form has no Currency field and the Amount shows $ instead of the home currency', 'medium', `
<h3>Summary</h3><p>On Create Transactions (Deals, Standard layout) there is no Currency or Exchange Rate field, so the user can't choose the record's currency. The Amount box shows "$" although the home currency is EGP.</p>
${ENV}
<h3>Steps to reproduce</h3><ol><li>Make sure the home currency is EGP (Settings › Company Settings › Currencies).</li><li>Open Transactions › New (Standard layout).</li><li>Look at the Amount box and look for a Currency field.</li></ol>
<h3>Expected result</h3><p>Amount shows the home currency (EGP) until another currency is chosen, and the form has Currency and a read-only Exchange Rate. In Zoho CRM both fields are added to the module when a second currency is added, and they appear on Create Deal.</p>
<h3>Actual result</h3><ul><li>Amount and Expected Revenue show "$".</li><li>No Currency or Exchange Rate field on the form. They appear only on the saved record, under Additional Information.</li></ul>
<h3>Evidence</h3><p>Annotated image attached (TAVI create form next to Zoho Create Deal).</p>`);

bug('b3', 'Currency | A currency that records use can be deleted', 'medium', `
<h3>Summary</h3><p>A currency can be deleted from Settings while records are saved in it. No warning is shown, and the records keep pointing at a currency that no longer exists.</p>
${ENV}
<h3>Steps to reproduce</h3><ol><li>Add USD in Settings › Company Settings › Currencies (rate 50).</li><li>Create a Deal in USD with Amount 1000.</li><li>Delete USD from the currencies list.</li><li>Open the deal.</li></ol>
<h3>Expected result</h3><p>A currency that has been added can only be deactivated, not deleted. Zoho CRM states: "The added currency can only be deactivated and cannot be deleted." Deactivating warns that the currency can't be used for new records, and old records keep it.</p>
<h3>Actual result</h3><ul><li>The delete succeeds (204) with no warning.</li><li>USD disappears from the currencies list.</li><li>The deal still shows Currency USD at rate 50.</li></ul>
<h3>Evidence</h3><p>Annotated image attached (TAVI API results next to Zoho's warning).</p>`);

bug('b4', 'Currency | Add currency accepts a code that is not ISO 4217 and silently rounds the exchange rate', 'low', `
<h3>Summary</h3><p>The add-currency API accepts a currency code that isn't a real ISO 4217 code, and it rounds an exchange rate with too many decimals without telling the user. Both were found through the API (POST /api/v1/currencies); the screen uses a currency picker.</p>
${ENV}
<h3>Steps to reproduce</h3><ol><li>Add a currency with code XYZ, symbol x, rate 2.</li><li>Add EUR with rate 0.123456789012 (12 decimal places).</li></ol>
<h3>Expected result</h3><ul><li>XYZ is refused. The error text for bad codes already says "Currency code must be a 3-letter ISO 4217 code".</li><li>A rate with too many decimals is refused with a message. Zoho CRM shows "Exchange rate is too large" and keeps Save disabled.</li></ul>
<h3>Actual result</h3><ul><li>XYZ is created (201) and listed as "XYZ · XYZ".</li><li>The rate is saved as 0.123456789 without any message.</li></ul>
<h3>Already correct</h3><p>Rate 0, negative or over 1,000,000,000, a blank symbol, a symbol over 8 characters, the home currency and duplicate codes are all refused with clear errors.</p>
<h3>Evidence</h3><p>Annotated image attached.</p>`);
console.log('ok');
