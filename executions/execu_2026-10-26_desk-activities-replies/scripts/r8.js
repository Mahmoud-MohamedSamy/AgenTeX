const tk = '60e81b1b-e8ae-4a5d-aad9-70b69d9624b9';
const rp = await api('GET', `/desk/tickets/${tk}/replies`);
const rows = (rp.j.data || []).map(r => ({ t: (r.body_text || r.body_html || '').replace(/<[^>]+>/g, '').slice(0, 30), mode: r.mode, pub: r.is_public, to: r.to, cc: r.cc, st: r.status, by: r.from_user_id ? r.from_user_id.slice(0, 8) : null, appr: r.approved_by || r.reviewed_by || null }));
const f3 = await page.evaluate(() => 1);
const raw = await page.context().request.fetch('about:blank').catch(() => null);
return JSON.stringify(rows);
