eval(require('fs').readFileSync('lib.js','utf8'));
const tags=await api('GET','/desk/tags?limit=5'); const g=await getRule('571c4024-4cd5-4cb2-bd83-e2efe6ab66a9');
const wf=arr((await api('GET','/workflow/rules?moduleId='+T+'&limit=200')).j.data); const at=JSON.stringify(wf).match(/"type":"AddTags".{0,1600}/); const tg=at?at[0].match(/"tag[A-Za-z]*":[^,\]]*[\],]/g):null;
const ow=JSON.stringify(wf).match(/"ownerTargetKind":"SpecificUser".{0,300}/);
return {tags:tags.s+' '+tags.t.slice(0,400),c07:g&&g.targets[0].assign,addTagsFields:tg,ownSpecific:ow&&ow[0].slice(0,300)};
