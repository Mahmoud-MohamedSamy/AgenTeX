const CM='43004ce2-577f-4eda-b00a-0750fe40c3d4'; const sv=v=>({kind:'string',value:v});
const c=await api('POST','/modules/'+CM+'/records',{data:[{field:'first_name',value:sv('Mona')},{field:'last_name',value:sv('QA RT18 Export')},{field:'email',value:sv('qa-rt18-export@example.com')}]});
return c.s+' '+(c.j&&c.j.data&&c.j.data.id);
