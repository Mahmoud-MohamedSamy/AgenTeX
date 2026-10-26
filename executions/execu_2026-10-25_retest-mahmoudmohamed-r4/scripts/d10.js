const ID = '01727195-e2d5-41c5-821b-a30d5a965976', LID = 'd4540d27-5861-4c6c-adf8-7433a717348b';
const s = v => ({ kind: 'string', value: v });
const r = await api('POST', `/modules/${ID}/records`, { layout_id: LID, data: [{ field: 'name', value: s('QA RT upload api') }, { field: 'qa_rt_file', value: { kind: 'object', properties: { url: s('x'), mime: s('text/plain'), filename: s('qa-rt.txt'), size: { kind: 'number', value: 22 } } } }] });
const r2 = await api('POST', `/modules/${ID}/records`, { layout_id: LID, data: [{ field: 'name', value: s('QA RT upload api big') }, { field: 'qa_rt_file', value: { kind: 'object', properties: { url: s('x'), mime: s('application/pdf'), filename: s('big.pdf'), size_bytes: { kind: 'number', value: 2306901 } } } }] });

return done({ wrongType: r.s + ' ' + (r.j?.error?.details?.[0]?.message || r.j?.error?.message || r.j?.data?.id), tooBig: r2.s + ' ' + (r2.j?.error?.details?.[0]?.message || r2.j?.error?.message || r2.j?.data?.id) });
