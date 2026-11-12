const me=await api('GET','/iam/me'); return {id:(me.j.data&&(me.j.data.user_id||me.j.data.id))};
