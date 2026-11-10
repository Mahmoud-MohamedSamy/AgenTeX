const r=await api('GET','/desk/email-templates');const L=(r.j&&r.j.data&&r.j.data.email_templates)||[];
const custom=L.filter(x=>!x.is_system);return {total:L.length,custom:custom.length,keys:Object.keys(custom[0]||L[0]).join(','),sample:JSON.stringify(custom[0]||{}).slice(0,1200),folders:JSON.stringify((await api('GET','/desk/email-templates/folders')).j.data).slice(0,500)};
