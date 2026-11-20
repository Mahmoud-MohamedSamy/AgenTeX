const o={};const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z OMNI: '+m+'\n');const T=r=>r.s+' '+String(r.t).replace(/"invitation_token":"[^"]+"/,'"invitation_token":"<hidden>"').replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g,'<email>').slice(0,220);
for(const tag of ['cancel2','deluser2']){
 const p=await api('POST','/iam/profiles',{name:'QA RT22 3049 '+tag,appKey:'salesiq',app_key:'salesiq',parentProfileId:'22222222-2222-2222-2222-222222222203',rank:20});const pid=p.j?.data?.profile_id;o[tag+' 1 create profile']=p.s;if(!pid)continue;LED('3049 profile '+tag+' '+pid);
 const inv=await api('POST','/iam/users/invite',{email:'qa.rt22.3049.'+tag+'@example.com',profile_id:pid,display_name:'QA RT22 3049 '+tag});o[tag+' 2 invite']=inv.s;LED('3049 invited '+tag+' user '+inv.j?.data?.user_id);
 o[tag+' 3 delete profile while pending']=T(await api('DELETE','/iam/profiles/'+pid));
 if(tag==='cancel2')o[tag+' 4 cancel invitation']=T(await api('POST','/iam/users/invitations/'+inv.j.data.invitation_id+'/cancel',{}));
 else o[tag+' 4 delete invited user']=T(await api('DELETE','/iam/users/'+inv.j.data.user_id));
 const d=await api('DELETE','/iam/profiles/'+pid);o[tag+' 5 delete profile']=T(d);if(d.s<300)LED('3049 profile '+tag+' deleted');
 o[tag+' 6 profile still listed']=arr((await api('GET','/iam/profiles?take=500')).j?.data).some(x=>(x.profileId||x.id)===pid);}
fs.writeFileSync('../out/3049d.json',JSON.stringify(o,null,1));return o;
