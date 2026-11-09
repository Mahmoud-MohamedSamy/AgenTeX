eval(require('fs').readFileSync('lib.js','utf8'));
const tok=(await ctx.cookies()).find(x=>x.name==='aw_staging_access_token').value;
const g=(await api('GET','/web-forms/'+IDS.WF_D14)).j.data;
const def={...g.definition,share_link_enabled:true};
const r=await ctx.request.fetch(H+'/api/v1/web-forms/'+IDS.WF_D14,{method:'PUT',headers:{authorization:'Bearer '+tok,'content-type':'application/json','If-Match':String(g.row_version)},data:JSON.stringify({name:g.name,department_id:g.department_id,layout_id:g.layout_id,definition:def})});
const j=JSON.parse(await r.text());LED('D-14 8 Nov: web form QA AS6 D14 share link (hosted/iframe) ON');
return {put:r.status(),share:j.data&&j.data.share_url?'share_url set':'no share_url',sle:j.data&&j.data.definition&&j.data.definition.share_link_enabled,err:j.error};
