// Renders request/response "API console" panels (1600x900 PNG) from plane-evidence.json for API-only evidence.
const path = require('path'); const fs = require('fs');
const P = path.resolve(__dirname, '../../..');
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const EV = JSON.parse(fs.readFileSync(path.join(__dirname, '../evidence/plane-evidence2.json'), 'utf8')); const ZB = JSON.parse(fs.readFileSync(path.join(__dirname, '../../execu_2026-11-18_direct-assign-sources/out/zbp.json'), 'utf8'));
const OUT = path.join(__dirname, '../evidence/ui');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const j = x => JSON.stringify(x).replace(/,"/g, ", \"").replace(/:/g, ": ");
const panels = {
  'EW-EN13-zoho': { title: 'Zoho Desk 18 Nov 2026 (live): ticket created in status Escalated, blueprint "Test Blueprint 01" (Open → Escalated → …)', blocks: [
    ['Ticket #' + ZB.Z2.n + ' created with status Escalated → GET ticket + blueprint', j({ status: ZB.Z2.status, statusNow: ZB.Z2.now, blueprint: 'Test Blueprint 01', blueprintState: 'Escalated' }), 'ok'],
    ['Control: ticket #' + ZB.Z1.n + ' created with status Open', j({ status: ZB.Z1.status, statusNow: ZB.Z1.now, blueprintState: 'Open' }), 'ok'] ] },
  'EW-ST05-api': { title: 'Blueprint save (API) with ids that do not exist', blocks: [
    ['State slaBusinessHoursId = random id', j(EV.st05.unknownBusinessHours), 'bad'],
    ['Escalation level templateId = random id', j(EV.st05.unknownTemplate), 'bad'],
    ['Control: transition owner = random user id', j(EV.st05.controlUnknownOwner), 'ok'] ] },
  'EW-CV06-api': { title: 'Blueprint save (API): transition without a name, 2,000-item checklist', blocks: [
    ['Transition name = ""', j(EV.cv06.emptyName), 'bad'],
    ['Transition checklist with 2,000 items', j(EV.cv06.checklist2000), 'bad'],
    ['Control: unknown after-action kind "launchRocket"', j(EV.cv06.controlUnknownAction), 'ok'] ] },
  'EW-TFX1-api': { title: 'Create-task after-action with assigneeMode "specific" (valid: owner / performer / user / team)', blocks: [
    ['Save', j(EV.tfx1.save) + ' · stored assigneeMode: ' + EV.tfx1.storedMode, 'bad'],
    ['Run the transition → created task', j({ run: EV.tfx1.run.status, taskOwner: EV.tfx1.taskOwner, ticketOwner_AgentB: EV.tfx1.ticketOwner, assigneeUserId_sent_AgentA: EV.tfx1.intendedUser }), 'bad'] ] },
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
