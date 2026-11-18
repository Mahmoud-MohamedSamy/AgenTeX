const t=await tk(IDS.T1); return JSON.stringify(t).match(/"(department_id|ticket_number|status|owner_id)":[^,]*/g);
