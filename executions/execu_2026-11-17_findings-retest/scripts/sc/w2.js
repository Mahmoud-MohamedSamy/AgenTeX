const o = { t0: new Date().toISOString() };
await updRec(I.G, { company: 'QA RT21 SC wf off' }); await sleep(8000); let v = await recVals(I.G); o.down = [v.score, v.title];
await updRec(I.G, { title: 'QA RT21 SC manual' }); await sleep(3000);
await updRec(I.G, { company: 'QA RT21 SC wf' }); o.upAt = new Date().toISOString(); await sleep(25000); v = await recVals(I.G); o.up_onSave = [v.score, v.title] + ' (title WF hit = workflow runs on save)';
return o;
