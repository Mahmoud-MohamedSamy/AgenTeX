// Probe raw values: address value kind, blueprint notification, task fields.
const out = {};
const an = 'qa_rt18_address';
const t = await mkT('PAD' + uid(), 'addr');
const pe = await setF(t, { [an]: { street: 'QA 1', city: 'Giza', state: 'Giza', zip: '12611', country: 'Egypt' } });
const raw = (await rec(t))?.data?.find(x => x.field === an);
out.addrEdit = E(pe); out.addrRaw = JS(raw).slice(0, 300);
// enc for objects? try kind object
const pe2 = await api('PATCH', `/modules/${T}/records/${t}`, { data: [{ field: an, value: { kind: 'address', street: 'QA 2', city: 'Cairo', zip: '1', country: 'Egypt' } }] });
out.addrEdit2 = E(pe2); out.addrRaw2 = JS((await rec(t))?.data?.find(x => x.field === an)).slice(0, 300);
// recent bells of A
const bA = await bells(A); out.bellsA = bA.slice(0, 6).map(b => (b.title || '') + ' | ' + (b.body || b.message || '').slice(0, 60) + ' | ' + (b.created_at || ''));
// recent desk tasks
const mods = await modules(); const TASKS = (mods.find(m => (m.key || m.moduleKey || m.api_name) === 'desk_tasks') || {}).id; out.tasksModule = TASKS;
const tr = await api('GET', `/modules/${TASKS}/records?page_size=20&sort=-created_at`);
out.taskSample = arr(tr.j?.data).slice(0, 3).map(x => JS(Object.fromEntries((x.data || []).map(y => [y.field, y.value]))).slice(0, 400));
await cleanup();
return out;
