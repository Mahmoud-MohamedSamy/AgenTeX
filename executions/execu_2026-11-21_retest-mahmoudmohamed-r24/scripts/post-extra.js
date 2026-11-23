// node post-extra.js NDC-a,NDC-b : comment + attach only (no state change), for tickets someone already moved.
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const rows=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/).map(l=>l.split(','));
const ki=rows[0].findIndex(h=>/secret key/i.test(h));const H={'X-API-Key':rows[1][ki>=0?ki:rows[0].length-1].replace(/"/g,'').trim(),'Content-Type':'application/json'};
const B='https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const RUN=path.join(__dirname,'..');const pf=path.join(RUN,'posted.json');const done=fs.existsSync(pf)?JSON.parse(fs.readFileSync(pf,'utf8')):{};
(async()=>{for(const k of process.argv[2].split(',')){const d=require('../plane-draft.json').find(x=>x.ticket===k);const rec=done[k]||{};
 const w=await (await fetch(`${B}/work-items/${d.id}/`,{headers:H})).json();
 const html=d.comment_html.replace(/ → moved to (Done|Bug)/,' (ticket was already moved by someone else; state not changed)');
 if(!rec.comment){rec.comment=(await fetch(`${B}/work-items/${d.id}/comments/`,{method:'POST',headers:H,body:JSON.stringify({comment_html:html})})).status;}
 rec.state='already '+w.state;rec.attach=rec.attach||[];for(const f of d.images){if(rec.attach.includes(f))continue;execFileSync('node',[path.join(__dirname,'plane-attach.js'),d.id,path.join(RUN,'screenshots/annotated',f)]);rec.attach.push(f);}
 done[k]=rec;fs.writeFileSync(pf,JSON.stringify(done,null,1));console.log(k,'comment',rec.comment,'attach',rec.attach.length,'updated_by',w.updated_by);}})().catch(e=>console.error('ERR',String(e.message).replace(/plane_[A-Za-z0-9_-]+/g,'<key>')));
