// Draws numbered red boxes and notes on screenshots for the Tia drafts. Output: docs/tia-assistant/report/img/ann-*.png
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const RAW = path.join(ROOT, 'executions/execu_2026-11-24_tia-retest/screenshots/raw');
const EV = path.join(ROOT, 'executions/execu_2026-11-24_tia-retest/evidence');
const OUT = path.join(__dirname, 'report/img');
// boxes: [x, y, w, h, note]
const SPECS = [
  { out: 'ann-12-create-card-refused.png', src: path.join(RAW, 'N1-12-crm-confirmed.png'), title: 'Draft 12 · CRM: create card leaves out the required First Name',
    boxes: [[858, 530, 310, 76, 'The card fills "name", company and single_line_3_9 — not the required First Name'], [858, 742, 310, 40, 'Confirm is refused with the raw code RECORD_VALIDATION_FAILED; no lead is created']] },
  { out: 'ann-13-crm-admin-denied.png', src: path.join(RAW, 'A13-crm-admin-permissions.png'), title: 'Draft 13 · CRM Admin profile: "Chat with Tia" is DENIED',
    boxes: [[604, 424, 970, 74, 'Built-in CRM Admin (system profile): Tia Assistant → Chat with Tia (ai:tia:use) is set to DENY']] },
  { out: 'ann-13-who-can-use-text.png', src: path.join(RAW, 'A13-who-can-use-tia.png'), title: 'Draft 13 · Setup page says admin profiles have "Chat with Tia"',
    boxes: [[596, 598, 628, 70, 'Text says admin profiles have the "Chat with Tia" permission — CRM Admin does not']] },
  { out: 'ann-14-summary-raw-keys.png', src: path.join(RAW, 'N1-09-crm-summarise-record.png'), title: 'Draft 14 · "Summarise this record": raw ID and internal field keys',
    boxes: [[858, 438, 310, 38, 'Owner given as a raw user ID instead of the name ndc-staging-owner'], [858, 530, 310, 176, 'Details list internal keys and values (approval_status, auto_number_2 … _7) instead of field labels']] },
  { out: 'ann-14-create-card-keys.png', src: path.join(RAW, 'N1-11-crm-create-card.png'), title: 'Draft 14 · Create card shows field keys, not labels',
    boxes: [[858, 530, 310, 76, 'Lines show keys (name, company, single_line_3_9) instead of labels (e.g. "Single Line Permission")'], [858, 636, 310, 40, 'Summary repeats the same raw keys']] },
  { out: 'ann-14-update-card-new-only.png', src: path.join(RAW, 'N1-14-crm-update-card.png'), title: 'Draft 14 · Update card shows only the new value',
    boxes: [[858, 342, 310, 40, 'Answer says "from web to referral"'], [858, 600, 310, 28, 'Card shows only "lead_source: referral" — no old value, and the key not the label']] },
  { out: 'ann-15-focus-left-panel.png', src: path.join(RAW, 'A15-focus-outside-panel.png'), title: 'Draft 15 · One Tab from the message box moves focus out of the Tia panel',
    boxes: [[841, 272, 399, 620, 'Panel is a dialog (role=dialog) but keeps no focus: after one Tab from the message box, focus is on the page body; Esc then does not close the panel']] },
  { out: 'ann-16-crm-two-switches.png', src: path.join(EV, 'tia-crm-setup-summary.png'), title: 'Draft 16 · CRM/Desk: two on/off controls, Deploy changes',
    boxes: [[600, 372, 84, 34, 'Deactivate (agent status)'], [408, 440, 719, 113, 'Tia switch — a second on/off for the same thing; keep one Activate/Deactivate'], [481, 372, 113, 34, 'Deploy changes: must stay disabled unless there are saved changes not yet live'], [697, 378, 232, 22, 'Versions and activity only as a link to Omnichannel']] },
  { out: 'ann-16-omni-overview.png', src: path.join(EV, 'tia-omni-overview.png'), title: 'Draft 16 · Omnichannel Tia page: delete, a third on/off, more data',
    boxes: [[1201, 194, 30, 30, 'Delete (bin): Tia should never be deletable'], [1085, 190, 99, 38, 'Set Inactive: a third on/off control'], [290, 250, 290, 40, 'Overview / Observability / Versions tabs exist only in Omnichannel'], [292, 328, 462, 362, 'Instructions, Agent Role, Other Info — not on the CRM/Desk page'], [772, 330, 462, 650, 'Tools (30) list with Edit']] },
  { out: 'ann-16-omni-observability.png', src: path.join(EV, 'tia-omni-observability.png'), title: 'Draft 16 · Omnichannel only: Observability',
    boxes: [[292, 362, 957, 246, 'Sessions, executions, latency, success rates, tokens and routing quality — not shown in CRM/Desk'], [292, 632, 957, 116, 'Session list']] },
  { out: 'ann-16-omni-versions.png', src: path.join(EV, 'tia-omni-versions.png'), title: 'Draft 16 · Omnichannel only: Versions with Redeploy; history restarts at Version 1',
    boxes: [[294, 368, 954, 282, 'Version list starts again at Version 1 (24 Nov) — the older agent and its versions 1–38 are gone'], [1172, 428, 64, 22, 'Redeploy only here'], [1100, 190, 99, 38, 'Set Inactive'], [1216, 194, 30, 30, 'Delete']] },
  { out: 'ann-3246-placeholder-comment.png', src: path.join(RAW, 'C-01-NDC-3246-suggestion.png'), title: 'NDC-3246 comment · Card offered with placeholder text; Confirm saves it',
    boxes: [[1199, 492, 306, 82, 'Comment text is a placeholder: "Please provide the details or content for the private comment to be added."'], [1209, 732, 80, 32, 'Confirm saved exactly this text as a private comment on the ticket']] },
  { out: 'ann-17-deploy-enabled.png', src: path.join(RAW, 'B-09-setup-page.png'), title: 'Draft 17 · Draft with the run-action tool and 0 actions: Deploy changes is enabled, no warning',
    boxes: [[651, 317, 114, 32, 'Deploy changes is enabled although the draft cannot be deployed (0 custom actions chosen)'], [596, 260, 677, 46, 'Only the generic "changes not live yet" note; nothing says the setup is invalid']] },
  { out: 'ann-17-warning-after-click.png', src: path.join(RAW, 'B-09-deploy-clicked.png'), title: 'Draft 17 · The block appears only after Deploy changes is pressed',
    boxes: [[596, 318, 677, 46, '"Tia can propose running actions, so choose which actions before you deploy." — shown only after the click'], [651, 375, 114, 32, 'The button stays enabled even now']] },
  { out: 'ann-18-daily-limit-owner.png', src: path.join(RAW, 'G-14-owner.png'), title: 'Draft 18 · Owner gets the same daily-limit message as an agent, with no way to fix it',
    boxes: [[1197, 378, 310, 56, 'Owner (can raise the allowance and buy credits): "Your workspace has reached today’s limit for Tia. It resets tomorrow." — no link to Tia settings or Billing']] },
  { out: 'ann-19-picker-all-profiles.png', src: path.join(RAW, 'A-13-picker-open.png'), title: 'Draft 19 · User without the right to list profiles sees every profile in "Who can use Tia"',
    boxes: [[308, 210, 471, 586, 'Every workspace profile is listed, although this user’s profile has no right to list profiles; no "needs permission" message']] },
  { out: 'ann-20-create-tia-while-in-bin.png', src: path.join(RAW, 'B-20-no-tia-setup-page.png'), title: 'Draft 20 · "Create Tia" offered while Tia is still in the Recycle Bin',
    boxes: [[575, 181, 718, 126, 'Create Tia is offered, with no mention that Tia can be restored from the Recycle Bin — a second Tia could be created']] },
  { out: 'ann-26-allowance-5.png', src: path.join(RAW, 'jam-a9ee-057-allowance-5.jpg'), title: 'Draft 26 · Daily limit reached: the page shows the allowance (5) but not how much was used today',
    boxes: [[732, 296, 258, 48, 'Every message: "Your workspace has reached today’s limit for Tia. It resets tomorrow."'], [342, 360, 210, 22, 'Only strong-model steps used today are shown — not credits used today'], [350, 404, 152, 32, 'Credits per day = 5; nothing says how much of it is used or how far to raise it']] },
  { out: 'ann-26-saved-7-still-blocked.png', src: path.join(RAW, 'jam-a9ee-071-saved-7.jpg'), title: 'Draft 26 · Raised to 7, "Saved. It applies at once." — Tia still refuses',
    boxes: [[350, 155, 152, 32, 'Credits per day raised from 5 to 7'], [350, 195, 565, 40, '"Saved. It applies at once."'], [732, 380, 258, 48, 'The next message is refused with the same limit message (today’s use is above 7)']] },
  { out: 'ann-27-no-ai-conversations.png', src: path.join(RAW, 'jam-a9ee-052-ai-usage.jpg'), title: 'Draft 27 · AI Usage & Cost: "No AI conversations in this period yet" while Tia has used credits',
    boxes: [[336, 222, 376, 100, 'Last 30 days: "No AI conversations in this period yet."'], [340, 140, 580, 22, '141.91 credits spent of 50,500 added — so AI was used'], [415, 436, 230, 32, 'All time: 141.91 credits spent']] },
  { out: 'ann-43-desk-kb-chat-department.png', src: path.join(RAW, 'P3-D02-kb-uploaded.png'), title: 'Draft 43 · Tia Knowledge Base: Desk articles only work through a sync and "the chat’s department"',
    boxes: [[608, 287, 610, 82, 'Desk knowledge base needs the knowledge-base sync and a category mapped to a department, and uses only articles of "the chat’s department" — Tia is used by staff, there is no chat department'], [596, 662, 628, 46, '"Ask a question the way a customer would" — customer-agent wording on the Tia page']] },
  { out: 'ann-49-untranslated-upload-title.png', src: path.join(RAW, 'P3-D02-kb-uploaded.png'), title: 'Draft 49 · Untranslated text key on the Tia Knowledge Base tab',
    boxes: [[812, 456, 196, 26, 'Raw key "agents.wizard.kb.uploadTitle" shown instead of a title']] },
];
(async () => {
  const b = await chromium.launch({ channel: 'msedge' });
  for (const s of SPECS.filter(x => !process.env.ONLY || x.out.includes(process.env.ONLY))) {
    const img = fs.readFileSync(s.src).toString('base64');
    const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
    await p.setContent(`<img id="i" src="data:image/${/.jpe?g$/.test(s.src)?'jpeg':'png'};base64,${img}">`); const { w, h } = await p.$eval('#i', e => ({ w: e.naturalWidth, h: e.naturalHeight }));
    const head = 64 + 30 * s.boxes.length;
    await p.setViewportSize({ width: w, height: h + head });
    const html = `<style>body{margin:0;font-family:'Segoe UI',Arial,sans-serif;background:#fff}
      .hd{height:${head}px;box-sizing:border-box;padding:12px 16px;background:#1b2330;color:#fff}
      .hd h1{font-size:19px;margin:0 0 8px;font-weight:600}.hd div{font-size:14.5px;line-height:30px;display:flex;gap:8px;align-items:center}
      .n{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;border-radius:11px;background:#e0262e;color:#fff;font:700 13px Arial}
      .wrap{position:relative;width:${w}px;height:${h}px}.wrap img{display:block}
      .bx{position:absolute;border:3px solid #e0262e;border-radius:6px;box-shadow:0 0 0 2px rgba(255,255,255,.8)}
      .bx .n{position:absolute;top:-13px;left:-13px;box-shadow:0 0 0 2px #fff}</style>
      <div class="hd"><h1>${s.title}</h1>${s.boxes.map((x, i) => `<div><span class="n">${i + 1}</span>${x[4].replace(/</g, '&lt;')}</div>`).join('')}</div>
      <div class="wrap"><img src="data:image/png;base64,${img}">${s.boxes.map((x, i) => `<div class="bx" style="left:${x[0] - 4}px;top:${x[1] - 4}px;width:${x[2] + 2}px;height:${x[3] + 2}px"><span class="n">${i + 1}</span></div>`).join('')}</div>`;
    await p.setContent(html); await p.waitForTimeout(150);
    await p.screenshot({ path: path.join(OUT, s.out), fullPage: true }); await p.close(); console.log('ok', s.out, w, h);
  }
  await b.close();
})();
