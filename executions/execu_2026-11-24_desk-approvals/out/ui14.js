await go('/approvals?list=decided'); await sleep(5000);
const t = await page.locator('[data-testid="approvals-page"]').innerText().catch(() => '');
await shot('ui14-B-tz-dubai');
return { rows: (t.match(/QA PA N manual request[\s\S]{0,200}/) || [''])[0].slice(0, 200), times: (t.match(/[٠-٩0-9]{1,2}:[٠-٩0-9]{2}\s?[صمAPM]*/g) || []).slice(0, 5) };
