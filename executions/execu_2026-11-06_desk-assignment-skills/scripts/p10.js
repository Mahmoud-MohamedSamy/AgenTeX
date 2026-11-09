eval(require('fs').readFileSync('lib.js','utf8'));
const r=await api('GET','/desk/notification-rules/departments/'+IDS.DA);const L=arr(r.j&&r.j.data&&(r.j.data.rules||r.j.data));
return {s:r.s,n:L.length,rules:L.map(x=>[(x.event||x.key||x.trigger||x.name||'?'),x.enabled??x.is_active,JSON.stringify(x.channels||{email:x.email,mobile:x.mobile}).slice(0,60)].join(' | ')),raw:L.length?'':r.t.slice(0,600)};
