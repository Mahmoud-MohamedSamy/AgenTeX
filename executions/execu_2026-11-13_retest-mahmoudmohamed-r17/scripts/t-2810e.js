const CM='6f553963-01d6-4b68-9fb3-143d23044c41'; const g=await api('GET','/modules/'+CM+'/records/'+I.S10.B.crm); const d=await api('DELETE','/modules/'+CM+'/records/'+I.S10.B.crm);
LED('deleted CRM contact (Customers) QA RT17 2810 B '+I.S10.B.crm+' '+d.s); I.S10.delB=new Date().toISOString(); SAVE(); return {get:g.s, del:d.s};
