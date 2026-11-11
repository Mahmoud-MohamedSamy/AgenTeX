// G-02: A1 picks up ticket g2 himself.
const j=JSON.parse(fs.readFileSync('../g.json','utf8'));const me=(await api('GET','/iam/me')).j?.data?.user_id;const a=await api('POST','/desk/tickets/'+j.g2+'/assign',{owner_id:me,team_id:null});return a.s;
