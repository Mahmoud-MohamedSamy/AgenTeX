var __B="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/";eval(fs.readFileSync(__B+'blib.js','utf8'));
const a=(await api('GET','/desk/queues/agents')).j?.data;const L=Array.isArray(a)?a:(a?.agents||[]);const e=L.find(x=>x.user_id===A1)?.email;
fs.writeFileSync(RUN+'/scripts/bg/ev/d3-email.csv','Subject,Department,Status,Priority,Ticket Owner\nQA RT19 BUG D3 email row1 member owner by email,QA AS6 Dept A,Open,Medium,'+e+'\n');return {len:(e||'').length};
