await sleep(30000); const P = '/desk/tickets/' + TK.R1; out.r = [];
for (const [mode, to] of [['forward', 'mmohamed@anyware.software'], ['forward', 'mmohamed@anyware.software'], ['forward', 'qa-ac2-ext@example.com'], ['reply', 'qa-ac2-c@example.com']]) out.r.push(mode + ' ' + to.split('@')[1] + ' ' + await prr('POST', P + '/replies', { mode, to: [to], cc: [], bcc: [], subject: 'Fwd: QA AC2 R1', body_html: '<p>QA AC2 restricted ' + mode + ' test (please ignore)</p>' }));
out.comment = await prr('POST', P + '/comments', { body_html: '<p>QA AC2 restricted comment</p>', is_private: true });
return fin({ out });
