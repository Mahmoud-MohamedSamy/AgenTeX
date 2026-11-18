const o={}; o.f1=(await api('GET','/desk/tickets/'+IDS.T5+'/followers')).t.slice(0,300);
o.move=await pr('POST','/desk/tickets/'+IDS.T5+'/move',{department_id:DEP.SAL}); o.at=new Date().toISOString(); await sleep(4000);
o.comment=await pr('POST','/desk/tickets/'+IDS.T5+'/comments',{body_html:'<p>QA RT21 AC A5 comment after move</p>',is_private:false});
await sleep(3000); o.f2=(await api('GET','/desk/tickets/'+IDS.T5+'/followers')).t.slice(0,300); o.num=JSON.stringify(await tk(IDS.T5)).match(/"ticket_number":\d+/); return o;
