const o={};const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z OMNI: '+m+'\n');const st={};
for(const tag of ['cancel','deluser']){
 const p=await api('POST','/iam/profiles',{name:'QA RT22 3049 '+tag,appKey:'salesiq',app_key:'salesiq',parentProfileId:'22222222-2222-2222-2222-222222222203',rank:20});
 const pid=p.j?.data?.profileId||p.j?.data?.id;o['create '+tag]=p.s+' '+(pid||String(p.t).slice(0,200));if(!pid)continue;LED('3049 profile QA RT22 3049 '+tag+' '+pid+' (delete)');
 const inv=await api('POST','/iam/users/invite',{email:'qa.rt22.3049.'+tag+'@example.com',profile_id:pid,display_name:'QA RT22 3049 '+tag});
 o['invite '+tag]=inv.s+' '+JSON.stringify(inv.j?.data||inv.j?.error).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g,'<email>').slice(0,300);
 if(inv.s<300)LED('3049 invited qa.rt22.3049.'+tag+' (cancel/delete)');
 const d=await api('DELETE','/iam/profiles/'+pid);o['delete while pending '+tag]=d.s+' '+String(d.t).slice(0,200);
 st[tag]={pid,inv:inv.j?.data};}
fs.writeFileSync('../out/3049.json',JSON.stringify(st,null,1));return o;
