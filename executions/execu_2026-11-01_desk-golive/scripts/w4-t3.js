await go('/settings/organization/email-templates/new', 10000);
const opts = await page.locator('main select').evaluateAll(ss => ss.map(s => Array.from(s.options).map(o => (o.parentElement.tagName === 'OPTGROUP' ? o.parentElement.label + ': ' : '') + o.value)));
const big = opts.sort((a, b) => b.length - a.length)[0];
return fin({ n: big.length, other: big.filter(x => !/ticket\.field\./.test(x)) });
