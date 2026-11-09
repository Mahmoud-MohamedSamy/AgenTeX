const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', Q = '212d0ec2-9ca9-4f39-b524-30275f5fd713'; const s = v => ({ kind: 'string', value: v });
const imp = '96061733-d364-4de9-b6d9-f400dd6311fe';
const lay = (await api('GET', `/modules/${L}/records/${imp}`)).j?.data; const impLayout = lay?.layout_id || lay?.layoutId;
const c = await api('POST', `/modules/${L}/records`, { layout_id: Q, data: [{ field: 'first_name', value: s('QA RT 2302 tavi manual') }, { field: 'phone', value: s('01012342303') }, { field: 'lead_source', value: s('chat') }] });
const id = c.j?.data?.id; await sleep(5000);
const bs = id ? await api('GET', `/modules/${L}/records/${id}/blueprint-state`) : null;
return done({ importedLeadLayout: impLayout, manual: c.s + ' ' + (id || c.t.slice(0, 200)), manualBlueprintState: bs && (bs.s + ' ' + bs.t.slice(0, 300)) });
