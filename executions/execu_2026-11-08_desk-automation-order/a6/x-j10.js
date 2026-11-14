const a = await mkT('JU', 'j10 a'); const b = await mkT('JU', 'j10 b'); const c = await mkT('JU', 'j10 c'); await waitIn(a); await waitIn(b); await waitIn(c);
const big = '<p>' + 'x'.repeat(3 * 1024 * 1024) + '</p>';
const r1 = await runT(a, 'verify', 'Open', { fields: { description: 'QA' }, comment: { content: big, body_html: big } }); log('big comment', E(r1), JSON.stringify((await bstate(a))?.activeStates));
const r2 = await runT(b, 'verify', 'Open', { fields: { description: 'QA' }, comment: { content: 'QA', body_html: '<p>QA</p>' }, attachment_ids: [crypto.randomUUID()] }); log('bad attachment', E(r2), JSON.stringify((await bstate(b))?.activeStates));
const r3 = await runT(c, 'verify', 'Open', { fields: { description: 'QA' }, comment: { content: 'QA', body_html: '<p>' + '<img src="data:image/png;base64,' + 'A'.repeat(20 * 1024 * 1024) + '">' + '</p>' } }); log('20MB inline', E(r3), JSON.stringify((await bstate(c))?.activeStates));
