const mid = await modId(); const lid = I.layout; const PF = 'qa_lr_filter';
const body = { name: P + ' crm actions', layoutId: lid, primaryField: PF, description: 'qa', branches: [
  br(eq(PF, 'X'), [{ type: 'filter_options', field: 'qa_lr_tier', options: ['Gold', 'Silver'] }, { type: 'read_only_fields', fields: ['qa_lr_text'] }, { type: 'set_value', field: 'qa_lr_note', value: 'QA set' }, { type: 'recommend_value', field: 'qa_lr_amount', value: 42 }, { type: 'show_message', field: 'qa_lr_email2', message: { en: 'QA warn msg', ar: 'رسالة تحذير' }, tone: 'warning' }, { type: 'verify_fields', fields: ['qa_lr_email2', 'qa_lr_date'] }]),
  br(eq(PF, 'Y'), [{ type: 'show_message', field: null, message: { en: 'QA top info' }, tone: 'info' }, { type: 'filter_options', field: 'qa_lr_tags', options: ['A'] }])] };
let r; if (I.rF) { const g = (await getRule(mid, I.rF)).j.data; r = await putRule(mid, I.rF, { ...g, ...body }); } else { r = await mkRule(mid, body); I.rF = r.j?.data?.id; SAVE(); }
log('rF', SR(r));
// F15 / F16 conflicts, F12 unique target
const c = {};
const t = async (k, acts) => { const x = await mkRule(mid, { name: P + ' conf ' + k, layoutId: lid, primaryField: PF, status: 'disabled', branches: [br(eq(PF, 'Z'), acts)] }); c[k] = SR(x).slice(0, 220); if (x.s < 300) await delRule(mid, x.j.data.id); };
await t('F15 set+suggest same field', [{ type: 'set_value', field: 'qa_lr_note', value: 'a' }, { type: 'recommend_value', field: 'qa_lr_note', value: 'b' }]);
await t('F16 mandatory+readonly same field', [req(['qa_lr_note']), { type: 'read_only_fields', fields: ['qa_lr_note'] }]);
await t('F2 keep zero options', [{ type: 'filter_options', field: 'qa_lr_tier', options: [] }]);
await t('F2 option not in field', [{ type: 'filter_options', field: 'qa_lr_tier', options: ['Nope'] }]);
await t('F12 set value wrong type number', [{ type: 'set_value', field: 'qa_lr_amount', value: 'abc' }]);
await t('F19 message empty', [{ type: 'show_message', field: null, message: { en: '', ar: '' }, tone: 'info' }]);
await t('E8 primary as own target', [req([PF])]);
await t('E9 mandatory on auto number', [req(['lead_number'])]);
await t('F12 set on unique field (email)', [{ type: 'set_value', field: 'email', value: 'x@example.com' }]);
return c;
