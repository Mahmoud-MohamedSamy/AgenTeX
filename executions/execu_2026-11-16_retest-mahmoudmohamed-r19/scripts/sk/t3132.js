eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/sk/lib.js','utf8'));
const R={steps:[]};const S=(...a)=>{R.steps.push(a.join(' '));save('t3132.json',R);};
const P0=await prefs();save('prefs-orig.json',P0);const base={...P0,assign_to_offline_agents:true};
const T1=async(k,ex={})=>{const t=await tk(k,ex);if(typeof t!=='string')throw new Error('create '+JSON.stringify(t));return t;};
const S1='QA RT19 SK S1',S2='QA RT19 SK S2',S3='QA RT19 SK S3';const rules=[];
try{
 S('prefs offline on',E(await setPrefs(base)));LED('QA RT19 SK Dept RR prefs assign_to_offline_agents=true (orig false)');
 // 2931
 let K='K31'+U;let r=await rule('2931 skill TU1+DT2',[A1,A3],K);rules.push(r.j?.data?.id);S('2931 rule',E(r));
 let t=await T1(K+' a S3+S1',{skills:[S3,S1]});S('2931 a) S3 (nobody) + S1 (Test User 1) -> #'+(await num(t)),await waitOwn(t),await sk(t));R.a=t;
 t=await T1(K+' b S3+S2',{skills:[S3,S2]});S('2931 b) S3 (nobody) + S2 (Dev Team 2) -> #'+(await num(t)),await waitOwn(t),await sk(t));R.b=t;
 t=await T1(K+' c S3 only',{skills:[S3]});await sleep(20000);S('2931 c) S3 only (nobody holds) -> #'+(await num(t)),await own(t));R.c=t;
 for(const x of ['d1','d2','d3']){t=await T1(K+' '+x+' S1+S2',{skills:[S1,S2]});S('2931 '+x+') S1 (TU1) + S2 (DT2) -> #'+(await num(t)),await waitOwn(t));}
 S('2931 rule off',await setA(r.j.data.id,false));
 t=await T1('K31ABS'+U+' assign by skills S3+S1',{skills:[S3,S1]});await sleep(5000);S('2931 e) no rule; owner before',await own(t));
 let a=await api('POST','/desk/tickets/'+t+'/skills/assign',{});await sleep(3000);S('2931 e) Assign by Skills S3+S1 -> #'+(await num(t)),a.s,JSON.stringify(a.j?.data),'owner now',await own(t));R.e=t;
 t=await T1('K31ABS'+U+' assign by skills S3 only',{skills:[S3]});await sleep(4000);a=await api('POST','/desk/tickets/'+t+'/skills/assign',{});S('2931 f) Assign by Skills S3 only -> #'+(await num(t)),a.s,JSON.stringify(a.j?.data),'owner',await own(t));R.f=t;
 // 2932
 K='K32'+U;r=await rule('2932 skill TU1 only',[A1],K);rules.push(r.j?.data?.id);S('2932 rule (pool Test User 1 only; Dev Team 2 in dept but not in rule)',E(r));
 const n=[];for(const x of ['a1','a2','a3']){t=await T1(K+' '+x+' no skills');n.push(t);}
 await sleep(25000);for(const [i,x] of n.entries())S('2932 '+['a1','a2','a3'][i]+') no skills -> #'+(await num(x)),await own(x),'skills',await sk(x),'feed',JSON.stringify((await feed(x)).map(e=>e.action)));R.a32=n;
 t=await T1(K+' b S2 only (holder not in rule)',{skills:[S2]});await sleep(20000);S('2932 b) S2 only (holder Dev Team 2 not in rule) -> #'+(await num(t)),await own(t));R.b32=t;
 S('2932 c) add S1 to #a1 via edit',E(await patch(n[0],{skills:[S1]})));S('2932 c) -> ',await waitOwn(n[0]),await sk(n[0]));
 S('2932 d) assign backlogs ON 90 s',E(await setPrefs({...base,assign_backlogs:true})));await sleep(90000);
 S('2932 d) after 90 s: #a2',await own(n[1]),'#a3',await own(n[2]),'#b',await own(t));
}catch(e){S('ERR '+e.message.slice(0,400));}
finally{for(const id of rules)if(id)try{S('rule off',id,await setA(id,false));}catch(e){}
 S('restore prefs',E(await setPrefs(P0)));R.diff=JSON.stringify(await prefs())===JSON.stringify(P0);LED('QA RT19 SK Dept RR prefs restored, equal='+R.diff);}
save('t3132.json',R);return R;
