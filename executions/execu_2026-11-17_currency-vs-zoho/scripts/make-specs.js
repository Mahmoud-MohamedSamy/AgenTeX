// Writes the annotate-vs-zoho specs for the 17 Nov currency live check.
const fs = require('fs'), path = require('path');
const D = path.join(__dirname, 'specs');
const W = (n, o) => fs.writeFileSync(path.join(D, n + '.json'), JSON.stringify(o));
const base = { date: '17 Nov 2026 (live)', env: 'TAVI: staging-crm.taviportal.com, NDC-Staging, ndc-staging-owner | Zoho: crm.zoho.com test org org946877290 (Edge, live)' };

W('b1', { ...base, out: 'B1-record-currency-not-from-settings-vs-zoho.png', ticket: 'Currency', title: 'A currency added in Settings cannot be used on records', verdict: 'FAIL', label: 'BUG',
  panels: [
    { img: 'api-b1-record-currency.png', w: 1600, h: 900, crop: [0, 0, 1600, 430], caption: 'TAVI: API evidence (NDC-Staging)', boxes: [{ b: [36, 214, 1564, 340], n: 1, kind: 'FAIL' }, { b: [36, 146, 1564, 204], n: 2, kind: 'FAIL' }, { b: [36, 350, 1564, 408], n: 3, kind: 'SAME' }] },
    { img: 'z26-deal-eur.png', w: 1600, h: 900, crop: [250, 110, 1350, 500], caption: 'Zoho: Create Deal right after Euro was added', boxes: [{ b: [1141, 494, 1528, 528], n: 1, kind: 'SAME' }, { b: [1100, 485, 1540, 537], n: 2, kind: 'SAME' }, { b: [459, 548, 849, 582], n: 3, kind: 'SAME' }] }],
  rows: [
    [1, 'Save a record in a newly added currency', 'EUR added in Setup appears at once in the Deal Currency picklist (EGP, EUR); the deal saves in EUR.', 'EUR is active in Settings, but a deal in EUR is refused: "EUR is not one of the allowed values (EGP, USD, AED, JOD, KWD, OMR, SAR)". A deal in USD is refused the other way: "USD is not one of the organization\'s currencies".', 'FAIL'],
    [2, 'Where the record Currency list comes from', 'The Currency field lists the active currencies from Setup.', 'Deals › Currency is a separate fixed pick list. A record currency must be in BOTH lists, and the two are not linked.', 'FAIL'],
    [3, 'Exchange rate on the record', 'Filled from Setup and locked (0.0175).', 'Filled from Settings (50) with a home-currency value (amount_home 50000), once the code passes both lists.', 'SAME']] });

W('b2', { ...base, out: 'B2-create-form-currency-vs-zoho.png', ticket: 'Currency', title: 'Create Deal form has no Currency field and shows $ instead of the home currency', verdict: 'FAIL', label: 'BUG',
  panels: [
    { img: 't07-deal-create.png', w: 1600, h: 900, crop: [400, 100, 1200, 800], caption: 'TAVI: Create Transactions (Deals), Standard layout', boxes: [{ b: [603, 552, 1409, 590], n: 1, kind: 'FAIL' }, { b: [450, 380, 1420, 895], n: 2, kind: 'FAIL' }] },
    { img: 'z25-deal-create.png', w: 1600, h: 900, crop: [250, 110, 1350, 600], caption: 'Zoho: Create Deal (home currency EGP)', boxes: [{ b: [1141, 170, 1528, 204], n: 1, kind: 'SAME' }, { b: [1141, 494, 1528, 528], n: 2, kind: 'SAME' }, { b: [459, 548, 849, 582], n: 2, kind: 'SAME' }] }],
  rows: [
    [1, 'Amount box before a currency is chosen', 'Shows the home currency code (EGP).', 'Shows "$" although the home currency is EGP.', 'FAIL'],
    [2, 'Choosing the record currency on Create', 'Currency and Exchange Rate fields are added to the module when a second currency is added, and appear on Create Deal.', 'No Currency or Exchange Rate field on the Standard create layout, so the user cannot pick the record currency (they only show under Additional Information on the record page).', 'FAIL']] });

W('b3', { ...base, out: 'B3-delete-used-currency-vs-zoho.png', ticket: 'Currency', title: 'A currency used by records can be deleted', verdict: 'FAIL', label: 'BUG',
  panels: [
    { img: 'api-b3-delete-used.png', w: 1600, h: 900, crop: [0, 0, 1600, 320], caption: 'TAVI: API evidence (NDC-Staging)', boxes: [{ b: [36, 146, 1564, 183], n: 1, kind: 'FAIL' }, { b: [36, 240, 1564, 298], n: 2, kind: 'FAIL' }] },
    { img: 'z06-add-currency.png', w: 1600, h: 900, crop: [515, 0, 1085, 390], caption: 'Zoho: warning before the first extra currency', boxes: [{ b: [540, 148, 1010, 174], n: 1, kind: 'SAME' }, { b: [540, 108, 1010, 134], n: 2, kind: 'SAME' }] }],
  rows: [
    [1, 'Removing a currency', '"The added currency can only be deactivated and cannot be deleted." Zoho has no delete action.', 'DELETE /currencies/{USD} returns 204 while a deal is saved in USD, with no warning.', 'FAIL'],
    [2, 'Records that use it', 'Keep a valid currency (a deactivated currency stays on old records).', 'The deal still says USD at rate 50, but USD no longer exists in the currency list.', 'FAIL']] });

W('b4', { ...base, out: 'B4-add-currency-validation-vs-zoho.png', ticket: 'Currency', title: 'Add currency accepts a code that is not ISO 4217 and silently rounds the rate', verdict: 'FAIL', label: 'BUG',
  panels: [
    { img: 'api-b4-validation.png', w: 1600, h: 900, crop: [0, 0, 1600, 380], caption: 'TAVI: API evidence (NDC-Staging)', boxes: [{ b: [36, 99, 1564, 157], n: 1, kind: 'FAIL' }, { b: [36, 167, 1564, 225], n: 2, kind: 'FAIL' }, { b: [36, 235, 1564, 366], n: 3, kind: 'SAME' }] },
    { img: 'z12-empty-rate.png', w: 1600, h: 900, crop: [532, 0, 1112, 690], caption: 'Zoho: Add Currency, Manual rate', boxes: [{ b: [689, 82, 1079, 116], n: 1, kind: 'SAME' }, { b: [689, 553, 1079, 605], n: 3, kind: 'SAME' }] }],
  rows: [
    [1, 'Currency code', 'Picked from Zoho\'s currency list only; no free code.', 'POST code XYZ (not an ISO 4217 code) is created (201), although the error text says codes must be ISO 4217.', 'FAIL'],
    [2, 'Too many decimals', '"Exchange rate is too large" for 0.123456789012 (12 decimals); Save stays disabled. (Message seen live, not in this screenshot.)', '0.123456789012 is accepted and silently stored as 0.123456789.', 'FAIL'],
    [3, 'Zero, negative, huge, symbol, home, duplicate', '0 or negative: "Exchange rate should not be 0"; text cannot be typed.', 'All refused with clear errors (rate > 0 and up to 1,000,000,000; symbol 1-8 characters; home and duplicate codes).', 'SAME']] });

W('h1', { ...base, out: 'NDC-3101-home-currency-vs-zoho.png', ticket: 'NDC-3101', title: 'Home currency: TAVI changes the company currency but not the home currency; Zoho locks it', verdict: 'FAIL', label: 'BUG CONFIRMED',
  panels: [
    { img: 'api-h1.png', w: 1600, h: 900, crop: [0, 0, 1600, 330], caption: 'TAVI: API evidence (NDC-Staging), reverted after', boxes: [{ b: [36, 99, 1564, 183], n: 1, kind: 'FAIL' }] },
    { img: 'z01-currencies.png', w: 1600, h: 900, crop: [257, 60, 1600, 400], caption: 'Zoho: before confirming the home currency', boxes: [{ b: [500, 262, 1340, 290], n: 2, kind: 'SAME' }] }],
  rows: [
    [1, 'Change the company currency later', 'Not possible after confirming (see 2).', 'PUT company-profile currency AED returns 200 and the profile shows AED, but GET /currencies still says home EGP: two home currencies, no warning. Reproduced on NDC-Staging 17 Nov.', 'FAIL'],
    [2, 'Home currency rule', '"Once you confirm your home currency, you cannot change it later." After confirming, Edit on the home currency shows only Format (no currency choice).', 'No confirm step and no lock.', 'FAIL']] });

W('g1', { ...base, out: 'G-add-dialog-vs-zoho.png', ticket: 'NDC-3102', title: 'Add currency dialog: missing Zoho functions (live)', verdict: 'GAP', label: 'GAPS vs ZOHO',
  panels: [
    { img: 't02-add-dialog.png', w: 1600, h: 900, crop: [544, 252, 1056, 648], caption: 'TAVI: Add currency', boxes: [{ b: [569, 405, 1031, 457], n: 1, kind: 'GAP' }, { b: [569, 467, 1031, 540], n: 2, kind: 'GAP' }, { b: [560, 262, 760, 300], n: 3, kind: 'GAP' }] },
    { img: 'z09-add-euro.png', w: 1600, h: 900, crop: [532, 0, 1127, 790], caption: 'Zoho: Add Currency (Euro)', boxes: [{ b: [689, 187, 1079, 221], n: 1, kind: 'GAP' }, { b: [563, 500, 1080, 705], n: 2, kind: 'GAP' }, { b: [563, 140, 1080, 440], n: 3, kind: 'GAP' }] }],
  rows: [
    [1, 'Code or symbol', 'Code/Symbol dropdown (€ or EUR).', 'Free-text Symbol box, up to 8 characters.', 'GAP'],
    [2, 'Exchange rate', 'Update Type Automatic (Open Exchange Rates, every 30 minutes, default) or Manual. Rate reads 1 EGP = € 0.016944 (one home unit in the foreign currency).', 'Manual only. Rate reads the other way: "How many EGP one EUR is worth".', 'GAP'],
    [3, 'Format', 'Symbol Position (Before/After), Digit Separators (5 styles), Decimal Places (0, 2-6) and a live Preview; defaults follow the currency (Euro: 1.234.567,89). The home currency has the same Format editor.', 'No format options; amounts always show as 1,000.00.', 'GAP']] });

W('g2', { ...base, out: 'G-list-logs-prefs-vs-zoho.png', ticket: 'NDC-3102', title: 'Currencies list, history and rate preferences: missing Zoho functions (live)', verdict: 'GAP', label: 'GAPS vs ZOHO',
  panels: [
    { img: 't01-currencies.png', w: 1600, h: 900, crop: [510, 740, 1360, 900], caption: 'TAVI: Currencies section (EUR row below the fold)', boxes: [{ b: [531, 845, 1337, 890], n: 1, kind: 'GAP' }] },
    { img: 'z15-list.png', w: 1600, h: 900, crop: [257, 130, 1600, 520], caption: 'Zoho: Currencies list', boxes: [{ b: [287, 338, 1554, 486], n: 1, kind: 'GAP' }, { b: [287, 140, 640, 178], n: 3, kind: 'GAP' }] },
    { img: 'z34-logs.png', w: 1600, h: 900, crop: [375, 0, 1225, 404], caption: 'Zoho: currency detail › Logs', boxes: [{ b: [400, 75, 700, 112], n: 2, kind: 'GAP' }, { b: [410, 240, 860, 345], n: 2, kind: 'GAP' }] },
    { img: 'z20-auto-update.png', w: 1600, h: 900, crop: [257, 130, 1000, 340], caption: 'Zoho: Exchange Rate Preferences', boxes: [{ b: [285, 225, 740, 285], n: 3, kind: 'GAP' }] }],
  rows: [
    [1, 'Currencies list', 'Search Currency box; columns Format, Update Type, Exchange Rate with info icon, Last Modified By; All Status filter (Active/Inactive); status toggle.', 'Columns Currency, Symbol, Exchange rate, Status; no search, no status filter, no format/update-type/modified-by columns.', 'GAP'],
    [2, 'Per-currency detail and history', 'Clicking a currency opens Info, Exchange Rate Trends (chart) and Logs ("Exchange Rate was updated from 0.0175 to 0.02 by …").', 'No detail view, no rate history or trend.', 'GAP'],
    [3, 'Exchange Rate Preferences', 'Allow users to refresh a record\'s rate (refresh icon on records); Auto update the rate of records per module (Leads, Accounts, Deals, Quotes, … "when the record is edited").', 'Not available.', 'GAP']] });
console.log('specs written');
