const o={};const all=[];for(let p=1;p<=5;p++){const r=await api('GET','/modules/'+TK+'/records?page_size=100&page='+p);const L2=arr(r.j);for(const x of L2){const s=((x.data||[]).find(f=>f.field==='subject')||{}).value?.value||'';if(/^QA RT26|^New Question NDC-3007/.test(s))all.push(s);}if(L2.length<100)break;}
o.ticketsLeft=all;const tp=arr((await api('GET','/desk/community/topics?limit=50')).j?.data?.items);o.topicsLeft=tp.filter(x=>/NDC-3007|QA RT1[89]|QA RT22|test00/.test(x.title)).length;
o.ca=arr((await api('GET','/workflow/custom-actions')).j?.data?.items||(await api('GET','/workflow/custom-actions')).j).filter(x=>/QA RT18/.test(x.name)).length;
const rb=[];let cur=null;for(let p=0;p<10;p++){const q=await api('GET','/audit/recycle-bin/items?app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&app_key=desk&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));const L2=arr(q.j?.data?.items||q.j?.data);rb.push(...L2);cur=q.j?.meta?.next_cursor;if(!cur||!L2.length)break;}
o.rbLeft=rb.filter(x=>/QA RT26|QA RT18 CA|NDC-3007|test00/.test(x.record_label||'')).map(x=>x.record_label);
const dd=(await api('GET','/desk/departments/ff2611f5-4c5b-4cd2-8853-dd8767f401b6')).j?.data;o.dept=dd?.name+' agents='+dd?.agent_user_ids?.length+' viewOnly='+dd?.view_only_agent_user_ids?.length;
o.statusesUnchanged=JSON.stringify((await api('GET','/desk/ticket-statuses')).j?.data?.statuses)===fs.readFileSync(RUN+'/out/statuses-before.json','utf8').replace(/\s/g,'')||'compare';
return o;
