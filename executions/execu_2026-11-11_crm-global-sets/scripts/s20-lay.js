const l=await api('GET','/modules/'+L+'/layouts/'+I.LAY); const d=l.j.data; fs.writeFileSync(RUN+'/out/layout-before.json',JSON.stringify(d,null,1));
const s=JSON.stringify(d); return {keys:Object.keys(d), rv:d.rowVersion||d.row_version, sample:s.slice(0,1500), len:s.length};
