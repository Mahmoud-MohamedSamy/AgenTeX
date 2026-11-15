async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013', 'content-type':'application/json'}; const out={};
    const call = async (m, p, b) => { const r = await fetch(B+p,{method:m,headers:H,body:b?JSON.stringify(b):undefined}); const t = await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j,t:t.slice(0,300)}; };
    const DEP='1499272000000006907';
    const se = await call('GET','supportEmailAddress?departmentId='+DEP); out.from = (se.j&&se.j.data||[]).map(x=>({a:x.address, d:x.isDefault}));
    const c = await call('POST','contacts',{lastName:'QA GL W4R zoho', email:'qa-gl-w4r-zoho@example.com'}); out.contact = c.s + ' ' + (c.j&&c.j.id || c.t);
    const cid = c.j && c.j.id; if (!cid) return out;
    const t = await call('POST','tickets',{subject:'QA GL W4R تقييم الخدمة', description:'مرحبا، هذا اختبار لصفحة التقييم باللغة العربية. QA GL W4R', departmentId:DEP, contactId:cid, channel:'Email', language:'Arabic'}); out.ticket = t.s + ' ' + (t.j? (t.j.id+' #'+t.j.ticketNumber+' lang '+t.j.language) : t.t);
    const tid = t.j && t.j.id; out.tid = tid; out.cid = cid; if (!tid) return out;
    const from = (out.from.find(x=>x.d)||out.from[0]||{}).a;
    const r = await call('POST','tickets/'+tid+'/sendReply',{channel:'EMAIL', to:'qa-gl-w4r-zoho@example.com', fromEmailAddress: from, contentType:'html', content:'<div>QA GL W4R رد اختبار - test reply for the rating link.</div>'}); out.reply = r.s + ' ' + (r.j? r.j.id : r.t);
    await new Promise(z=>setTimeout(z,5000));
    const th = await call('GET','tickets/'+tid+'/threads'); const last = (th.j&&th.j.data||[]).find(x=>x.direction==='out'); out.thread = last && last.id;
    if (last) { const d = await call('GET','tickets/'+tid+'/threads/'+last.id+'?include=plainText'); const html = (d.j && d.j.content)||''; out.links = (html.match(/https?:\/\/[^"'<\s]+/g)||[]).filter(u=>/feedback|happiness|rating|survey/i.test(u)).slice(0,5); out.contentLen = html.length; out.snip = html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,400); }
    return out;
  });
}
