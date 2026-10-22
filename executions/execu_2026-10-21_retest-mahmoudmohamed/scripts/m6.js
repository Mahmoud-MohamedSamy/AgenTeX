const m = arr((await api('GET', '/modules?page=1&page_size=200')).j.data).filter(x => /qa_rt|QA RT/i.test(JSON.stringify(x).slice(0, 500)));
return done({ m: m.map(x => JSON.stringify(x).slice(0, 400)), dlg: await page.locator('[role=dialog]').allInnerTexts() });
