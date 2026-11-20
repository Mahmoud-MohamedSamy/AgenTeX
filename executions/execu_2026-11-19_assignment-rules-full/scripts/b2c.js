const today = new Date().toISOString().slice(0, 10);
const r = await api('POST', '/desk/holiday-lists', { name: 'QA AR HOL today', description: null, is_active: true, category: 'year_specific', business_hour_profile_id: null, detached: true, holidays: [{ name: 'QA AR today', start_date: today, end_date: null, occurrence: 'year_specific' }] });
const id = r.j && r.j.data && (r.j.data.id || (r.j.data.list && r.j.data.list.id)); if (id) LED('holiday list "QA AR HOL today" ' + id + ' (detached)');
return { s: r.s, e: E(r), d: r.t.slice(0, 300) };
