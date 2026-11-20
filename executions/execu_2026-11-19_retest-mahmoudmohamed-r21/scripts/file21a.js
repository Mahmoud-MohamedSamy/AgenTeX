// Files the CRM validation-rule dialog UI finding (user: publish, 18 Nov 2026).
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const RUN=path.join(__dirname,'..');
const rows=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/).map(l=>l.split(','));
const ki=rows[0].findIndex(h=>/secret key/i.test(h));const KEY=rows[1][ki>=0?ki:rows[0].length-1].replace(/"/g,'').trim();
const B='https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const BUG='34a7f4b6-7207-4955-b927-0d8d1dd3c666',MOD='274a73de-564a-4b8c-8b51-74fe8304e7c2',CYC='7143596a-fcfb-48b6-a6ee-193bfc04bfdd';
const ASG=['e1364b0b-d3cd-4167-8261-6194577a480a','82cf7a79-0707-4f47-97ca-f8926587b6db','9529016b-e67d-42b9-815c-263f673b8252','9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const RFT=Object.fromEntries(require('../out/rft.json').map(t=>['NDC-'+t.seq,t.id]));
const CRM='dea98455-e533-4b49-8a48-6fb88f3249a3',DESK=MOD,M='e1364b0b-d3cd-4167-8261-6194577a480a',FA='82cf7a79-0707-4f47-97ca-f8926587b6db',EA='9529016b-e67d-42b9-815c-263f673b8252',HG='9c2ff309-bbdb-4be3-b819-3022d9cf3c3b';
const BUGS=[['wf-run-page-table-overflow','low',['Workflow Rules'],'NDC-3105',DESK,[M,HG,FA]],['wf-editor-contact-placeholder-not-found','low',['Workflow Rules'],'NDC-3119',DESK,[M,HG,FA]]];
const OUT=path.join(RUN,'bugs/filed.json');const done=fs.existsSync(OUT)?JSON.parse(fs.readFileSync(OUT,'utf8')):{};const save=()=>fs.writeFileSync(OUT,JSON.stringify(done,null,1));
const call=async(m,p,b)=>{for(let i=0;i<4;i++){const r=await fetch(B+p,{method:m,headers:{'x-api-key':KEY,'content-type':'application/json'},body:b?JSON.stringify(b):undefined});if(r.status===429){await new Promise(z=>setTimeout(z,8000));continue;}const t=await r.text();let j;try{j=JSON.parse(t)}catch(e){j=t.slice(0,300)}return{s:r.status,j};}};
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
function toHtml(md){const L=md.split(/\r?\n/);let h='',list=null;const close=()=>{if(list){h+=`</${list}>`;list=null}};
 for(const l of L.slice(1)){let m;const inl=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`(.+?)`/g,'<code>$1</code>');
  if(m=l.match(/^\*\*(.+?)\*\*:?\s*(.*)$/)){close();h+=`<h2>${esc(m[1].replace(/:$/,''))}</h2>`;if(m[2].replace(/^:\s*/,''))h+=`<p>${inl(m[2].replace(/^:\s*/,''))}</p>`;}
  else if(m=l.match(/^\d+\.\s+(.*)/)){if(list!=='ol'){close();h+='<ol>';list='ol'}h+=`<li>${inl(m[1])}</li>`;}
  else if(m=l.match(/^-\s+(.*)/)){if(list!=='ul'){close();h+='<ul>';list='ul'}h+=`<li>${inl(m[1])}</li>`;}
  else if(l.trim()){close();h+=`<p>${inl(l)}</p>`;}}
 close();return '<div>'+h.replace(/screenshots\/annotated\//g,'').replace(/ \(spec scripts\/specs-bugs\/[^)]+\)/g,'')+'</div>';}
(async()=>{let Ls=[],c='';for(let i=0;i<6;i++){const j=(await call('GET','/labels/?per_page=100'+(c?'&cursor='+c:''))).j;Ls=Ls.concat(j.results||[]);if(!j.next_page_results)break;c=j.next_cursor;}
 console.log('ui-labels',Ls.filter(l=>/ui|enhanc/i.test(l.name)).map(l=>l.name).join('; '));for(const [slug,pri,labs,rel,MODX,ASGX] of BUGS){const d=done[slug]||{};const md=fs.readFileSync(path.join(RUN,'bugs',slug+'.md'),'utf8');const name=md.split('\n')[0].replace(/^#\s*/,'').trim();
  const html=toHtml(md.replace(/\*\*Suggested priority\*\*:.*\n?/,'').replace(/\*\*Related\*\*:.*\n?/,''));
  const labels=labs.map(n=>(Ls.find(l=>l.name.toLowerCase()===n.toLowerCase())||{}).id).filter(Boolean);
  if(!d.id){const r=await call('POST','/work-items/',{name,description_html:html,priority:pri,state:BUG,labels,assignees:ASGX||(await call('GET','/work-items/'+RFT[rel]+'/')).j.assignees.map(a=>a.id||a),start_date:'2026-11-19'});if(!r.j||!r.j.id){console.log(slug,'create failed',r.s,JSON.stringify(r.j).slice(0,200));continue;}d.id=r.j.id;d.key='NDC-'+r.j.sequence_id;d.labels=labels.length;done[slug]=d;save();}
  if(!d.module){d.module=(await call('POST',`/modules/${MODX}/module-issues/`,{issues:[d.id]})).s;save();}
  if(!d.cycle){d.cycle=(await call('POST',`/cycles/${CYC}/cycle-issues/`,{issues:[d.id]})).s;save();}
  if(d.attach!=='ok'){try{for(const f of ['BUG-'+slug+'-FAIL.png','BUG-'+slug+'-vs-zoho.png'].filter(f=>fs.existsSync(path.join(RUN,'screenshots/annotated',f))))execFileSync('node',[path.join(__dirname,'plane-attach.js'),d.id,path.join(RUN,'screenshots/annotated',f)]);d.attach='ok'}catch(e){d.attach='err '+String(e.stderr||e.message).replace(/plane_[A-Za-z0-9_-]+/g,'<key>').slice(0,150)}save();}
  if(rel&&(!d.relation||d.relation>=300)){d.relation=(await call('POST',`/work-items/${d.id}/relations/`,{relation_type:'relates_to',issues:[RFT[rel]]})).s;d.rel=rel;save();}
  console.log(slug,JSON.stringify(d));}
})().catch(e=>console.error('ERR',String(e.message).replace(/plane_[A-Za-z0-9_-]+/g,'<key>')));
