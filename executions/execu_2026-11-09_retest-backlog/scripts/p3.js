const o={};
const st=await api('GET','/desk/ticket-statuses');o.st={s:st.s,t:st.t.slice(0,900)};
const dp=await api('GET','/desk/departments');const D=arr(dp.j&&dp.j.data);o.depts=D.slice(0,4).map(d=>d.id+' '+d.name);
if(D[0]){const s2=await api('GET','/desk/ticket-statuses?department_id='+D[0].id);o.stDept={s:s2.s,same:s2.t===st.t,t:s2.t.slice(0,200)};}
const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const f=await api('GET','/modules/'+T+'/fields');const F=arr(f.j&&f.j.data);o.nf=F.length;
const keys=new Set();F.forEach(x=>Object.keys(x).forEach(k=>keys.add(k)));o.fieldKeys=[...keys];
const pick=t=>F.filter(x=>(x.datatype||x.dataType||x.type||'').toString().toLowerCase().includes(t)).slice(0,2).map(x=>JSON.stringify(x).slice(0,700));
o.decimal=pick('decimal').concat(pick('currency'));o.lookup=pick('lookup');o.pick=pick('pick').slice(0,1);
o.withDefault=F.filter(x=>JSON.stringify(x).match(/default_?value"\s*:\s*[^n]/i)).map(x=>x.name||x.key).slice(0,10);
return o;
