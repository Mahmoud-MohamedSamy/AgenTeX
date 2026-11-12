const { openEditor } = require('./lib-ed');
module.exports = async (h) => {
  const { page, shot, log } = h; const main = page.locator('main').last(); const clk = l => l.dispatchEvent('click');
  await openEditor(h, 'QA AO WF Z picker', 'Create');
  await clk(main.getByRole('button', { name: 'Add action' }).first()); await page.waitForTimeout(900);
  const t = await main.innerText(); const part = t.split('Instant actions')[1] || t;
  log('picker', part.split('\n').filter(Boolean).slice(0, 60));
  log('hits', ['Cliq', 'Slack', 'Teams', 'Google Chat', 'WhatsApp', 'Telegram', 'SMS', 'Instant', 'Message', 'AI', 'Zia', 'Predict', 'Generate', 'Extract', 'Auto reply', 'Chat'].filter(k => new RegExp('\b' + k + '\b', 'i').test(part)));
  await shot('z-action-picker');
  await clk(main.getByRole('button', { name: 'Add scheduled action' }).first()).catch(() => {}); await page.waitForTimeout(700); await shot('z-action-picker-scheduled');
  await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).forEach(k => localStorage.removeItem(k)));
};
