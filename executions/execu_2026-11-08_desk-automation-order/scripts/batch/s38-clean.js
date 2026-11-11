const M='88e8ea44-1658-4df3-9930-d0902b91073d',ACC='784400e1-4a2a-42c2-b4f3-7ca56e79828a',CON='0924eb24-e42a-4eab-8efd-e3428f19e882';const R=[];
for(const t of ['7b652a9d-7eb7-464a-9a68-f839f425092a','e15ca9dd-b271-4e6c-beb0-f9d17ad411c2','eb53ade8-3958-455d-b9af-bef4dfb85e84'])R.push('t'+(await api('DELETE','/modules/'+M+'/records/'+t)).s);
R.push('contract'+(await api('DELETE','/modules/'+CON+'/records/4922707c-0be0-420e-8d23-76308d2f9f6b')).s);
R.push('plan'+(await api('DELETE','/desk/sla/support-plans/5a506f14-66e1-4571-85c0-14bc563c211b')).s);
R.push('policy'+(await api('DELETE','/desk/sla/policies/c0deaa14-da0c-40b8-ae78-98d3180cfbd1')).s);
R.push('account'+(await api('DELETE','/modules/'+ACC+'/records/9415abe1-04b0-4ef4-a2e2-7084c28a83c9')).s);
return R;
