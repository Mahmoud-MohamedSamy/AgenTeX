const out={};
const st=await api('GET','/desk/integrations/crm/status');const d=st.j&&st.j.data||{};
const flat=JSON.stringify(d);out.statusKeys=Object.keys(d);out.userBits=(flat.match(/"[a-z_]*(user|owner|integrat|inactive|suspend)[a-z_]*":[^,}]{0,90}/gi)||[]).slice(0,15);
const t=await (await ctx.request.get('https://staging-desk.taviportal.com/locales/en/crm-desk-integration.json',{timeout:60000})).text();
const hits=[];const walk=(o,p)=>{for(const k in o){const v=o[k];if(typeof v==='object')walk(v,p+k+'.');else if(/inactiv|deactivat|suspend|re-?point|reconnect|no longer|integrated user|integration user|disabled user|removed user/i.test(v+' '+k))hits.push(p+k+': '+String(v).slice(0,200));}};walk(JSON.parse(t),'');out.localeHits=hits.slice(0,25);
return out;
