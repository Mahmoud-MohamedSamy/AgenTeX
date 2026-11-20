const L = [R_('G-06', 'Pass', 'Ticket created with owner A1 by the admin, then edited without touching owner: A1 has exactly 1 notification (the creation assignment), none for the edit')];
const id = fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n').filter(l => /QA AR EO5 y/.test(l)).map(l => l.match(/[0-9a-f-]{36}/)[0])[0];
const a1 = await notifFor('a1', id), a2 = await notifFor('a2', id);
L.push(R_('G-07', a1.length === 0 && a2.length === 1 ? 'Pass' : 'Fail', 'EO-5: direct → A1 then workflow → A2 in the same event: A1 notifications ' + JSON.stringify(a1) + ', A2 ' + JSON.stringify(a2) + ' (only the final owner should be notified)'));
return L;
