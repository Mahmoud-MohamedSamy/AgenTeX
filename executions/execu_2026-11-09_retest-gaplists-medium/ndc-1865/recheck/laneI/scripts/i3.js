const t=await api('POST',`/modules/${TK}/records`,{data:[{field:'subject',value:S('QA RC 1865 API ticket')},{field:'department',value:S(TECH)},{field:'status',value:S('Open')},{field:'contact_id',value:S(C)},{field:'description',value:S('QA recheck ticket (NDC-1865 finding B). Please ignore.')}]});
const id=idOf(t);out.create=t.s;out.id=id;if(id)log(`CREATED ticket ${id} (QA RC 1865 API ticket, Tech, contact de7195a2 mmohamed@anyware.software — existing contact, not ours) via API → ${t.s}`);
if(!id)return Object.assign(out,{t:t.t.slice(0,400)});
await sleep(3000);
const g=await api('GET',`/modules/${TK}/records/${id}`);out.fields=JSON.stringify(((g.j&&g.j.data&&g.j.data.data)||[]).filter(z=>/number|owner|contact|email|cc/.test(z.field)).map(z=>z.field+'='+JSON.stringify(z.value&&z.value.value))).slice(0,500);
out.loaded=await openTicket(id,'QA RC 1865 API ticket');
await page.locator('button:has-text("Reply All")').first().click();await wt(/Write your reply|Insert template/);await page.waitForTimeout(3000);
out.composer1=await composerInfo();await shot('b2-api-replyall-1-before');
return Object.assign(out,{calls:[...new Set(calls)]});
