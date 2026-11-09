const tok=(await ctx.cookies()).find(x=>x.name==='aw_staging_access_token');if(!tok)throw new Error('SIGNED_OUT');
const C='https://staging-crm.taviportal.com/api/v1';const cg=async p=>{const r=await ctx.request.fetch(C+p,{headers:{authorization:'Bearer '+tok.value},timeout:60000});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{s:r.status(),j,t:t.slice(0,600)};};
const o={};const sa=await cg('/emails/sendability');o.sendability=sa.s+' '+JSON.stringify(sa.j&&sa.j.data);
const cn=await cg('/mail/connections');o.connStatus=cn.s;const L=arr(cn.j&&cn.j.data);o.connections=L.map(c=>({provider:c.provider,domain:c.domain,system:c.is_system,global:c.is_global,enabled:c.enabled,health:c.health||c.health_status||null,lastErr:(c.last_error||c.health_message||'').slice(0,120)}));
const me=await cg('/auth/me');o.me=me.s+' '+((me.j&&me.j.data&&me.j.data.email)?me.j.data.email.split('@')[1]:'');
return o;
