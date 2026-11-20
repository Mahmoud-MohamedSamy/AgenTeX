eval(fs.readFileSync('wf/lib.js','utf8'));
const t73=JSON.parse(fs.readFileSync(OUTD+'2973-ids.json')).T;
const tickets={rj:'74dfc213-eca9-45d8-9698-e4b3d8c404d8',rc:'8e7c1479-31ae-4178-96ff-dee01f4e99db',ord:'5791b1bb-0c60-4298-8a2f-c42106303e68',b2997:'b412b3b0-326f-4320-8c9e-efeb0101f92c',s73in:t73.b2,s73out:t73.a2,a73:t73.a1,c73:t73.b1,h66off:'fc5b7921-2562-4a4a-8a7a-bfa5bfb945e1',h66scope:'27a734c6-e952-439e-96c4-97edb62638e6',c68:'363d64fa-7c41-4988-843f-2838369f3d67',c68e:'86f39d20-83e5-4c14-a391-09c8a2dd581f'};
// latest 2997 online tickets
const L=arr((await api('GET',`/modules/${T}/records?take=20&search=${encodeURIComponent('QA RT19 WF 2997 on')}`)).j?.data);tickets.on2997=L.map(x=>x.id);
const o={};for(const [k,v] of Object.entries(tickets)){const ids=Array.isArray(v)?v:[v];o[k]=[];for(const id of ids){const ex=await execsRaw(id);const g=await getTicket(id);o[k].push({id,num:g._number||g.ticket_number,exec:ex.filter(e=>/RT19/.test(e.ruleName||'')||true).map(e=>e.id)});}}
save('exec-ids',o);return o;
