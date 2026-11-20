const M={Leads:'841043e1-c078-41f9-8d6e-dfd61bee45c3',Tasks:'a9d87b62-b704-4c2e-b2d5-1b745d7c2065',Calls:'e72e608a-a5d3-45cf-888a-dfadc6e8b456',Meetings:'f13e02be-03d3-46c3-a74e-22c7770823ca',Transactions:'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'};const o=[];
for(const [n,m] of Object.entries(M)){const f=arr((await api('GET',`/modules/${m}/fields?take=400`)).j?.data);for(const x of f)if(x.datatypeKey==='lookup'&&x.datatypeOptions?.target_module_id&&x.status==='active')o.push([n,x.apiName,x.labels?.en,x.datatypeOptions.target_module_id]);}
return o;
