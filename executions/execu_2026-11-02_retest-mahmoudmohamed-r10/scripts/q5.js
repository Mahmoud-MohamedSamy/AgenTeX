const a=arr((await api('o','GET','/workflow/assignment-rules')).j?.data);
return a.map(x=>[x.id.slice(0,8),x.name,x.isActive,JSON.stringify(x.allowedChannels),JSON.stringify(x.entries?.map(e=>e.target)).slice(0,300),JSON.stringify(x.fallback)]);
