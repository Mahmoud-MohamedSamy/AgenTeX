eval(fs.readFileSync('wf/lib.js','utf8'));const o={n:0,ch:{},email:[]};const SINCE='2026-11-16T15:44:00Z';
for(let p=1;p<=15;p++){const r=(await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100&sort_by=created_at&sort_dir=desc')).j?.data;const L=arr(r);if(!L.length)break;
 if(p===1)o.sample=Object.keys(L[0]).join(',')+' | '+(L[0].data||[]).map(x=>x.field).join(',');
 let stop=false;for(const x of L){const ca=x.createdAt||x.created_at;if(ca<SINCE){stop=true;break;}o.n++;const f={};for(const d of (x.data||[]))f[d.field]=val(d.value);const ch=f.channel||f.source||'?';o.ch[ch]=(o.ch[ch]||0)+1;if(/mail/i.test(String(ch)))o.email.push((x.recordNumber||x.number)+' '+ca);}
 if(stop)break;}
o.oldestSeen=SINCE;return o;
