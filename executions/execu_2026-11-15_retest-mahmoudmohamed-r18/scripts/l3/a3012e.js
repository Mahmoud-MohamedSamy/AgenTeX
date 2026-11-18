const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const I=JSON.parse(fs.readFileSync('l3/ids.json','utf8')); const o={};
const v=async()=>{const d=(await api('GET','/modules/'+T+'/records/'+I.T12)).j.data.data; const g=f=>((d.find(x=>x.field===f)||{}).value||{}).value; return {subject:g('subject'),status:g('status')};};
o.afterUIRefusal=await v();
const bad=await api('POST','/desk/tickets/'+I.T12+'/blueprint-transitions/t_qa_1',{expected_state_id:'Open',fields:{subject:'QA RT18 BAD-api'},checklist:{},reply:null,comment:null,attachment_ids:[],resolution:null,run_id:globalThis.crypto.randomUUID()}); o.apiBad=bad.s+' '+bad.t.slice(0,250); o.afterApiBad=await v();
const good=await api('POST','/desk/tickets/'+I.T12+'/blueprint-transitions/t_qa_1',{expected_state_id:'Open',fields:{subject:'QA RT18 3012 ticket ok'},checklist:{},reply:null,comment:null,attachment_ids:[],resolution:null,run_id:globalThis.crypto.randomUUID()}); o.apiGood=good.s+' '+(good.s>=300?good.t.slice(0,250):''); o.afterGood=await v();
return o;
