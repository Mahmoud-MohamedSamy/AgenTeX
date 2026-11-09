const out = {}; const id = '6945c9ff-db52-4a35-934f-0fc4ef0a0102', C = 'b690647a-27b1-45b2-bcc9-0c8c185e1e5a';
const e = arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data)[0]; out.meetingDispatch = JSON.stringify((e.dispatches || []).find(d => d.actionType === 'CreateMeeting')).slice(0, 900);
const g = (await api('GET', `/modules/${C}/records/9261a22c-e6a6-441b-aa30-c466bde31b44`)).j?.data?.data || []; out.connected = g.map(d => d.field + '=' + JSON.stringify(d.value?.value ?? d.value)).filter(x => /name|qa_parent/.test(x));
return done(out);
