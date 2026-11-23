const mods = L((await api('GET', '/modules')).j?.data); const acc = mods.find(m => m.moduleKey === 'desk_accounts');
if (!made.acc) { const ar = await api('POST', `/modules/${acc.id}/records`, { data: data({ account_name: 'QA FX Desk Acc', name: 'QA FX Desk Acc' }) }); log('acc', E(ar)); if (ar.j?.data?.id) { made.acc = ar.j.data.id; keep(); led('Desk account QA FX Desk Acc ' + made.acc); } }
const M = made.mod;
const F = [fdef('qa_text','QA Text','single_line'), fdef('qa_text2','QA Text2','single_line'), fdef('qa_multi','QA Multi','multi_line'), fdef('qa_email','QA Email','email'), fdef('qa_phone','QA Phone','phone'), fdef('qa_url','QA URL','url'), fdef('qa_rich','QA Rich','rich_text'),
 fdef('qa_num','QA Num','number'), fdef('qa_num2','QA Num2','number'), fdef('qa_zero','QA Zero','number'), fdef('qa_dec','QA Dec','decimal'), fdef('qa_cur','QA Cur','currency'), fdef('qa_pct','QA Pct','percent'), fdef('qa_long','QA Long','long_integer'),
 fdef('qa_auto','QA Auto','auto_number',{prefix:'FX-',start_number:1,padding:3,increment:1}), fdef('qa_check','QA Check','checkbox'), fdef('qa_pick','QA Pick','pick_list',{allowed_values:['Red','Green','Blue','3']}), fdef('qa_radio','QA Radio','radio_button',{allowed_values:['A','B']}),
 fdef('qa_status','QA Status','status',{allowed_values:['Open','Closed']}), fdef('qa_msel','QA MSel','multi_select',{allowed_values:['A','B','C']}), fdef('qa_date','QA Date','date'), fdef('qa_date2','QA Date2','date'), fdef('qa_dt','QA DT','date_time'),
 fdef('qa_account','QA Account','lookup',{target_module_id: acc.id, related_list_title:'QA FX'}), fdef('qa_user','QA User','user'),
 fdef('qa_items','QA Items','subform',{subfields:[{key:'qty',label:'Qty',datatype:'number'},{key:'price',label:'Price',datatype:'currency'},{key:'note',label:'Note',datatype:'single_line'}]})];
const have = L((await api('GET', `/modules/${M}/fields`)).j?.data).map(f => f.fieldName || f.apiName);
for (const f of F) { if (have.includes(f.fieldName)) continue; const r = await api('POST', `/modules/${M}/fields`, { fields: [f] }); log(f.fieldName, E(r)); }
const fl = L((await api('GET', `/modules/${M}/fields`)).j?.data); log('fields now', fl.length, fl.map(f => (f.fieldName||f.apiName) + ':' + f.datatypeKey).join(' '));
const lay = await api('GET', `/modules/${M}/layouts`); const ls = Array.isArray(lay.j?.data) ? lay.j.data : lay.j?.data?.layouts; made.layouts = ls.map(l => l.id); keep();
log('layouts', ls.map(l => [l.id, l.name])); fs.writeFileSync(RUN + '/out/layout0.json', JSON.stringify(ls, null, 1));
