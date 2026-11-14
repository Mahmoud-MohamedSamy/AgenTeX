const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const AO='93949fbd-f9df-4e2e-ae45-00b8dc38385b'; const o={};
const st=async id=>(JSON.stringify((await api('GET','/modules/'+T+'/records/'+id)).j.data).match(/"status","value":\{"kind":"[a-z]+","value":"([^"]*)"/)||[])[1];
let openOne=null; for(const id of I.T23){ if((await st(id))==='Open'){openOne=id;break;} }
let r=await api('POST','/desk/tickets/'+openOne+'/close',{}); o.closeMine=SR(r)+' '+r.t.slice(0,400); o.afterMine=await st(openOne);
const c=await api('POST','/modules/'+T+'/records',rec({subject:'QA RT17 2823 control',department:AO,status:'Open',email:'qa.rt17@example.com'})); const cid=c.j&&c.j.data&&c.j.data.id; if(cid){I.T23c=cid;SAVE();LED('desk ticket QA RT17 2823 control '+cid);}
r=await api('POST','/desk/tickets/'+cid+'/close',{}); o.closeControl=SR(r)+' '+r.t.slice(0,300); o.afterControl=await st(cid);
return o;
