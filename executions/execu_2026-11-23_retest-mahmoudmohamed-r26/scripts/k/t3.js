const X=JSON.parse(fs.readFileSync(RUN+'/out/3136.json','utf8'));const o={};
for(const [k,id] of Object.entries(X.t))o[k]=E(await api('PATCH','/modules/'+TK+'/records/'+id,{data:fields({status:'QA NDC Distributor'})}));return o;
