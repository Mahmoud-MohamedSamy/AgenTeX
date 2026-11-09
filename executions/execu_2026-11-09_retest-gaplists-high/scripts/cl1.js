const c=await api('GET','/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records/dc8403e7-39b8-4057-979f-32483beb6ffb');
const b=await api('GET','/audit/recycle-bin/items');const items=arr(b.j);
const hits=items.filter(i=>/QA RT 2392|QA RT 2417|QA RT 2787|mw9f0ar2/i.test(JSON.stringify(i)));
const ids=['69d2ca6a','dc8403e7','faa1c662'];const byId=items.filter(i=>ids.some(x=>JSON.stringify(i).includes(x)));
return {deskContact:c.s,bin:b.s,binItems:items.length,qaHits:hits.length,idHits:byId.length};
