// 7 Nov B-08 holiday runtime: two detached QA holiday lists, direct rule with on/not_on holiday targets
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const o={};
const mkList=async(name,day,hname)=>{const r=await api('POST','/desk/holiday-lists',{name,description:null,is_active:true,category:'year_specific',business_hour_profile_id:null,detached:true,holidays:[{name:hname,start_date:day,end_date:null,occurrence:'year_specific'}]});const id=r.j&&r.j.data&&(r.j.data.id||(r.j.data.list&&r.j.data.list.id));if(id)LED('holiday list "'+name+'" '+id+' (detached, B-08 holiday)');return{s:r.s,id,e:E(r),d:r.t.slice(0,400)};};
const L1=await mkList('QA AS6 HOL today','2026-11-07','QA AS6 today');const L2=await mkList('QA AS6 HOL xmas','2026-12-25','QA AS6 xmas');
o.L1=L1;o.L2=L2;IDS.HOL1=L1.id;IDS.HOL2=L2.id;saveIds();
const f=await api('GET','/desk/assignment-rules/criteria-fields');const fx=JSON.stringify(f.j);const i=fx.indexOf('"on_holiday"');o.holOptions=fx.slice(i,i+700);
const bh=await api('GET','/desk/business-hours');o.bh={open:bh.j.data.is_open_now,today:bh.j.data.todays_holidays,lists:(bh.j.data.holiday_lists||[]).map(x=>x.name||x.id)};
if(L1.id&&L2.id){
 const tg=(sub,op,val,who)=>({criteria:{conditions:[{field_key:'subject',operator:'contains',value:sub},{field_key:'execution_time',operator:op,value:val}],pattern:'1 and 2'},coming_to_department_id:IDS.DA,move_to_department_id:null,assign:AG(who)});
 const r=await mkRule({type:'direct',name:'QA AS6 B08 holiday',description:'QA',is_active:true,execute_on:['create'],targets:[tg('QA AS6 HOL t1','on_holiday',L1.id,IDS.A1),tg('QA AS6 HOL t2','not_on_holiday',L1.id,IDS.A2),tg('QA AS6 HOL t3','on_holiday',L2.id,IDS.A3),tg('QA AS6 HOL t4','not_on_holiday',L2.id,IDS.A3)]},'B-08 holiday');
 o.rule={s:r.s,e:r.e,id:r.id};IDS.DA_B08H=r.id;saveIds();
 if(r.id){const exp={t1:'A1 (today is in list)',t2:'- (today is in list)',t3:'- (25 Dec only)',t4:'A3 (25 Dec only)'};o.res={};
  for(const k of ['t1','t2','t3','t4']){const t=await mkTicket('QA AS6 HOL '+k,IDS.DA,{},'B-08 holiday');await sleep(3500);const a=(await act(t.id))||[];const x=(Array.isArray(a)?a:[]).filter(e=>/assign/.test(e.action)).map(e=>e.action+' '+(e.summary&&(e.summary.rule_name||e.summary.rule_type)||''));o.res[k]={owner:nm((await own(t.id)).owner),expected:exp[k],hist:x,id:t.id};}
  // stored rule criteria readback
  const g=await getRule(r.id);o.readback=g&&g.targets.map(t=>t.criteria.conditions[1]);
 }}
return o;
