const M='841043e1-c078-41f9-8d6e-dfd61bee45c3';const r=await api('GET','/modules/'+M+'/list-preferences');const dat=r.j?.data;const p=dat.prefs||dat;const version=dat.version??dat.row_version;
fs.writeFileSync('../out/leads-prefs-before-cleanup.json',JSON.stringify(dat,null,1));
const live=new Set();let allLeads=null;for(const k of ['list','kanban','split']){const L=arr((await api('GET','/modules/'+M+'/views?kind='+k)).j?.data?.views||(await api('GET','/modules/'+M+'/views?kind='+k)).j?.data);for(const v of L){live.add(v.id);if(k==='list'&&/^All Leads$/i.test(v.name))allLeads=v.id;}}
const np={...p};const o={lastView:p.lastView,lastWas:p.lastListViewId,lastLive:live.has(p.lastListViewId)};
if(!live.has(np.lastListViewId))np.lastListViewId=allLeads;np.openListViewIds=(p.openListViewIds||[]).filter(id=>live.has(id));if(np.lastSplitViewId&&!live.has(np.lastSplitViewId))delete np.lastSplitViewId;
if(np.viewColumns&&typeof np.viewColumns==='object')for(const k of Object.keys(np.viewColumns))if(!live.has(k))delete np.viewColumns[k];
np.lastView='kanban';
const u=await api('PUT','/modules/'+M+'/list-preferences',{prefs:np,version});o.put=u.s+(u.s>=300?' '+String(u.t).slice(0,200):'');o.openBefore=(p.openListViewIds||[]).length;o.openAfter=np.openListViewIds.length;o.allLeads=!!allLeads;
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z CLEANUP crm owner Leads prefs: dropped deleted views, lastListViewId → All Leads, lastView → kanban ('+u.s+'); backup out/leads-prefs-before-cleanup.json\n');return o;
