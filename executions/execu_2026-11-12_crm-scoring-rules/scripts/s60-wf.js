const l=await api('GET','/web-forms?app=crm'); const items=arr(l.j&&l.j.data); log('count',l.s,items.length);
const one=items.find(x=>x.kind==='web_form'||x.kind==='webform')||items[0]; if(!one) return l.t.slice(0,300);
const g=await api('GET','/web-forms/'+one.id); return {kinds:[...new Set(items.map(x=>x.kind))], sample:g.t.slice(0,3500)};
