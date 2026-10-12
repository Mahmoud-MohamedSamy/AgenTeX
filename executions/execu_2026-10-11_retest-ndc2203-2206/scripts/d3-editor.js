const off = capOn();
await go('/settings/automation/workflow-rules/new?moduleId=784400e1-4a2a-42c2-b4f3-7ca56e79828a', 9000);
const t1 = await txt();
await shot('x-editor-accounts');
off();
return done({ url: page.url(), t: t1.slice(t1.indexOf('Data Backup') > 0 ? t1.lastIndexOf('Integration') : 0, t1.length).slice(0, 4000), cap: cap.filter(c => !c.startsWith('GET /iam')) });
