const f=await fieldOf(L,'9da05112-30c1-48be-8023-338850976c6f'); const u=await api('GET','/global-sets/'+I.T+'/used-in');
return {LAY:I.LAY, dto:f&&f.datatypeOptions, usedIn:u.j.data.fields.map(x=>x.field.field_name+' layouts='+JSON.stringify(x.layouts))};
