// Contact sheet with a 100px coordinate grid. Usage: node sheet.js out.png img1 img2 ... (up to 4, 2x2)
const path = require('path'); const fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const RAW = path.join(P, 'executions/execu_2026-10-18_retest-mahmoudmohamed/screenshots/raw');
const [out, ...imgs] = process.argv.slice(2); const k = 0.5;
const cells = imgs.map(n => { const src = 'data:image/png;base64,' + fs.readFileSync(path.join(RAW, n)).toString('base64');
  let g = ''; for (let x = 100; x < 1600; x += 100) g += `<div style="position:absolute;left:${x * k}px;top:0;bottom:0;border-left:1px solid rgba(255,0,0,${x % 500 ? .25 : .6})"></div><span style="position:absolute;left:${x * k + 1}px;top:0;font:9px monospace;color:red">${x}</span>`;
  for (let y = 100; y < 900; y += 100) g += `<div style="position:absolute;top:${y * k}px;left:0;right:0;border-top:1px solid rgba(255,0,0,${y % 500 ? .25 : .6})"></div><span style="position:absolute;top:${y * k + 1}px;left:0;font:9px monospace;color:red">${y}</span>`;
  return `<div style="display:inline-block;margin:4px;vertical-align:top"><div style="font:12px sans-serif">${n}</div><div style="position:relative;width:${1600 * k}px;height:${900 * k}px"><img src="${src}" style="width:${1600 * k}px">${g}</div></div>`; }).join('');
(async () => { const b = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] }); const pg = await b.newPage({ viewport: { width: 1650, height: 960 } });
  await pg.setContent(`<body style="margin:0">${cells}</body>`); await pg.screenshot({ path: out }); await b.close(); console.log('ok'); })();
