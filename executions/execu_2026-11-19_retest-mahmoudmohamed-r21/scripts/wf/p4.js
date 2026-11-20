const o={};for(const p of ['/iam/roles?take=200','/iam/profiles?take=200','/desk/roles?take=200','/iam/org-units?take=5']){const x=await api('GET',p);o[p]=x.s+' '+JSON.stringify(arr(x.j?.data).map(r=>[r.id||r.orgUnitId||r.profileId,r.name,r.app_key||r.appKey]).slice(0,40));}
return o;
