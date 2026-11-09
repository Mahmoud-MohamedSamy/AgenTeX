// NDC-2814 retest 8 Nov: "Execution Time on a holiday of <list>" with lists NOT linked to business hours (detached).
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const o={};
const mkList=async(name,day,hname)=>{const r=await api('POST','/desk/holiday-lists',{name,description:'QA retest NDC-2814 8 Nov - safe to delete',is_active:true,category:'year_specific',business_hour_profile_id:null,detached:true,holidays:[{name:hname,start_date:day,end_date:null,occurrence:'year_specific'}]});const id=r.j&&r.j.data&&(r.j.data.id||(r.j.data.list&&r.j.data.list.id));if(id){LED('holiday list "'+name+'" '+id+' (detached) NDC-2814');NEW[name]=id;}return{s:r.s,id,e:E(r)};};
const bh0=await api('GET','/desk/business-hours');o.bhBefore={open:bh0.j?.data?.is_open_now,today:bh0.j?.data?.todays_holidays,tz:bh0.j?.data?.time_zone||bh0.j?.data?.timezone,now:new Date().toISOString()};
const LL=arr((await api('GET','/desk/holiday-lists')).j?.data);const byN=n=>{const x=LL.find(y=>y.name===n);return x?{s:'existing',id:x.id}:null;};const L1=byN('QA RT14 HOL today')||await mkList('QA RT14 HOL today','2026-11-08','QA RT14 today');const L2=byN('QA RT14 HOL xmas')||await mkList('QA RT14 HOL xmas','2026-12-25','QA RT14 xmas');const L3=byN('QA RT14 HOL yesterday')||await mkList('QA RT14 HOL yesterday','2026-11-07','QA RT14 yesterday');NEW.HOL_TODAY=L1.id;NEW.HOL_XMAS=L2.id;NEW.HOL_YDAY=L3.id;
o.lists={L1:L1.s+' '+(L1.e||''),L2:L2.s,L3:L3.s};
const rl=await api('GET','/desk/holiday-lists');o.listRead=arr(rl.j?.data).filter(x=>/QA RT14/.test(x.name)).map(x=>x.name+' detached='+x.detached+' bh='+x.business_hour_profile_id);
const bh1=await api('GET','/desk/business-hours');o.bhAfter={open:bh1.j?.data?.is_open_now,today:bh1.j?.data?.todays_holidays};
const tg=(sub,op,val,who)=>({criteria:{conditions:[{field_key:'subject',operator:'contains',value:sub},{field_key:'execution_time',operator:op,value:val}],pattern:'1 and 2'},coming_to_department_id:IDS.DA,move_to_department_id:null,assign:AG(who)});
const r=await mkRule({type:'direct',name:'QA RT14 2814 holiday',description:'QA retest NDC-2814 8 Nov - safe to delete',is_active:true,execute_on:['create'],
 targets:[tg('QA RT14 HOL t1','on_holiday',L1.id,IDS.A1),tg('QA RT14 HOL t2','not_on_holiday',L1.id,IDS.A2),tg('QA RT14 HOL t3','on_holiday',L2.id,IDS.A3),tg('QA RT14 HOL t4','not_on_holiday',L2.id,IDS.A3)]},'NDC-2814');
const r2=await mkRule({type:'direct',name:'QA RT14 2814 holiday b',description:'QA retest NDC-2814 8 Nov - safe to delete',is_active:true,execute_on:['create'],targets:[tg('QA RT14 HOL t5','on_holiday',L3.id,IDS.A1),tg('QA RT14 HOL t6','not_on_holiday',L3.id,IDS.A2)]},'NDC-2814');o.rule2={s:r2.s,e:r2.e,id:r2.id};NEW.R2814b=r2.id;
o.rule={s:r.s,e:r.e,id:r.id};NEW.R2814=r.id;
const exp={t1:'A1 — today is in the detached list',t2:'unassigned/creator — today is a holiday',t3:'no match — 25 Dec only',t4:'A3 — today is not 25 Dec',t5:'no match — 7 Nov only',t6:'A2 — today is not 7 Nov'};o.res={};
if(r.id){for(const k of Object.keys(exp)){const t=await mkTicket('QA RT14 HOL '+k,IDS.DA,{},'NDC-2814');await sleep(3500);const a=(await act(t.id))||[];
  const x=(Array.isArray(a)?a:[]).filter(e=>/assign/.test(e.action)).map(e=>e.action+' '+(e.summary&&(e.summary.rule_name||'')||''));const tk=await getT(t.id);
  o.res[k]={owner:nm((await own(t.id)).owner),expected:exp[k],hist:x,no:tk.ticket_number||tk.number,id:t.id};}
 o.deact=(await setActive(r.id,false)).s;if(r2.id)o.deact2=(await setActive(r2.id,false)).s;if(r2.id)o.deact2=(await setActive(r2.id,false)).s;LED('NDC-2814: rule QA RT14 2814 holiday deactivated');}
saveIds();fs.writeFileSync(RUN+'/out/t2814.json',JSON.stringify(o,null,1));return o;
