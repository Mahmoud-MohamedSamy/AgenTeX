const { execSync } = require('child_process');
const RUN = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-08_desk-automation-order';
const api = (code) => { require('fs').writeFileSync(RUN + '/scripts/.s22.js', code); return execSync('node api.js ndc-staging-owner .s22.js', { cwd: RUN + '/scripts' }).toString().trim(); };
const NL = String.fromCharCode(10);
module.exports = async (h) => {
  const { page, go, shot, log } = h;
  // inactive saved action (K8) + K10 names by API
  const out = api("const T='88e8ea44-1658-4df3-9930-d0902b91073d';const mk=async(n,act)=>{const r=await api('POST','/workflow/actions',{moduleId:T,name:n,description:null,isActive:act,action:{type:'FieldUpdate',order:0,delaySeconds:0,fieldUpdates:{description:{kind:'string',stringValue:'k'}}}});return r.s+' '+(r.j?.data?.id||r.t.slice(0,160));};" +
    "return {K8:await mk('QA AO WF K8 inactive',false),K10_arabic:await mk('QA AO WF K10 عربي 😀',true),K10_html:await mk('QA AO WF K10 <img src=x onerror=window.__k10=1>',true),K10_spaces:await mk('   ',true),K10_long:await mk('QA AO WF K10 '+'x'.repeat(300),true)};");
  log('K_api', out);
  // K4: New Action dialog validation
  await go('/settings/automation/actions'); await page.waitForTimeout(3000);
  log('K_list', (await page.locator('main').last().innerText()).split(NL).filter(l => /QA AO WF K|Used by|Inactive|Active/.test(l)).slice(0, 12));
  log('K10_xss', await page.evaluate(() => window.__k10 || 0)); await shot('s22-library', { full: true });
  await page.getByRole('button', { name: 'New Action' }).first().click(); await page.waitForTimeout(1000);
  const dlg = page.getByRole('dialog').first();
  log('K4_dialog', (await dlg.innerText()).split(NL).filter(Boolean).slice(0, 20));
  const btns = await dlg.getByRole('button').allInnerTexts(); log('K4_buttons', btns.map(b => b.split(NL)[0]));
  const field = dlg.getByRole('button', { name: /^Field Update/ }).first(); if (await field.count()) { await field.click(); await page.waitForTimeout(800); }
  const save = dlg.getByRole('button', { name: /^(Save|Create)/ }).last();
  if (await save.count()) { log('K4_saveDisabled', await save.isDisabled()); if (!(await save.isDisabled())) { await save.click(); await page.waitForTimeout(1500); } }
  log('K4_errors', (await dlg.innerText().catch(() => 'closed')).split(NL).filter(l => /required|name|pick|select|must|fill/i.test(l)).slice(0, 8));
  log('K4_toasts', await page.locator('[data-sonner-toast]').allInnerTexts());
  await shot('s22-k4', { full: true });
  await page.keyboard.press('Escape');
};
