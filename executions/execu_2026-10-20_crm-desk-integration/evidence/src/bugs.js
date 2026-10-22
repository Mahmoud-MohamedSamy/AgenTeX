// Evidence definitions for the CONFIRMED bugs of the 18–19 Oct 2026 CRM automation-order run.
// node bugs.js  -> writes <id>-api.json + <id>.json, renders <id>-api.png (make-api-shot.js) and ../<id>-vs-zoho.png (make-evidence.js)
// TAVI side = annotated rendering of the real request/response (target/crm-verify.log, 19 Oct 2026; tokens are never logged).
// Zoho side = Zoho CRM help text (DOCS ONLY): the states involved cannot be produced in the live Zoho org without saving data there.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const D = '19 Oct 2026';
const SRC = {
  AP: 'https://help.zoho.com/portal/en/kb/crm-v2-1/faqs/approval-process/articles/crm-v2-exist-faqs-on-approval-process (Q9)',
  APADD: 'https://help.zoho.com/portal/en/kb/crm/process-management/approval-process/articles/add-approval-process',
  RP: 'https://help.zoho.com/portal/en/kb/crm/process-management/review-process/articles/review-process',
  RPFAQ: 'https://help.zoho.com/portal/en/kb/crm/faqs/review-process/articles/faqs-review-process (Q26)',
  WF: 'https://help.zoho.com/portal/en/kb/crm-v2-1/automate-business-processes/workflow-management/articles/crm-v2-configuring-workflow-rules',
  WFFAQ: 'https://help.zoho.com/portal/en/kb/crm-v2-1/faqs/automation/workflow-rules/articles/crm-v2-exist-faqs-workflow (Q10)',
  AR: 'https://help.zoho.com/portal/en/kb/crm-nextgen/automate-business-processes/assignment-rules/articles/nextgen-set-assignment-rules',
  APFAQ34: 'https://help.zoho.com/portal/en/kb/crm-v2-1/faqs/approval-process/articles/crm-v2-exist-faqs-on-approval-process (Q34)',
  IMP: 'https://help.zoho.com/portal/en/community/topic/execute-automation-and-other-processes-during-import',
  BP: 'https://help.zoho.com/portal/en/kb/crm/process-management/blueprint/articles/execute-blueprint',
};
const bugs = require('./bugs-data.js')(SRC);

for (const b of bugs) {
  const shot = { out: `${b.id}-api.png`, title: `${b.id} · ${b.case} · TAVI request/response (19 Oct 2026, staging-crm)`, blocks: b.blocks };
  fs.writeFileSync(path.join(__dirname, `${b.id}-api.json`), JSON.stringify(shot, null, 1));
  execFileSync('node', [path.join(__dirname, 'make-api-shot.js'), path.join(__dirname, `${b.id}-api.json`)], { stdio: 'inherit' });
  const cfg = {
    out: `../${b.id}-${b.slug}-vs-zoho.png`, id: `${b.id} (${b.case})`, title: b.title, verdict: 'Differs', date: D,
    zohoSource: 'Zoho CRM help (documentation; the state cannot be produced read-only in the live org)',
    panels: [
      { side: 'TAVI', caption: b.taviCaption, img: `${b.id}-api.png` },
      { side: 'Zoho', caption: b.zohoCaption, text: b.zohoText, sources: b.zohoSources, flag: 'ZOHO DOCS — not seen on screen' },
    ],
    rows: b.rows, notes: b.notes || [],
  };
  fs.writeFileSync(path.join(__dirname, `${b.id}.json`), JSON.stringify(cfg, null, 1));
  execFileSync('node', [path.join(__dirname, 'make-evidence.js'), path.join(__dirname, `${b.id}.json`)], { stdio: 'inherit' });
}
