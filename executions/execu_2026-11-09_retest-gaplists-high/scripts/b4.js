const fs=require('fs');const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/locales/';fs.mkdirSync(D,{recursive:true});
const ns=['crm-desk-integration','common','settings','iam','users','profiles','hierarchy','hierarchy-preference','company','company-settings','personal-settings','modules','records','workflow','workflows','workflow-rules','blueprint','blueprints','approval','approvals','approval-process','assignment-rules','assignment','sla','reports','views','custom-views','tickets','desk','crm','integrations','notifications','signals','handshake','customers','contacts','sharing','data-sharing','roles','org-units','security','automation','filters','templates','email-templates','admin','setup','light-agents','agents','skills','layouts','fields'];
const out={};
for(const host of ['https://staging-desk.taviportal.com','https://staging-crm.taviportal.com']){out[host]=[];
 for(const n of ns){const r=await ctx.request.get(host+'/locales/en/'+n+'.json',{timeout:60000,failOnStatusCode:false});const t=await r.text();
  if(r.status()===200&&t.trim().startsWith('{')){fs.writeFileSync(D+(host.includes('crm')?'crm_':'desk_')+n+'.json',t);out[host].push(n+':'+t.length);}}}
return out;
