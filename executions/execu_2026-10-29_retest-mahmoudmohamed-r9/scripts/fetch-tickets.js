// Writes tickets.md: description (text) + comments for each RFT ticket of round 9. Token read by column, never printed.
const fs=require('fs'),path=require('path');const rows=fs.readFileSync(process.argv[2],'utf8').split(/\r?\n/).filter(Boolean).map(l=>l.split(',').map(v=>v.replace(/^"|"$/g,'')));
const T=rows[1][rows[0].indexOf('Secret key')];const A='https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const g=async p=>{for(let i=0;i<6;i++){const r=await fetch(A+p,{headers:{'X-API-Key':T}});if(r.status===429){await new Promise(s=>setTimeout(s,8000));continue;}return r.json();}};
const strip=h=>String(h||'').replace(/<li>/g,'\n- ').replace(/<\/(p|h\d|li|tr)>|<br\s*\/?>/g,'\n').replace(/<td[^>]*>/g,' | ').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\n{3,}/g,'\n\n').trim();
(async()=>{const M=JSON.parse(fs.readFileSync(path.join(__dirname,'..','meta.json'),'utf8'));let md='# Round 9 tickets (29 Oct 2026)\n';
for(const t of M){const w=await g('/work-items/'+t.id+'/?fields=description_html,name');const cm=((await g('/work-items/'+t.id+'/comments/?per_page=100')).results||[]).sort((a,b)=>a.created_at<b.created_at?-1:1);
md+=`\n\n---\n## ${t.key} · ${t.pri} · ${t.labels.join(', ')}\n**${t.name}**\n\n${strip(w.description_html).slice(0,6000)}\n\n### Comments (${cm.length})\n`+cm.slice(-4).map(c=>`- ${c.created_at.slice(0,16)} ${c.actor_detail?.display_name||c.actor}: ${strip(c.comment_html).slice(0,2500)}`).join('\n');}
fs.writeFileSync(path.join(__dirname,'..','tickets.md'),md);console.log('tickets.md',md.length,'chars');})().catch(e=>console.log('ERR',String(e.message).replace(/plane_api_\w+/g,'<t>')));
