const fs=require('fs');const IDS=JSON.parse(fs.readFileSync('../../execu_2026-11-06_desk-assignment-skills/out/ids.json','utf8'));
const g=async d=>{const r=await api('GET','/desk/skill-types?department_id='+d);return r.j.data.types.map(t=>t.name);};return {A:await g(IDS.DA),B:await g(IDS.DB)};
