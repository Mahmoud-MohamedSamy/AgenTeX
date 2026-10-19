// NDC-1819: count due_date formats among the owner's tasks.
const T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065'; const ME = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const v = (r, f) => ((r.data || []).find(x => x.field === f) || { value: {} }).value.value;
let all = []; for (let p = 1; p <= 3; p++) { const r = await api('GET', '/modules/' + T + '/records?page=' + p + '&per_page=100'); all = all.concat(arr(r.j && r.j.data)); if (arr(r.j && r.j.data).length < 100) break; }
const mine = all.filter(r => v(r, 'owner') === ME);
const iso = mine.filter(r => /^\d{4}-\d\d-\d\d/.test(v(r, 'due_date') || '')); const txtd = mine.filter(r => (v(r, 'due_date') || '') && !/^\d{4}-/.test(v(r, 'due_date')));
const isoOpenPast = iso.filter(r => v(r, 'status') !== 'Completed' && v(r, 'due_date').slice(0, 10) < '2026-10-19');
return done({ mine: mine.length, iso: iso.length, text: txtd.length, textSources: [...new Set(txtd.map(r => r.source))], textOpen: txtd.filter(r => v(r, 'status') !== 'Completed').length, textCompleted: txtd.filter(r => v(r, 'status') === 'Completed').length, isoOpenPast: isoOpenPast.map(r => v(r, 'subject') + '|' + v(r, 'status') + '|' + v(r, 'due_date')) });
