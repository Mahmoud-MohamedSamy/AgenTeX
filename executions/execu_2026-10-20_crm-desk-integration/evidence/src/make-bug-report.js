// Builds ../../bug-report.html (house style of executions/execu_2026-10-12_desk-workflow-rules/bug-report.html)
// from bug-entries.js. node make-bug-report.js
const fs = require('fs');
const path = require('path');
const prev = fs.readFileSync(path.resolve(__dirname, '../../../execu_2026-10-12_desk-workflow-rules/bug-report.html'), 'utf8');
const style = prev.slice(prev.indexOf('<link rel="preconnect"'), prev.indexOf('</style>') + 8);
const { meta, bugs, cleared } = require('./bug-entries.js');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sevClass = s => (s === 'High' ? 'bug' : s === 'Medium' ? 'warn' : 'info');
const entry = b => `
    <article class="bug-entry" id="${b.id}">
      <div class="bug-head">
        <span class="bug-id">${esc(b.id)} · ${esc(b.case)}</span>
        <span class="pill ${sevClass(b.sev)}">${esc(b.sev)} (suggested)</span>
        <span class="pill info">${esc(b.area)}</span>
      </div>
      <h3>${esc(b.title)}</h3>
      <p>${b.summary}</p>
      <ol class="steps">${b.steps.map(s => `\n        <li>${s}</li>`).join('')}
      </ol>
      <dl class="facts">
        <dt>Expected (Zoho)</dt><dd>${b.expected}</dd>
        <dt>Actual (TAVI)</dt><dd>${b.actual}</dd>
        <dt>Records</dt><dd>${b.records}</dd>${b.more ? `\n        ${b.more}` : ''}
      </dl>
      <figure><img src="evidence/${b.img}" alt="${esc(b.id)}: TAVI request and response next to Zoho's documented behaviour" loading="lazy"><figcaption>${esc(b.id)}: TAVI (left, annotated request/response) vs Zoho CRM documentation (right).</figcaption></figure>
    </article>`;
const html = `<title>CRM Automation Order Bugs</title>
${style}

<div class="wrap">
  <header>
    <span class="eyebrow">TAVI CRM · QA run · 18–19 Oct 2026</span>
    <h1>CRM automation execution order: confirmed bugs</h1>
    <p>${meta.intro}</p>
    <div class="meta">
      <span><b>Host</b> staging-crm.taviportal.com (tenant NDC-Staging)</span>
      <span><b>Accounts</b> Owner, CRM Admin ×2, Supervisor, User, "test" profile</span>
      <span><b>Method</b> API (Java + RestAssured), every bug re-run alone with a control</span>
      <span><b>Result</b> ${esc(meta.result)}</span>
    </div>
    <div class="tally">
      <span class="pill bug">${bugs.filter(b => b.sev === 'High').length} high</span>
      <span class="pill warn">${bugs.filter(b => b.sev === 'Medium').length} medium</span>
      <span class="pill info">${bugs.filter(b => b.sev === 'Low').length} low</span>
      <span class="pill ok">${cleared} suspected bugs cleared on re-verification</span>
    </div>
  </header>

  <section aria-labelledby="bugs">
    <h2 id="bugs">Confirmed bugs</h2>
    <p class="lead">Each one was reproduced on 19 Oct 2026 in isolation: one process of each type on a fresh restricted QA layout, a control record next to it, results read through the API with explicit 2xx checks. The evidence images show the real request and response on the left and Zoho's documented behaviour on the right. Nothing is filed in Plane.</p>
${bugs.map(entry).join('\n')}
  </section>

  <section aria-labelledby="not-bugs">
    <h2 id="not-bugs">Not filed</h2>
    <p class="lead">${meta.notBugs}</p>
  </section>

  <footer>
    <span>Test data used the prefix "QA AEO V…" on restricted QA layouts that were created for the run and deleted after it. ${esc(meta.cleanup)}</span>
    <span>Full results, reclassifications and open questions: report.md in this folder.</span>
  </footer>
</div>
`;
fs.writeFileSync(path.resolve(__dirname, '../../bug-report.html'), html);
console.log('wrote bug-report.html', bugs.length, 'bugs');
