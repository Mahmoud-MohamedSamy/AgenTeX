// NDC-1948 r12: as denied user U1 (mahmoud.mmohamedsamy, policy default Deny): add note on own lead, watch for Posting…, reload, Notes list + Timeline tab.
const st = {}; const reqs = []; require(require('path').join(process.cwd(), 'hook.js'))(page, reqs);
const ID = '359519af-9468-4c18-b715-d9b46c93e2b9', L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const load = async () => { await page.goto(`${H}/modules/${L}/records/${ID}`, { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 80; i++) { await sleep(3000); const t = await text(); if (/QA RT12 1948 lead/.test(t) && /Notes/.test(t) && !/Loading/.test(t)) break; } await sleep(8000); };
await load(); await shot('1948-b1-open.png');
st.tabs = (await page.getByRole('tab').allInnerTexts()).map(x => x.trim());
st.notesBefore = ((await text()).match(/Notes[\s\S]{0,200}/) || [''])[0].replace(/\n+/g, ' | ').slice(0, 200);
// add note
const box = page.locator('[contenteditable=true]').first(); st.box = await box.count();
await box.click(); await sleep(800); const nb = page.getByRole('textbox').filter({ hasNot: page.locator('input') }); 
await page.keyboard.type('QA RT12 1948 note by denied user'); await sleep(800);
const save = page.getByRole('button', { name: 'Add note', exact: true }); st.saveBtns = await save.allInnerTexts(); await save.last().click();
await sleep(2000); st.after2s = { posting: /Posting/.test(await text()), shown: /QA RT12 1948 note by denied user/.test(await text()), toast: ((await text()).match(/Note (added|saved)[^\n]*/) || [''])[0] }; await shot('1948-b2-after-2s.png');
await sleep(10000); st.after12s = { posting: /Posting/.test(await text()), shown: /QA RT12 1948 note by denied user/.test(await text()) }; await shot('1948-b3-after-12s.png');
await load(); await shot('1948-b4-reload.png');
st.afterReload = { shown: /QA RT12 1948 note by denied user/.test(await text()), noNotes: /No notes yet/.test(await text()) };
st.tabsAfter = (await page.getByRole('tab').allInnerTexts()).map(x => x.trim());
const tl = page.getByRole('tab', { name: /Timeline/i }); st.timelineTab = await tl.count(); if (st.timelineTab) { await tl.first().click(); await sleep(6000); await shot('1948-b5-timeline.png'); st.timelineText = ((await text()).match(/(No activity yet|Something went wrong|You don't have[^\n]*|not allowed[^\n]*)/) || [''])[0]; }
st.reqs = reqs.filter(x => /notes|timeline/.test(x)).map(x => x.slice(0, 260)).slice(-10); return st;
