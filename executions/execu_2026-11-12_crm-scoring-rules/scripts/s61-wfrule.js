const L=await modId('leads'); const r=await mkRule(L,{name:P+'WF web',entries:[ent('lead_source','eq','web',10)]}); keepRule(r);
const g=await api('GET','/web-forms/26df0dbf-fcb8-4793-ba4b-347c7adf2d80'); const d=g.j&&g.j.data; I.webform='26df0dbf-fcb8-4793-ba4b-347c7adf2d80'; SAVE();
return {rule:r.s, share:d&&d.share_url, embed:d&&d.embed_key, status:d&&(d.status||d.is_active), keys:d&&Object.keys(d).slice(0,30).join(',')};
