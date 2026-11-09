// 7 Nov B-08 runtime: Execution Time criteria (Default BH = 24/7, open now)
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const BH='a0302234-3896-41de-9b85-443a555a7131';
const tg=(sub,op,val,who)=>({criteria:{conditions:[{field_key:'subject',operator:'contains',value:sub},{field_key:'execution_time',operator:op,value:val}],pattern:'1 and 2'},coming_to_department_id:IDS.DA,move_to_department_id:null,assign:AG(who)});
const r=await mkRule({type:'direct',name:'QA AS6 B08 execution time',description:'QA',is_active:true,execute_on:['create'],targets:[tg('QA AS6 B08 during',"during_business_hours",BH,IDS.A1),tg('QA AS6 B08 outside',"outside_business_hours",BH,IDS.A2)]});
IDS.DA_B08=r.id;saveIds();const o={rule:r.s,e:r.e};
if(r.id){for(const s of ['during','outside']){const t=await mkTicket('QA AS6 B08 '+s,IDS.DA,{},'B-08');await sleep(3500);o[s]=nm((await own(t.id)).owner);}
 o.off=(await setActive(r.id,false)).s;LED('B-08 rule deactivated');}
return o;
