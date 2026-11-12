const S = JSON.parse(fs.readFileSync('../a4/e2e134.json')); const TPL = S.made.tpl[0]; const R = {};
const mails = async id => arr((await api('GET', `/desk/tickets/${id}/replies`)).j?.data).filter(r => r.direction === 'outbound').map(r => (r.subject || '') + ' | ' + String(r.body_html || r.body_text || '').replace(/<[^>]+>/g, '').slice(0, 60) + ' | ' + r.status);
const setBody = async v => { const tg = (await api('GET', '/desk/email-templates/' + TPL)).j?.data; return (await api('PUT', '/desk/email-templates/' + TPL, { name: tg.name, module: tg.module, notification_type: tg.notification_type, use_case: tg.use_case, subject: tg.subject, body_html: '<p>QA AO WF E2E version ' + v + '</p>' })).s; };
const fire = async lbl => { const a = await mkTicket('E2E3a', {}, lbl); const b = await mkTicket('E2E3b', {}, lbl); await sleep(25000); return { a: await mails(a.id), b: await mails(b.id), ids: [a.id, b.id] }; };
R.setOne = await setBody('ONE'); await sleep(3000); R.before = await fire('before edit');
R.editToTwo = await setBody('TWO'); await sleep(3000); R.after = await fire('after edit');
S.e3c = R; fs.writeFileSync('../a4/e2e134.json', JSON.stringify(S, null, 1)); log(JSON.stringify(R, null, 1));
