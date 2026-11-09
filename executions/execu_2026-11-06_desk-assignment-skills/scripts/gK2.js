// B-09 in Dept A (A2/A3 are Dept A members). Reuses account/contact made in gK.js.
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const AC='035edbc2-766e-4cfa-a2df-fc86296153a6',CT='b9307d0f-5907-462b-a43e-6eeb6fae8084';
const r1=await mkRule({type:'direct',name:'QA AS6 B09 contact',description:'QA',is_active:true,execute_on:['create'],targets:[{criteria:{conditions:[{field_key:'contact.last_name',operator:'equals',value:'QA AS6 B09'}],pattern:null},coming_to_department_id:IDS.DA,move_to_department_id:null,assign:AG(IDS.A2)}]});
const r2=await mkRule({type:'direct',name:'QA AS6 B09 account',description:'QA',is_active:true,execute_on:['create'],targets:[{criteria:{conditions:[{field_key:'account.account_name',operator:'contains',value:'QA AS6 Acct B09'}],pattern:null},coming_to_department_id:IDS.DA,move_to_department_id:null,assign:AG(IDS.A3)}]});
IDS.DA_B09c=r1.id;IDS.DA_B09a=r2.id;saveIds();
const t1=await mkTicket('QA AS6 B09 r2 with contact',IDS.DA,{contact_id:CT},'B-09');
const t2=await mkTicket('QA AS6 B09 r2 with account only',IDS.DA,{account_id:AC},'B-09');
const t3=await mkTicket('QA AS6 B09 r2 no contact',IDS.DA,{},'B-09');
await W(6000);
const g2=await getT(t2.id);
const out={r1:r1.s+(r1.e||''),r2:r2.s+(r2.e||''),t1:nm((await own(t1.id)).owner),t2:{account:g2.account_id,owner:nm((await own(t2.id)).owner)},t3:nm((await own(t3.id)).owner),h1:(await hist(t1.id)).slice(0,2),h2:(await hist(t2.id)).slice(0,2)};
if(r1.id)await setActive(r1.id,false);if(r2.id)await setActive(r2.id,false);LED('B-09 rules deactivated');
return out;
