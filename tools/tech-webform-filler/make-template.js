#!/usr/bin/env node
// Creates tech-webform-tickets.xlsx: a "Tickets" sheet with the Tech Webform columns (drop-downs for the
// choice fields) and two sample rows, plus an "Options" sheet listing the allowed values.
// Usage: node make-template.js [output.xlsx]
const ExcelJS = require('exceljs'), path = require('path'), fs = require('fs');
const OUT = path.resolve(process.argv[2] || path.join(__dirname, 'tech-webform-tickets.xlsx'));
if (fs.existsSync(OUT)) { console.error('Already exists, not overwritten: ' + OUT); process.exit(1); }

// Options as shown on the Tech Webform on 8 Nov 2026 (re-run this script if the form changes)
const OPTIONS = {
  Classification: ['question', 'problem', 'feature', 'others'],
  Priority: ['low', 'medium', 'high', 'urgent'],
  Category: ['general', 'technical', 'billing', 'account', 'feature_request', 'other'],
  'Sub Category': ['how_to', 'bug', 'installation', 'configuration', 'performance', 'integration', 'invoice', 'payment', 'refund', 'access', 'subscription', 'other'],
  Skills: ['tier_1_support', 'tier_2_support', 'escalation_handling', 'billing', 'account_management', 'product_expertise', 'Bug Investigation'],
};
const COLS = [
  ['Subject', 40, true], ['Classification', 16], ['First Name', 16], ['Last Name', 18, true], ['Phone', 16], ['Email', 30, true],
  ['Priority', 12], ['Description', 50], ['Skills', 34], ['Due Date', 20], ['Sub Category', 16], ['Category', 16], ['Attachments', 30],
];

(async () => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Tickets', { views: [{ state: 'frozen', ySplit: 1 }] });
  ws.columns = COLS.map(([h, w]) => ({ header: h, key: h, width: w }));
  ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ws.getRow(1).eachCell((c, i) => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLS[i - 1][2] ? 'FFC62F2F' : 'FF1D2330' } }; });
  ws.addRow({ Subject: 'QA webform test 1 - login problem', Classification: 'problem', 'First Name': 'Test', 'Last Name': 'Customer One', Phone: '+201000000001', Email: 'qa.webform.1@example.com', Priority: 'high', Description: 'Created by fill-webform.js from the Excel sheet.', Skills: 'tier_1_support; billing', 'Due Date': new Date(Date.UTC(2026, 10, 20, 9, 30)), 'Sub Category': 'access', Category: 'technical' });
  ws.addRow({ Subject: 'QA webform test 2 - question', Classification: 'question', 'Last Name': 'Customer Two', Email: 'qa.webform.2@example.com', Priority: 'low', Description: 'Only the required fields plus a few extras.' });
  ws.getColumn('Due Date').numFmt = 'yyyy-mm-dd hh:mm';
  // drop-downs for single-choice columns (rows 2..500)
  const opt = wb.addWorksheet('Options');
  let col = 1;
  for (const [name, list] of Object.entries(OPTIONS)) {
    opt.getCell(1, col).value = name; opt.getCell(1, col).font = { bold: true };
    list.forEach((v, i) => { opt.getCell(i + 2, col).value = v; });
    opt.getColumn(col).width = 22;
    if (name !== 'Skills') {
      const letter = opt.getColumn(col).letter; const target = ws.getColumn(name).letter;
      for (let r = 2; r <= 500; r++) ws.getCell(`${target}${r}`).dataValidation = { type: 'list', allowBlank: true, formulae: [`Options!$${letter}$2:$${letter}$${list.length + 1}`], showErrorMessage: true, errorTitle: 'Not an option', error: `Pick a ${name} from the list` };
    }
    col++;
  }
  opt.getCell(1, col + 1).value = 'Notes'; opt.getCell(1, col + 1).font = { bold: true };
  ['Red headers are required by the form (Subject, Last Name, Email).', 'Skills: several values separated by ";".', 'Due Date: an Excel date/time, or text like 2026-11-20 09:30.', 'Attachments: file paths separated by ";" (relative to this file).', 'Every SENT row creates a real ticket in the Tech department on NDC-Staging.']
    .forEach((t, i) => { opt.getCell(i + 2, col + 1).value = t; });
  opt.getColumn(col + 1).width = 70;
  await wb.xlsx.writeFile(OUT);
  console.log('Template written: ' + OUT);
})().catch(e => { console.error('ERROR', e.message); process.exit(1); });
