// T-24: Attachment tab uploads (png+pdf), preview, 45 MB zip, exe, Arabic + 10 files, delete + reload; reply with pdf; mailbox.
const L=require('./lib');const F='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/a17cf060-bd19-487d-b9db-8f4190183934/scratchpad/files/';
module.exports=async()=>{const R={};let step='';const toast=async()=>{let s='';for(let i=0;i<20&&!s;i++){await pg.waitForTimeout(500);s=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}return s;};
 let t=(await L.findTicket('QA MAN attach 01'))[0];if(!t){const c=await api('POST','/modules/'+T+'/records',L.body({subject:'QA MAN attach 01',department:L.D.MK,status:'Open',channel:'email',contact_id:'bc1b1c62-c31a-40ec-a089-cfcdcc6864b1',description:'QA MAN attachments'}));t={id:c.j.data.id};LED('T-24 ticket "QA MAN attach 01" '+t.id);}
 const id=t.id;require('fs').writeFileSync(OUT+'/t24.json',JSON.stringify({id}));
 const tab=async()=>{const a=pg.locator('[role=tab]').filter({hasText:/attachment/i}).first();await a.click();await pg.waitForTimeout(3000);return a.getAttribute('aria-controls');};
 const panel=async c=>pg.evaluate(c=>document.getElementById(c).innerText.replace(/\s+/g,' ').slice(0,700),c);
 const up=async files=>{const inp=pg.locator('[role=tabpanel] input[type=file], main input[type=file]').first();await inp.setInputFiles(files.map(f=>F+f));return toast();};
 try{
 step='01';await L.gotoTicket(id);let c=await tab();R.inputs=await pg.locator('input[type=file]').count();R.u1=await up(['qa-man-photo.png','qa-man-doc.pdf']);await pg.waitForTimeout(6000);R.p1=await panel(c);await L.shot('t24-01-list');
 const img=pg.locator('[role=tabpanel]').getByText('qa-man-photo.png').first();if(await img.count()){await img.click();await pg.waitForTimeout(3000);R.preview=(await pg.locator('[role=dialog]').last().innerText().catch(()=>'none')).replace(/\s+/g,' ').slice(0,150);R.previewImg=await pg.locator('[role=dialog] img, [role=dialog] canvas, [role=dialog] iframe, [role=dialog] embed').count();await L.shot('t24-01-preview-png');await pg.keyboard.press('Escape');await pg.waitForTimeout(800);}
 const pdf=pg.locator('[role=tabpanel]').getByText('qa-man-doc.pdf').first();if(await pdf.count()){await pdf.click();await pg.waitForTimeout(3000);R.previewPdf=await pg.locator('[role=dialog] iframe, [role=dialog] embed, [role=dialog] object, [role=dialog] canvas').count();await L.shot('t24-01-preview-pdf');await pg.keyboard.press('Escape');await pg.waitForTimeout(800);}
 step='03';R.u3=await up(['qa-man-big.zip']);await pg.waitForTimeout(4000);R.p3=(await panel(c)).includes('qa-man-big.zip');await L.shot('t24-03-big');
 step='04';R.u4=await up(['qa-man-setup.exe']);await pg.waitForTimeout(4000);R.p4=(await panel(c)).includes('qa-man-setup.exe');
 step='05';R.u5=await up(['تقرير الحجز.txt','qa-man-small.txt',...Array.from({length:8},(_,i)=>'qa-man-multi-'+(i+1)+'.txt')]);await pg.waitForTimeout(8000);const p5=await panel(c);R.p5={arabic:p5.includes('تقرير الحجز.txt'),multi:(p5.match(/qa-man-multi-\d/g)||[]).length,small:p5.includes('qa-man-small.txt')};await L.shot('t24-05-ten');
 R.apiFiles=(await api('GET','/desk/tickets/'+id+'/attachments')).t.slice(0,300);
 }catch(x){R.err=step+': '+String(x.message).slice(0,160);await L.shot('t24-err');}return R;};
