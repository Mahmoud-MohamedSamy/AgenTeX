const items=[['01-modules-fields','Modules and Fields'],['03-assignment-rules','Assignment Rules'],['04-workflow-rules','Workflow Rules'],['04b-actions','Actions'],['05-sla','SLA & Escalation'],['07-blueprints','Blueprints'],['08-notifications','Notifications'],['13-email-templates','Email Templates'],['10a-recycle-bin','Recycle Bin'],['10b-export','Export'],['10c-import','Import'],['10d-bulk-actions-log','Bulk Actions Log'],['10e-audit-log','Audit Log'],['11a-collaboration-tools','Collaboration Tools'],['11b-team-feeds-setup','Team Feeds'],['14-crm-desk-integration','CRM ⇄ Desk Integration'],['09a-macros','Macros'],['12a-ticket-templates','Ticket Templates']];
const out={};
await page.goto(H+'/settings',{waitUntil:'commit',timeout:120000}); await sleep(12000);
for (const [f,label] of items){
  try{
    const loc = page.getByText(label,{exact:true});
    const n = await loc.count();
    // pick the sidebar one (last occurrence usually in setup nav); for Team Feeds choose the one after 'Ticket Access'
    let el = label==='Team Feeds' ? loc.nth(n-1) : loc.first();
    await el.click({timeout:15000}); await sleep(9000);
    const t=(await page.innerText('main').catch(()=>page.innerText('body'))).replace(/\s+/g,' ');
    await page.screenshot({path:'../evidence/raw/'+f+'.png'});
    out[label]={url:page.url().replace(H,''), text:t.slice(0,400)};
  }catch(e){out[label]={err:String(e.message).slice(0,150)}}
}
return out;
