eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const o={};
const p=await api('POST','/iam/tenant/business-hours/profiles',{name:'QA AS6 BH',is_default:false,preset:'24_7',days_active:['mon','tue','wed','thu','fri','sat','sun'],timing_mode:null,hours:null,hours_per_day:null,week_starts_on:'sat',time_zone:'Africa/Cairo'});
const pid=p.j&&p.j.data&&p.j.data.id;o.profile=sh(p);if(pid){IDS.BHQA=pid;saveIds();LED('business hours profile "QA AS6 BH" '+pid+' (non-default, B-08 holiday)');}
if(pid){
 const u=await api('PUT','/desk/holiday-lists/'+IDS.HOL1,{name:'QA AS6 HOL today',description:null,category:'year_specific',business_hour_profile_id:pid});o.link=sh(u);LED('holiday list QA AS6 HOL today linked to QA AS6 BH');
 const bh=await api('GET','/desk/business-hours');o.bh={defaultOpen:bh.j.data.is_open_now,today:bh.j.data.todays_holidays,profiles:bh.j.data.profiles.map(x=>x.name+':'+JSON.stringify(x.holiday_lists&&x.holiday_lists.map(h=>h.name||h)))};
 const exp={t1:'A1',t2:'-'};o.res={};
 for(const k of ['t1','t2']){const t=await mkTicket('QA AS6 HOL '+k+' linked',IDS.DA,{},'B-08 holiday linked');await sleep(3500);o.res[k]={owner:nm((await own(t.id)).owner),expected:exp[k],id:t.id};}
}
o.off=(await setActive(IDS.DA_B08H,false)).s;LED('B-08 holiday rule deactivated');
return o;
