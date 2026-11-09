const r = await call('GET', `/modules/${MODS.tasks}/records?page=1&per_page=50&sort_by=created_at&sort_dir=desc`);
const out = [];
for (const x of (r.j.data || [])) { const v = k => { const f = x.data.find(e => e.field === k); return f && f.value && f.value.value; }; if (/QA W4/.test(String(v('subject')))) out.push({ id: x.id, subject: v('subject'), due: v('due_date'), rem: v('reminder_offset_minutes'), created: x.created_at }); }
return { out, dialog: await page.locator('[role=dialog]').count() };
