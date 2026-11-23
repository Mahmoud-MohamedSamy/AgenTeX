// READ ONLY. Key read by column, never printed.
const fs=require('fs');
const rows=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/).map(l=>l.split(','));
const ki=rows[0].findIndex(h=>/secret key/i.test(h)); const KEY=rows[1][ki>=0?ki:rows[0].length-1].trim();
const W='https://api.plane.so/api/v1/workspaces/ahmed-hegazy'; const B=W+'/projects/efce4d84-5876-4015-b472-2efca7ad73f3'; const h={'X-API-Key':KEY};
const txt=s=>(s||'').replace(/<br\s*\/?>/g,'\n').replace(/<\/(p|li|h\d|tr|div)>/g,'\n').replace(/<\/t[dh]>/g,' | ').replace(/<li[^>]*>/g,'- ').replace(/<img[^>]*>/g,'[img]').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\n\s*\n+/g,'\n');
(async()=>{ const st=await (await fetch(B+'/states/',{headers:h})).json(); const S={}; for(const s of (st.results||st)) S[s.id]=s.name;
 const out=[]; const full=process.argv.includes('--full');
 for(const a of process.argv.slice(2).filter(x=>!x.startsWith('--'))){ let w; for(let k=0;k<4;k++){ try{ const r=await fetch(`${W}/work-items/NDC-${a}/`,{headers:h}); if(r.status!==200){out.push(a+" status "+r.status);break;} w=await r.json(); break;}catch(e){ await new Promise(r=>setTimeout(r,3000)); } } if(!w) continue;
  out.push(`NDC-${a} | ${S[w.state]||w.state} | ${w.priority} | ${w.name}`);
  if(full){ const c=await (await fetch(`${B}/work-items/${w.id}/comments/?per_page=100`,{headers:h})).json(); fs.writeFileSync(`vr/NDC-${a}.txt`,`# NDC-${a} ${w.name} [${S[w.state]}]\n${txt(w.description_html)}\n== COMMENTS\n${(c.results||[]).map(x=>'--- '+x.created_at+'\n'+txt(x.comment_html)).join('\n')}`);} }
 console.log(out.join('\n')); })().catch(e=>console.error('ERR',e.message));
