const o = {};
await page.getByText('qa_gl_w2_img', { exact: true }).first().click().catch(e => o.e = String(e).slice(0, 80)); await sleep(4000);
o.composer = (await page.locator('[contenteditable=true]').last().innerText().catch(() => '')).slice(0, 200);
const ed = page.locator('[contenteditable=true]').last(); await ed.scrollIntoViewIfNeeded().catch(() => {});
o.shot = await shot('../wave2n/i-snippet-inserted');
return done(o);
