const TS='c7bb126d-0c55-489f-8924-5fd6f2a98507'; return done({ folders: arr((await api('GET','/teamspaces/'+TS+'/folders')).j?.data).map(x=>x.id.slice(0,8)+' '+x.name) });
