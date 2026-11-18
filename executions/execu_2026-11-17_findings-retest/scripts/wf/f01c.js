eval(fs.readFileSync('wf/lib.js','utf8'));const o={src:{},email:[]};const SINCE='2026-11-16T15:40:00Z';
for(let p=1;p<=15;p++){const L=arr((await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100&sort_by=created_at&sort_dir=desc')).j?.data);if(!L.length)break;let stop=false;
 for(const x of L){if(x.created_at<SINCE){stop=true;break;}const f={};for(const d of (x.data||[]))f[d.field]=val(d.value);const k=String(x.source)+'/'+String(f.channel);o.src[k]=(o.src[k]||0)+1;
  if(/mail/i.test(k)){const d=(await api('GET','/desk/tickets/'+x.id)).j?.data||{};o.email.push({num:f.ticket_number||d.ticket_number,at:x.created_at,by:x.created_by_name,src:x.source,ch:d.channel,subj:String(f.subject).slice(0,60),dept:d.department_name||d.department_id});}}
 if(stop)break;}
return o;
