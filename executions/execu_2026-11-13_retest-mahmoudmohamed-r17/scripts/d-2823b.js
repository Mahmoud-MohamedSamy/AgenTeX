const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={}; I.T23=I.T23||[];
for(let i=I.T23.length+1;i<=60;i++){ const n=String(i).padStart(2,'0'); const r=await api('POST','/modules/'+T+'/records',rec({subject:'QA RT17 2823 '+n,department:I.D74,status:'Open',email:'qa.rt17@example.com'})); const id=r.j&&r.j.data&&(r.j.data.id||(r.j.data.record&&r.j.data.record.id)); if(id) I.T23.push(id); else {o.err=SR(r)+' '+r.t.slice(0,200); break;} }
SAVE(); LED('desk tickets QA RT17 2823 01-60: '+I.T23.length+' (ids T23), dept QA RT17 2174 Dept');
const lay=arr((await api('GET','/modules/'+T+'/layouts')).j.data); o.layouts=lay.length;
const r=await api('POST','/modules/'+T+'/views',{name:'QA RT17 2823 view',kind:'list',layout_id:I.L74,visibility:'private',settings:{columns:['subject','status','priority'],sort:null,criteria:{pattern:null,conditions:[{field:'subject',operator:'starts_with',value:'QA RT17 2823'}]},related_criteria:[]}});
o.view=SR(r)+' '+(r.s>=300?r.t.slice(0,300):''); I.V23=r.j&&r.j.data&&r.j.data.id; if(I.V23){SAVE();LED('desk view QA RT17 2823 view '+I.V23);}
const lr=await api('GET','/modules/'+T+'/records?view_id='+I.V23+'&limit=5'); o.count=JSON.stringify(lr.j&&lr.j.meta).slice(0,160); o.n=I.T23.length;
return o;
