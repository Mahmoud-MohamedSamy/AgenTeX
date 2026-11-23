const V=JSON.parse(fs.readFileSync(RUN+'/scripts/k/vo.json','utf8'));const a=await rec(V.t1),b=await rec(V.t2);
return {t1:{priority:a.priority,phone:a.phone,status:a.status,resolution:a.resolution},t2:{due:a.due_date,status:b.status,due2:b.due_date}};
