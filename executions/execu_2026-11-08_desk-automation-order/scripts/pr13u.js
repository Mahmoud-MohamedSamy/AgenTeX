eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const M=JSON.parse(fs.readFileSync('../pr13.json','utf8'));const p=await patch(M.id,{priority:'medium'});const o=await waitRec(M.id,x=>x.owner,24);
M.afterUpdate=nm(o.owner);M.feed2=await feedS(M.id);fs.writeFileSync('../pr13.json',JSON.stringify(M,null,1));return {patch:E(p),owner:M.afterUpdate,feed:M.feed2};
