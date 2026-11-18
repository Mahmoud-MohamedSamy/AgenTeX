const o={}; o.T2=await mkT('T2',{subject:'QA RT21 AC A2 moved while open',department:DEP.CS,status:'Open',email:'qa-rt21-ac@example.com',channel:'phone',owner:US.C});
o.T4=await mkT('T4',{subject:'QA RT21 AC A5 follower after move',department:DEP.CS,status:'Open',email:'qa-rt21-ac@example.com',channel:'phone'});
o.t2=JSON.stringify(await tk(o.T2)).match(/"(owner_id|ticket_number)":[^,]*/g); return o;
