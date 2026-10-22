// Desk retest setup: module QA RT MF with the validation fields placed on its default layout.
const m = await mkModule('qa_rt_mf', 'QA RT MF');
const MID = m.id;
const lid = await initLayout(MID);
const defs = [
  { fieldName: 'qa_sl10', datatypeKey: 'single_line', datatypeOptions: { max_length: 10 } },
  { fieldName: 'qa_num', datatypeKey: 'number', datatypeOptions: { min: 0, max: 100 } },
  { fieldName: 'qa_email', datatypeKey: 'email' },
  { fieldName: 'qa_phone', datatypeKey: 'phone' },
  { fieldName: 'qa_url', datatypeKey: 'url' },
  { fieldName: 'qa_pl', datatypeKey: 'pick_list', datatypeOptions: { allowed_values: ['Alpha', 'Beta', 'Gamma'] } },
  { fieldName: 'qa_rx', datatypeKey: 'single_line' },
  { fieldName: 'qa_rb', datatypeKey: 'radio_button', datatypeOptions: { allowed_values: ['R1', 'R2'] } },
  { fieldName: 'qa_st', datatypeKey: 'status', datatypeOptions: { allowed_values: ['New', 'Doing', 'Done'] } },
  { fieldName: 'qa_date', datatypeKey: 'date' },
  { fieldName: 'qa_dt', datatypeKey: 'date_time' },
  { fieldName: 'qa_ms', datatypeKey: 'multi_select', datatypeOptions: { allowed_values: ['A', 'B', 'C'], max_items: 2 } },
];
const add = await addFields(MID, defs);
const pl = await placeOnLayout(MID, lid, ['name', ...defs.map(d => d.fieldName)], { qa_rx: { regex: '^[A-Z]{2}[0-9]{4}$' } });
const F = (await fieldsOf(MID)).map(f => f.fieldName + ':' + f.datatypeKey + ' ' + JSON.stringify(f.datatypeOptions || {}).slice(0, 80) + (f.config && f.config.required ? ' REQUIRED' : ''));
return done({ MID, lid, add: add.s + ' ' + (add.t || '').slice(0, 300), place: pl.s + ' ' + (pl.t || '').slice(0, 200), F });
