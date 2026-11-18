const id='a578ae5c-05fc-4161-b76c-648dbd0517df'; const r=await rec(id); const h=await histRaw(id);
return {n:r.ticket_number,status:r.status,contact:r.contact_id,acc:r.account_id,prod:r.product_id,hist:JSON.stringify(h.slice(0,4)).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g,'<e>').slice(0,1200)};
