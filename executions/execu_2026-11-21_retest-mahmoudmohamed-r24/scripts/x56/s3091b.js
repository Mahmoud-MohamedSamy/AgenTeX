const DD='6d68dc90-7ecf-4829-bf51-9beb87282b87';const o={};const T=JSON.parse(fs.readFileSync(RUN+'/out/3097.json','utf8'));
const snap=async()=>{const q=(await api('POST','/desk/agents/departments/query',{agent_user_ids:[AG_A]})).j?.data;const d=(q?.departments_by_agent?.[AG_A]||[]).map(x=>x===DD?'QA RT20 B2 Dept':x===CS?'Customer Support':x);const tm=(await api('GET','/desk/teams/'+T.tid)).j?.data?.member_user_ids||[];const sk=(await api('GET','/desk/agent-skills?department_id='+CS)).j?.data;return {depts:d,inTeamDD:tm.includes(AG_A),csSkills:((sk?.agents||[]).find?.(a=>a.user_id===AG_A)?.skills||[]).length};};
o.before=await snap();
const r=await api('POST','/desk/agents/'+AG_A+'/reassign',{departments:[{department_id:DD,target:{kind:'unassigned'}}],update_rules:true});o.reassign=r.s+' '+JSON.stringify(r.j?.data||r.j?.error).slice(0,500);
await sleep(3000);o.after=await snap();o.csStillMember=((await api('GET','/desk/departments/'+CS)).j?.data?.agent_user_ids||[]).includes(AG_A);LED('3091: reassign CES2 (DD only, update_rules true) → see out');
fs.writeFileSync(RUN+'/out/3091.json',JSON.stringify(o,null,1));return o;
