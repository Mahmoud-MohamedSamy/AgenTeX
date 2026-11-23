eval(fs.readFileSync('cr/lib.js','utf8'));const o={t:{}};const rid=JSON.parse(fs.readFileSync(OUTD+'t1-rules.json','utf8'));const CT='349fc131-bdf7-44a3-94b2-78f01eb8d32e';
const start=new Date().toISOString();o.start=start;
const plan=[['contact','3052 contact','no contact 1',{}],['contact','3052 contact','with contact 1',{contact_id:CT}],['contact','3052 contact','no contact 2',{}],['contact','3052 contact','with contact 2',{contact_id:CT}],
['custom','3052 custom','pnr empty',{}],['custom','3052 custom','pnr set',{qa_ndc_tkt_pnr_no:'QA RT20 CR PNR 3052'}],
['sysTicket','3052 sysfill','no dept no layout',{}],['sysStatus','3052 sysstatus','status placeholder empty',{}],
['conn','3052 conn','no contact',{}],['conn','3052 conn','with contact',{contact_id:CT}],
['saved','3052 saved','pre-fix saved action',{}]];
for(const [k,tag,sfx,v] of plan){const t=await mkTicket(tag,v,sfx);o.t[tag+' | '+sfx]={rule:rid[k],...t};await sleep(1500);}
fs.writeFileSync(OUTD+'t3-tickets.json',JSON.stringify(o));return o;
