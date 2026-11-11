module.exports = async ({ page, log, shot }) => {
  await require('./view.js')(page, 'QA RT15 2807 view'); await shot('c-2807-list');
  log((await page.innerText('body')).replace(/\s+/g,' ').match(/Total Records.{0,40}/)?.[0]);
};
