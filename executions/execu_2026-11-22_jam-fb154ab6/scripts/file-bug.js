// Files the Jam fb154ab6 bug in Plane NDC (REST, API key from Downloads CSV, never printed). Idempotent via filed.json.
const fs=require('fs'),path=require('path');const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-22_jam-fb154ab6';
const dir='C:/Users/Dell/Downloads';const kf=fs.readdirSync(dir).filter(x=>/^secret-key-.*\.csv$/.test(x)).sort().pop();const KEY=fs.readFileSync(dir+'/'+kf,'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g,'').trim();
const P='https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';const H={'X-API-Key':KEY,'Content-Type':'application/json'};
const STATE='34a7f4b6-7207-4955-b927-0d8d1dd3c666',CYCLE='8347595f-5728-4093-bb08-f451e7faa47b',MODULE='dea98455-e533-4b49-8a48-6fb88f3249a3';
const ASG=['e1364b0b-d3cd-4167-8261-6194577a480a','9c2ff309-bbdb-4be3-b819-3022d9cf3c3b','9529016b-e67d-42b9-815c-263f673b8252'];
const JAM='https://jam.dev/c/fb154ab6-264f-4e6f-bb56-09f7636a6d51';
const OUT=R+'/filed.json';const filed=fs.existsSync(OUT)?JSON.parse(fs.readFileSync(OUT,'utf8')):{};
const e=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');const ul=a=>'<ul>'+a.map(x=>`<li><p>${x}</p></li>`).join('')+'</ul>';const ol=a=>'<ol>'+a.map(x=>`<li><p>${x}</p></li>`).join('')+'</ol>';
const ID='<code>a26a20be-8b90-49cc-9af4-99dde65a4a54</code>';
const rows=[['1','Automation › Workflow Rules','Send Email to Manager','list Module column; rule page header and the "When" sentence','0:03'],['2','Automation › Assignment Rules','Assign New Lead','list Module column; rule page header','0:15, 0:18'],['3','Automation › Actions','Send Mail','list Module column; action page','0:24'],['4','Process Management › Approval Processes','Add New Company','list Module column; process page header','0:55, 0:56'],['5','Process Management › Review Processes','Review Leads Info','list Module column; process page header','1:04']];
const table='<table><tbody><tr>'+['#','Page','Item','Where the ID shows','Jam time'].map(h=>`<th><p>${h}</p></th>`).join('')+'</tr>'+rows.map(r=>'<tr>'+r.map(c=>`<td><p>${e(c)}</p></td>`).join('')+'</tr>').join('')+'</tbody></table>';
const imgs=['1-workflow-rules-vs-zoho.png','2-assignment-rules-vs-zoho.png','3-actions-vs-zoho.png','4-approval-processes-vs-zoho.png','5-review-processes-vs-zoho.png'];
const html=`<h2>Summary</h2><p>On five Setup pages the Module column shows a long ID (${ID}) instead of a module name. All five items were created in August 2026. Their module no longer exists in the CRM: every current module was created on 29 Oct 2026, and opening this module ID returns "not found". The items still show as Active.</p>${table}
<h2>Steps to reproduce</h2>${ol(['Sign in to TAVI CRM as the owner (org NDC-Staging).','Open Setup › Automation › Workflow Rules.','Look at the Module column for "Send Email to Manager".','Open the rule.','Repeat on Assignment Rules, Actions, Approval Processes and Review Processes.'])}
<h2>Expected result</h2>${ul(['Each item shows the name of a module that exists, as Zoho CRM does (Zoho\'s Workflow Rules list shows "Deals").','When an item\'s module was removed, the page says so clearly (for example "Deleted module"), and the item can be moved to another module or deleted.'])}
<h2>Actual result</h2>${ul(['The Module column and the item pages show the raw ID '+ID+'.','The workflow rule page reads "This rule will be executed when a record in a26a20be-8b90-49cc-9af4-99dde65a4a54 is created or edited."','The items still show as Active even though their module is gone.'])}
<h2>Notes</h2>${ul(['Opening the module (<code>/api/v1/modules/a26a20be-…</code>) returns 404. Its fields and layouts return an empty list, so the item pages open with empty field pickers.','The current modules\' fields, layouts, views, layout rules, validation rules, blueprints and tags were checked; none of them points to a missing module.','Zoho behaviour when a module that rules depend on is deleted: not checked (read-only).'])}
<h2>Environment</h2>${ul(['TAVI CRM web, ndc-crm.anyware.software, org NDC-Staging, owner account','Edge 158 on Windows 10 (Jam); rechecked live on 22 Nov 2026'])}
<h2>Evidence</h2>${ul(['Jam: <a href="'+JAM+'">'+JAM+'</a>'].concat(imgs.map(x=>e(x)+' (attached)')))}`;
const j=async(m,u,b)=>{const r=await fetch(u,{method:m,headers:H,body:b?JSON.stringify(b):undefined});const t=await r.text();let o=null;try{o=JSON.parse(t)}catch(_){}return{s:r.status,o,t:t.slice(0,300)};};
(async()=>{
 if(!filed.id){const r=await j('POST',P+'/work-items/',{name:'CRM Automation | Workflow rules, assignment rules, actions, approval and review processes show a module ID instead of the module name',description_html:html,priority:'urgent',state:STATE,assignees:ASG});if(r.s>=300)throw new Error('create '+r.s+' '+r.t);filed.id=r.o.id;filed.seq=r.o.sequence_id;fs.writeFileSync(OUT,JSON.stringify(filed,null,1));}
 const id=filed.id;
 if(!filed.cycle){const r=await j('POST',P+'/cycles/'+CYCLE+'/cycle-issues/',{issues:[id]});filed.cycle=r.s;}
 if(!filed.module){const r=await j('POST',P+'/modules/'+MODULE+'/module-issues/',{issues:[id]});filed.module=r.s;}
 if(!filed.link){const r=await j('POST',P+'/work-items/'+id+'/links/',{url:JAM,title:'Jam fb154ab6 — modules shown as ID'});filed.link=r.s;}
 filed.att=filed.att||{};
 for(const f of imgs){if(filed.att[f])continue;const fp=R+'/evidence/annotated/'+f;const buf=fs.readFileSync(fp);
  const a=await j('POST',P+'/work-items/'+id+'/attachments/',{name:f,type:'image/png',size:buf.length});if(a.s>=300){filed.att[f]='ERR '+a.s;continue;}
  const fd=new FormData();for(const [k,v] of Object.entries(a.o.upload_data.fields))fd.append(k,v);fd.append('file',new Blob([buf],{type:'image/png'}),f);
  const up=await fetch(a.o.upload_data.url,{method:'POST',body:fd});const aid=a.o.asset_id||(a.o.attachment&&a.o.attachment.id);
  const pa=await j('PATCH',P+'/work-items/'+id+'/attachments/'+aid+'/',{is_uploaded:true});filed.att[f]=up.status+'/'+pa.s;fs.writeFileSync(OUT,JSON.stringify(filed,null,1));}
 fs.writeFileSync(OUT,JSON.stringify(filed,null,1));console.log(JSON.stringify(filed));})().catch(x=>{fs.writeFileSync(OUT,JSON.stringify(filed,null,1));console.error('ERR',x.message);process.exit(1)});
