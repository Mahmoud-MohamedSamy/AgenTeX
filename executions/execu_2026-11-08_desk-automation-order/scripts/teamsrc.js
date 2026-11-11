const a=(await api('GET','/desk/teams/434140a3-2145-428c-9e57-e6bc5cf2f8d0')).j?.data;const n=JSON.parse(fs.readFileSync('../nt30.json','utf8'));const b=(await api('GET','/desk/teams/'+n.team)).j?.data;
return {as6:{sources:a.team.sources,members:a.member_user_ids?.length},nt30:{sources:b.team.sources,members:b.member_user_ids?.length}};
