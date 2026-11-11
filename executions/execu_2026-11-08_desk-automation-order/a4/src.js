const r=await api('GET','/workflow/custom-actions/sources');return [r.s,JSON.stringify(arr2(r.j?.data).map(s=>[s.id,s.name,s.baseUrl||s.base_url,s.authType||s.auth_type])).slice(0,800)];
