// Renders request/response "API console" panels (1600x900 PNG) from plane-evidence.json for API-only evidence.
const path = require('path'); const fs = require('fs');
const P = path.resolve(__dirname, '../../..');
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const EV = JSON.parse(fs.readFileSync(path.join(__dirname, '../evidence/plane-evidence.json'), 'utf8'));
const OUT = path.join(__dirname, '../evidence/ui');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const j = x => JSON.stringify(x).replace(/,"/g, ", \"").replace(/:/g, ": ");
const panels = {
  'EV1-api': { title: 'Same values: normal ticket edit vs blueprint transition (ticket #' + EV.bug1.no + ')', blocks: [
    ['PATCH /modules/{tickets}/records/{id}  qa_ndc_tkt_pnr_no = 400 × "X"', j(EV.bug1.normalEdit.tooLong), 'bad'],
    ['PATCH …  category = "zzz-not-an-option"', j(EV.bug1.normalEdit.badOption), 'bad'],
    ['PATCH …  contact_id = ' + EV.bug1.fake, j(EV.bug1.normalEdit.missingContact), 'bad'],
    ['POST /desk/tickets/{id}/blueprint-transitions/go  fields: same 3 values', j(EV.bug1.transitionRun) + '\nstored → ' + j(EV.bug1.stored), 'ok'] ] },
  'EV2-api': { title: 'Blueprint save with a wrongly shaped "requiredFor"', blocks: [
    [EV.bug2.request, j(EV.bug2.response), 'bad'],
    ['Same endpoint, malformed owner id (fixed by NDC-3069)', j(EV.bug2.ownerCase), 'ok'] ] },
  'EV3-api': { title: 'Agent A (named owner of "QA Approve") on ticket #' + EV.bug3.no + ' owned by Agent B', blocks: [
    ['PATCH /modules/{tickets}/records/{id} as Agent A (edit the ticket)', j(EV.bug3.aEdit), 'bad'],
    ['GET …/blueprint-transitions as Agent A', j(EV.bug3.aOffered), 'bad'],
    ['POST /desk/tickets/{id}/blueprint-transitions/approve as Agent A', j(EV.bug3.aRun), 'bad'] ] },
  'EV4-api': { title: 'Workflow rule "' + EV.bug4.ruleName + '" (Field Update Status = Closed) on ticket #' + EV.bug4.no + ' in a blueprint', blocks: [
    ['GET /workflow/executions?ruleId=…  (this ticket)', j(EV.bug4.executions), 'bad'],
    ['Ticket afterwards', j({ status: EV.bug4.statusAfter, blueprintState: EV.bug4.stateAfter }), 'ok'] ] },
  'EV5-api': { title: 'Transition "QA Review" owner = Tech department, agent "Test User 1" (not a Tech agent)', blocks: [
    ['POST /modules/{tickets}/blueprints  (save)', j({ status: EV.bug5.save.status, note: 'saved, no warning' }) + '\nTest User 1 is a Tech agent: ' + EV.bug5.userIsTechAgent, 'bad'],
    ['Ticket #' + EV.bug5.no + ' enters the state → shares', j(EV.bug5.shares), 'ok'],
    ['As Test User 1: transitions offered / run "review"', j(EV.bug5.offered) + '\n' + j(EV.bug5.run), 'bad'] ] },
};
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] }); const pg = await b.newPage({ viewport: { width: 1600, height: 900 } });
  for (const [name, p] of Object.entries(panels)) {
    const html = `<html><body style="margin:0;background:#0f172a;font-family:Consolas,monospace;color:#e2e8f0">
      <div style="padding:20px 28px;font:600 22px Segoe UI,Arial;color:#f8fafc;border-bottom:1px solid #334155">${esc(p.title)}</div>
      <div style="padding:16px 28px;display:grid;gap:14px">${p.blocks.map(([h, body, k]) => `<div style="border:1px solid #334155;border-left:5px solid ${k === 'bad' ? '#ef4444' : '#22c55e'};border-radius:6px;padding:10px 14px">
        <div style="font:600 16px Segoe UI,Arial;color:#93c5fd;margin-bottom:6px">${esc(h)}</div><pre style="margin:0;white-space:pre-wrap;font-size:15px;line-height:1.35">${esc(body).slice(0, 1600)}</pre></div>`).join('')}</div></body></html>`;
    await pg.setContent(html); await pg.waitForTimeout(300); await pg.screenshot({ path: path.join(OUT, name + '.png') }); console.log('panel', name);
  }
  await b.close();
})();
