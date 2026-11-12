const mid = await modId(); const r = (await rules(mid, '?layoutId=' + I.layout)).find(r => r.name === P + ' I1 dbl'); return { desc: r.description, rv: r.rowVersion };
