const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
const LED=m=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${m} (lane VR)\n`);
const I=JSON.parse(fs.readFileSync('vr/ids.json','utf8'));
for(const [k,id] of Object.entries(I.tk)){ const g=(await api('GET','/modules/'+T+'/records/'+id)).j; const lay=g&&g.data&&(g.data.layout_id||g.data.created_with_layout_id); if(lay!==I.layout) continue; const d=await api('DELETE','/modules/'+T+'/records/'+id); o[k]=d.s; if(d.s<300) LED('ticket "QA RT20 VR 1988 '+k+'" '+id+' deleted (Recycle Bin) so the QA layout can be disabled'); }
const g=(await api('GET','/modules/'+T+'/layouts/'+I.layout)).j.data; const lb={...g}; delete lb.id; delete lb.displayInHelpCenter; lb.status='disabled'; const r=await api('PUT','/modules/'+T+'/layouts/'+I.layout,lb); o.layOff=r.s+' '+(r.s>=300?r.t.slice(0,300):''); o.layNow=(await api('GET','/modules/'+T+'/layouts/'+I.layout)).j.data.status; LED('layout '+I.layout+' status → '+o.layNow);
return o;
