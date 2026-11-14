const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const v=(await api('GET','/modules/'+T+'/views/'+I.V23)).j.data;
const r=await api('PUT','/modules/'+T+'/views/'+I.V23,{name:v.name,kind:'list',layout_id:null,visibility:'private',settings:v.settings,row_version:v.row_version}); return SR(r)+' '+r.t.slice(0,200);
