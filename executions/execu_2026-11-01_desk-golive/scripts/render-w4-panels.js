// Wave 4 evidence panels for D1, D8, D9 from recorded run data (wave4/raw/after.json, clean3/4/6.json, evidence/raw/w4/W4-73-closing-mail.txt). No secrets.
const fs = require('fs'), path = require('path');
const { chromium } = require(path.join(path.resolve(__dirname, '../../..'), 'node_modules/playwright'));
const OUT = path.join(__dirname, '../evidence/raw/w4'); const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const mail = fs.readFileSync(path.join(OUT, 'W4-73-closing-mail.txt'), 'utf8').split('\n').slice(3).join('\n').trim();
const P = {
  'panel-D1-domains.png': ['Setup › Channels › Email › Your domains — NDC-Staging, 12 Nov 2026 (GET /desk/channels/domains after the run)', [
    ['Add domain "http://x.com"', 'saved → "domain": "http:%2f%2fx.com", waiting for DNS proof', true],
    ['Add domain "exa mple.com" (with a space)', 'saved → "domain": "exa mple.com", waiting for DNS proof', true],
    ['Add domain "abc" / a domain already in the list', 'HTTP 503 "our side, please try again" — no validation message', true],
    ['Remove a bad domain', 'state becomes "retired"; both junk domains stay in the list (exists: true)']]],
  'panel-D8-closing-mail.png': ['Closing email received by the customer for #3280 — NDC-Staging, 12 Nov 2026 21:11 and 21:16 UTC', [
    ['Settings at both closes', 'Email › Replies: acknowledgement_enabled = true\nCustomer Happiness: is_enabled = true, trigger = on_close, department scope = Marketing (ticket #3280 is in Marketing)'],
    ['Mail as received (pasted by the tester)', mail, true],
    ['Acknowledgements', 'New tickets #3278, #3279, #3280 and the customer reply on #3280: no acknowledgement email arrived. Agent replies on the same tickets were delivered.', true]]],
  'panel-D9-reply-ack.png': ['Setup › Email Templates — department reply-acknowledgement template "QA GL W4 reply ack" (Marketing) — 12 Nov 2026', [
    ['Your template › Actions', 'shows "Activate" (as if it were not active)'],
    ['Built-in "Reply acknowledgement" › Actions › Activate', 'disabled — title: "This template is already the one being sent."', true],
    ['DELETE /desk/email-templates/{id}', '422 UNPROCESSABLE "This template is the one being sent. Activate another template, or the built-in one, before …"', true],
    ['POST …/system.ticket.reply_acknowledgement/activate { department_id }', '200, but nothing changes — the template still cannot be deleted. There is no Deactivate.']]],
};
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true }); const pg = await b.newPage({ viewport: { width: 1440, height: 300 } }); const res = {};
  for (const [f, [title, blocks]] of Object.entries(P)) {
    await pg.setContent(`<html><body style="margin:0;background:#0f172a;color:#e2e8f0;font:15px/1.5 Consolas,monospace;width:1440px"><div style="padding:16px 22px;background:#1e293b;font:600 16px 'Segoe UI'">${esc(title)}</div>${blocks.map(([h, t, bug]) => `<div class="blk${bug ? ' bug' : ''}" style="padding:12px 22px"><div style="color:#93c5fd;font:600 14px 'Segoe UI';margin-bottom:6px">${esc(h)}</div><pre style="margin:0;white-space:pre-wrap">${esc(t)}</pre></div>`).join('')}<div style="height:12px"></div></body></html>`);
    const h = await pg.evaluate(() => document.body.scrollHeight); await pg.setViewportSize({ width: 1440, height: h });
    res[f] = { h, bugs: await pg.evaluate(() => [...document.querySelectorAll('.blk.bug')].map(d => { const r = d.getBoundingClientRect(); return [Math.round(r.x + 14), Math.round(r.y + 6), Math.round(r.right - 14), Math.round(r.bottom - 4)]; })) };
    await pg.screenshot({ path: path.join(OUT, f) });
  }
  fs.writeFileSync(path.join(OUT, 'w4-panels.json'), JSON.stringify(res, null, 1)); console.log(JSON.stringify(res)); await b.close();
})();
