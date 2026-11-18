// node plane-dump.js <uuid:seq>...  -> ../tickets/NDC-<seq>.txt (description text + comments). Key read by column, never printed.
const fs=require('fs');
const rows=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/).map(l=>l.split(','));
const ki=rows[0].findIndex(h=>/secret key/i.test(h)); const KEY=rows[1][ki>=0?ki:rows[0].length-1].trim();
const B='https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const h={'X-API-Key':KEY};
const txt=s=>(s||'').replace(/<br\s*\/?>/g,'\n').replace(/<\/(p|li|h\d|tr|div)>/g,'\n').replace(/<\/t[dh]>/g,' | ').replace(/<li[^>]*>/g,'- ').replace(/<img[^>]*src="([^"]*)"[^>]*>/g,'[img]').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\n\s*\n+/g,'\n');
(async()=>{for(const a of process.argv.slice(2)){const [id,seq]=a.split(':');
 const w=await (await fetch(`${B}/work-items/${id}/`,{headers:h})).json();
 const c=await (await fetch(`${B}/work-items/${id}/comments/?per_page=100`,{headers:h})).json();
 const cs=(c.results||[]).map(x=>`--- comment ${x.created_at} by ${x.actor||x.created_by}\n${txt(x.comment_html)}`).join('\n');
 fs.writeFileSync(`../tickets/NDC-${seq}.txt`,`# NDC-${seq} ${w.name}\n${txt(w.description_html)}\n\n== COMMENTS (${(c.results||[]).length})\n${cs}\n`);
 console.log(seq, (w.description_html||'').length, (c.results||[]).length);}})().catch(e=>console.error('ERR',e.message));
