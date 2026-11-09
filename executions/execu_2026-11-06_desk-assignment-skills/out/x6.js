eval(require('fs').readFileSync('lib.js','utf8'));
const f=(await api('GET','/desk/assignment-rules/criteria-fields')).j.data.fields;
const ex=f.filter(x=>/exec|business|holiday|time/i.test(x.key+x.label)).map(x=>({key:x.key,label:x.label,type:x.type,ops:x.operators.map(o=>o.key+(o.options?':'+JSON.stringify(o.options).slice(0,120):'')).join(', ')}));
const d=await api('GET','/desk/departments/'+IDS.DA);const bh=await api('GET','/desk/business-hours');
const au=[];for(const off of [0,100,200,300]){const r=await api('GET','/audit/events?app_key=desk&limit=100&offset='+off);const L=arr(r.j.data&&(r.j.data.data||r.j.data.events||r.j.data));for(const e of L){const s=JSON.stringify(e);if(/convert|migrat|refactor|legacy/i.test(s))au.push(s.slice(0,300));}}
return {ex,dept:JSON.stringify(d.j.data).slice(0,400),bh:bh.s+' '+JSON.stringify(bh.j.data).slice(0,700),audit:au.slice(0,8)};
