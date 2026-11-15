async (page) => {
const LINK = "https://desk.zoho.com/support/SurveyForm?gid=edbsn79688d314d1027aefd0c187db77345ae&thd=edbsn8a765658ca551b8a6c611783795060346eb9d9727ec153e39baed4b920e3e6b2&uid=edbsnc79479be8f7e3b3fac9729edb0c52fee&aid=edbsnd4e5465588211dfacefb11da94d7ef24282f92c7b2c03204ce631f909dc865a8&did=edbsn8de93b51fec4151a52fd78b3784b60a62832fd24e14353d73fc51f06560f9179&lang=ar-EG&sop=3";
  const ctx = await page.context().browser().newContext({ viewport: { width: 1280, height: 720 } }); const p = await ctx.newPage(); const out = {};
  await p.goto(LINK, { waitUntil: 'domcontentloaded', timeout: 60000 }); await p.waitForTimeout(6000);
  out.html = await p.evaluate(() => document.documentElement.lang + '/' + document.documentElement.dir + ' body dir=' + getComputedStyle(document.body).direction);
  out.text = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 500);
  await p.screenshot({ path: 'evidence/zoho-w4r/W4-76-zoho-page.png' });
  const ta = p.locator('textarea').first(); out.ta = await ta.count();
  if (out.ta) { await ta.fill(('تجربة اختبار QA GL W4R تعليق طويل باللغة العربية للتحقق من الحفظ الكامل والاتجاه من اليمين إلى اليسار. ').repeat(3)); out.taDir = await ta.evaluate(e => getComputedStyle(e).direction + ' dir=' + e.getAttribute('dir')); await p.screenshot({ path: 'evidence/zoho-w4r/W4-76-zoho-filled.png' }); }
  out.langSwitch = await p.locator('select, [class*=lang]').count();
  await ctx.close(); return out;
}
