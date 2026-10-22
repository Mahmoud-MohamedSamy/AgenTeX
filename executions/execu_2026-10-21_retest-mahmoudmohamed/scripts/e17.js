const ls = await page.evaluate(() => Object.keys(localStorage).map(k => k + '=' + String(localStorage.getItem(k)).slice(0, 120)));
const ss = await page.evaluate(() => Object.keys(sessionStorage).map(k => k + '=' + String(sessionStorage.getItem(k)).slice(0, 120)));
return done({ ls: ls.filter(x => !/token|auth|jwt/i.test(x)), ss: ss.filter(x => !/token|auth|jwt/i.test(x)) });
