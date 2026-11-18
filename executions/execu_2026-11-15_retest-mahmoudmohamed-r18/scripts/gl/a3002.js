const o={};
for (const v of ['exa mple.com','abc','taviportal.com','http://x.com']) { const r=await api('POST','/desk/channels/domains/'+encodeURIComponent(v),{}); o[v]=r.s+' '+r.t.slice(0,260); }
const l=await api('GET','/desk/channels/domains'); o.list=l.j.data.domains.map(d=>d.domain+' '+d.state);
for (const d of l.j.data.domains) if(!['help-staging.anyware.software','taviportal.com'].includes(d.domain)) o['del '+d.domain]=(await api('DELETE','/desk/channels/domains/'+encodeURIComponent(d.domain))).s;
o.after=(await api('GET','/desk/channels/domains')).j.data.domains.map(d=>d.domain+' '+d.state);
return o;
