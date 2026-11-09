// 8 Nov: list web forms (read only)
eval(require('fs').readFileSync('lib.js','utf8'));
const L=(await api('GET','/web-forms')).j.data;
return L.map(f=>({id:f.id,name:f.name,kind:f.kind,dept:f.department_id.slice(0,8),enabled:f.is_enabled,share_link_enabled:f.definition&&f.definition.share_link_enabled,allowed_origins:f.definition&&f.definition.allowed_origins,owner:f.definition&&f.definition.owner&&f.definition.owner.mode,layout:f.layout_id.slice(0,8)}));
