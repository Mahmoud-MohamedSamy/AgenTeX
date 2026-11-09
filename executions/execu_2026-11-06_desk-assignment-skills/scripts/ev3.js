// B-1 recheck: RR on create with default prefs (offline agents OFF); agents presence as-is.
eval(require('fs').readFileSync('lib.js','utf8'));
const o={};
const g=await getRule(IDS.RR_SEQ);
o.presence=(await api('POST','/desk/agents/presence/query',{user_ids:[IDS.A1,IDS.A2,IDS.A3]})).j?.data;
o.ruleCreate=(await putRule(IDS.RR_SEQ,{execute_on:['create','update']})).s;
o.tC=await mkTicket('QA AS6 SEQ B1 create default prefs',IDS.DA,{},'B-1 recheck');
await sleep(10000);
o.tC.owner=await own(o.tC.id);o.tC.hist=(await hist(o.tC.id)).slice(0,8);
o.ruleBack=(await putRule(IDS.RR_SEQ,{execute_on:g.execute_on})).s;
LED('B-1 recheck 7 Nov: RR_SEQ execute_on create+update temporarily, restored');
return o;
