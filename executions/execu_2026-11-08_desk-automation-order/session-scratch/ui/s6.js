const { openEditor } = require('./lib-ed');
module.exports = async (h) => {
  const { page, shot, log } = h;
  await openEditor(h, 'QA AO WF C10 editor');
  log('url', page.url()); await shot('s6-editor', { full: true });
  log('text', (await page.locator('main').last().innerText()).slice(0, 2500));
  log('buttons', (await page.locator('main').last().getByRole('button').allInnerTexts()).map(s => s.trim()).filter(Boolean));
};
