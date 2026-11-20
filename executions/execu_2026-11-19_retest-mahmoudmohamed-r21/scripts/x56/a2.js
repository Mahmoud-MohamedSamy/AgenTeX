const o = {};
o.trs4869 = await trans('9ec8bdc5-2362-4386-a4cd-e5bee332d0c7'); o.trs5117 = await trans('5c68004d-860c-4bcd-b6b8-77e0bce5c044'); o.trs5118 = await trans('7bec7744-755c-48bc-932f-6d3d5ce2191f');
o.admin = E(await runT('9ec8bdc5-2362-4386-a4cd-e5bee332d0c7', 'admin', 'Open')); o.end = E(await runT('5c68004d-860c-4bcd-b6b8-77e0bce5c044', 'end', 'Escalated'));
await sleep(2000); o.after = [(await bstate('9ec8bdc5-2362-4386-a4cd-e5bee332d0c7'))?.activeStates, (await bstate('5c68004d-860c-4bcd-b6b8-77e0bce5c044'))?.activeStates];
const s = (await api('GET', `/modules/${TK}/records/7bec7744-755c-48bc-932f-6d3d5ce2191f/blueprint-state`)).j?.data; const x = L(s?.states)[0]; o.agentAll = [ (x?.allStates || []).length, (x?.allTransitions || []).length ];
return o;
