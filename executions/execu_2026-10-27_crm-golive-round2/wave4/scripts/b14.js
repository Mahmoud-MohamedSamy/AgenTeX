// Round 2 Wave 4 batch 14: purge the exact QA R2W4 recycle-bin items listed in after/b13.json (+ the Java run form).
const ids = ["f1339b3b-978a-4560-b186-d15509986e86","6fd4993e-6d22-455d-99f9-9eb828f98467","63ab7ee9-25fb-4d4d-965d-0037b18e1f42","389f1f9c-cd45-4ef6-8a96-d436f4dffc34","d4a112f7-6506-44ce-ad4b-bdd7c20c1e99","1e7bcaae-42da-4098-846c-ab8c15ff0347","f123c0f2-af8a-4086-ab06-74e3dd9e370c","e1bbc56f-2bc9-4f67-96c9-44a5d0abce6f","a8a9aa88-db56-41b5-b47d-46065f02a431","254ecaf6-15fa-4cbb-a6ae-c3d8bc0a5a34","3aaa3fd8-ee69-4028-9d1e-73010bc08a13","ceff40ba-d933-47eb-9920-4d5f34be2382","88b291df-43ad-4807-8269-27b7ddde0d5f","db45d49d-b3f2-45b8-a7f1-e9d3c38b5f05","7cd1c5e4-66ab-48ef-9ca2-d7f80f0fa1c1"];
const arr = v => Array.isArray(v) ? v : (v && (v.items || v.data)) || [];
const d = await call('POST', '/audit/recycle-bin/delete', { ids });
const left = arr((await call('GET', '/audit/recycle-bin/items?limit=100')).j.data).filter(x => /QA R2W4/.test(JSON.stringify(x))).map(x => x.id + ' ' + x.record_label);
return { purged: ids.length, status: d.s, body: String(d.t || '').slice(0, 200), left };
