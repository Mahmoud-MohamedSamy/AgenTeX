const L=await modId('leads');
await delAllQA();
// one rule per check, isolated: create rule, create records, score, delete rule
const T=async(id,entries,cases,note='')=>{const r=await mkRule(L,{name:P+'D '+id+' '+Math.random().toString(36).slice(2,6),entries}); const rid=keepRule(r);
 if(!rid){RES(id,'fail','rule refused '+SR(r)+' '+note);return;}
 const bad=[],seen=[]; for(const [vals,exp] of cases){const rec=await newRec(L,vals); const s=await recScore(L,rec); seen.push(JSON.stringify(vals).slice(0,60)+'=>'+s); if((s||0)!==exp) bad.push(JSON.stringify(vals)+' got '+s+' want '+exp);}
 await api('DELETE','/scoring-rules/'+rid); RES(id,bad.length?'fail':'pass',(bad.length?'WRONG: '+bad.join('; ')+' | ':'')+seen.join(' ; ')+' '+note);};
await T('D1',[ent('company','eq','Acme',1),ent('title','neq','CEO',10)],[[{company:'Acme',title:'CEO'},1],[{company:'acme',title:'CTO'},10],[{company:'Acmex'},10]],'(is case: "acme" vs "Acme" — see value)');
await T('D2',[ent('company','contains','soft',1),ent('company','notContains','bad',10),ent('title','startsWith','Head',100),ent('title','endsWith','Ops',1000)],[[{company:'Microsoft',title:'Head of Ops'},1111],[{company:'badco',title:'Ops Head'},0],[{company:'SOFTCO',title:'head ops'},0]],'(uppercase SOFTCO/head shows case rule)');
await T('D3',[ent('email','contains','@qa.test',1),ent('phone','startsWith','+20',10),ent('website','contains','qa',100)],[[{email:'a@qa.test',phone:'+201000',website:'https://qa.example'},111],[{email:'a@x.com'},10]],'(notContains on empty field counts? row2 expects 10?)');
await T('D4',[ent('company','isNull',undefined,1),ent('title','isNotNull',undefined,10)],[[{},1],[{company:'X',title:'Y'},10]]);
await T('D5',[ent('no_of_employees','eq',10,1),ent('no_of_employees','neq',10,2),ent('no_of_employees','gt',10,4),ent('no_of_employees','gte',10,8),ent('no_of_employees','lt',10,16),ent('no_of_employees','lte',10,32)],[[{no_of_employees:9},2+16+32],[{no_of_employees:10},1+8+32],[{no_of_employees:11},2+4+8]]);
await T('D6',[ent('annual_revenue','gt',99.5,1),ent('decimal','gte',1.25,10)],[[{annual_revenue:99.5,decimal:1.25},10],[{annual_revenue:99.51,decimal:1.24},1]]);
let r=await mkRule(L,{name:P+'D7',entries:[ent('no_of_employees','gt','ten',1)]}); keepRule(r); RES('D7',r.s>=400?'pass':'fail','number value "ten" '+SR(r));
await T('D8',[ent('date','eq','2026-11-12',1),ent('date','gt','2026-11-12',10),ent('date','lt','2026-11-12',100)],[[{date:'2026-11-11'},100],[{date:'2026-11-12'},1],[{date:'2026-11-13'},10]]);
await T('D9',[ent('date_time','gt','2026-11-12T10:00:00.000Z',1)],[[{date_time:'2026-11-12T09:59:00.000Z'},0],[{date_time:'2026-11-12T10:01:00.000Z'},1]],'(UTC values via API; zone shown in UI checked separately)');
await T('D10',[ent('lead_source','eq','web',1),ent('lead_source','neq','web',10)],[[{lead_source:'web'},1],[{lead_source:'chat'},10],[{},10]],'(is not on empty field)');
await T('D11',[ent('lead_source','in',['web','chat'],1),ent('lead_source','notIn',['web','chat'],10)],[[{lead_source:'chat'},1],[{lead_source:'other'},10]]);
r=await mkRule(L,{name:P+'D12',entries:[ent('lead_source','eq','NoSuchValue',1)]}); keepRule(r); RES('D12',r.s>=400?'pass':'fail','pick list value not in list '+SR(r));
await T('D13',[ent('multi_select','in',['option 1'],1),ent('multi_select','notIn',['option 3'],10),ent('multi_select','containsAll',['option 1','option 2'],100)],[[{multi_select:['option 1']},11],[{multi_select:['option 1','option 2']},111],[{multi_select:['option 3']},0]]);
await T('D14',[ent('email_opt_out','eq',true,1),ent('email_opt_out','neq',true,10)],[[{email_opt_out:true},1],[{email_opt_out:false},10]]);
await T('D16',[ent('radio_button','eq','option 2',1),ent('lead_status','eq','Interested',10)],[[{radio_button:'option 2',lead_status:'Interested'},11],[{radio_button:'option 1'},0]]);
r=await mkRule(L,{name:P+'D17a',entries:[ent('no_of_employees','contains','1',1)]}); keepRule(r); let r2=await mkRule(L,{name:P+'D17b',entries:[ent('lead_source','gt','web',1)]}); keepRule(r2);
RES('D17',(r.s>=400&&r2.s>=400)?'pass':'fail','contains on number '+SR(r)+' | gt on pick list '+SR(r2));
r=await mkRule(L,{name:P+'D18',entries:[ent('no_of_employees','between',[1,5],1)]}); keepRule(r); RES('D18',r.s>=400?'pass':'fail','operator between '+SR(r));
// D15 lookup/user only empty/not empty
r=await mkRule(L,{name:P+'D15a',entries:[ent('user','eq','x',1)]}); keepRule(r); r2=await mkRule(L,{name:P+'D15b',entries:[ent('user','isNotNull',undefined,1)]}); const d15=keepRule(r2);
RES('D15',(r.s>=400&&r2.s<300)?'pass':'fail','user field eq '+SR(r)+' | isNotNull '+SR(r2)+' (runtime match not checked: needs a user value)');
J3: { await T('J3',[ent('company','contains','القاهرة',1)],[[{company:'شركة القاهرة'},1],[{company:'Alex'},0]]); }
await delAllQA(); SAVE();
