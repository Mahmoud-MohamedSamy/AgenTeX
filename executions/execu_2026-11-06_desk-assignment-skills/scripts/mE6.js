eval(require('fs').readFileSync('lib.js','utf8'));
const o={};const g=(await api('GET','/web-forms/'+IDS.WF_D14)).j.data;o.defErr=JSON.stringify(g.definition_errors).slice(0,800);o.enabled=g.is_enabled;o.channel=g.channel_enabled;
const L=(await api('GET','/web-forms/layouts?module_id='+T)).j.data;const lay=L.find(x=>x.id===g.layout_id);
o.layoutReq=lay.fields.filter(f=>f.required||f.mandatory).map(f=>f.key+(f.not_offered?'(not offered:'+f.not_offered.type+')':''));
o.layouts=L.map(x=>x.name+':'+x.id.slice(0,8)+':req='+x.fields.filter(f=>f.required||f.mandatory).length);
const ex=(await api('GET','/web-forms')).j.data.find(f=>f.name==='test');o.testDefErr=JSON.stringify(ex.definition_errors).slice(0,300);o.testLayout=ex.layout_id.slice(0,8);
o.subs=JSON.stringify((await api('GET','/web-forms/'+IDS.WF_D14+'/submissions?limit=5')).j).slice(0,600);
return o;
