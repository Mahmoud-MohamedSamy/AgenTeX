await page.goto(HC + 'community/topic/' + encodeURIComponent('qa-gl-w4-٠١-يبرع-عوضوم-ha8d9y'), { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(7000);
out.url = decodeURIComponent(page.url().replace(HC, '~/'));
out.h1 = await page.locator('h1').first().innerText().catch(() => '?');
out.bodyDir = await page.getByText('موضوع عربي').first().evaluate(e => getComputedStyle(e).direction + ' / text-align ' + getComputedStyle(e).textAlign + ' / dir ' + (e.closest('[dir]') || {}).getAttribute?.call(e.closest('[dir]'), 'dir')).catch(e => 'not found');
await shot('w4/W4-59-arabic-topic-portal');
