const mid = await modId(); const o = {};
const g = (await api('GET', '/modules/' + mid + '/blueprints/' + I.bp)).j.data; const def = g.definition;
for (const via of [process.env.VIA || 'form']) {
  def.transitions[0].during.requiredFields = [{ name: 'qa_vr_text', required: true, ...(via === 'none' ? {} : { via }), datatype: { key: 'single_line' } }];
  const u = await api('PUT', '/modules/' + mid + '/blueprints/' + I.bp + '/draft', { definition: def }); o.draft = SR(u).slice(0, 300);
  const p = await api('POST', '/modules/' + mid + '/blueprints/' + I.bp + '/publish', {}); o.publish = SR(p).slice(0, 300);
}
o.now = JSON.stringify((await api('GET', '/modules/' + mid + '/blueprints/' + I.bp)).j.data.definition.transitions[0].during.requiredFields);
return o;
