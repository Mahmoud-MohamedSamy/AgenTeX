const I=JSON.parse(fs.readFileSync('l3/ids.json','utf8')); const o={};
const g=await api('GET','/iam/profiles/'+I.PROF+'/permissions'); o.mine=g.s+' n='+arr(g.j&&g.j.data).length+' '+g.t.slice(0,300);
const ef=await api('GET','/iam/profiles/'+I.PROF+'/effective'); const E=arr(ef.j&&ef.j.data); o.eff=ef.s+' n='+E.length; o.hasTags=E.includes('desk:tags:manage'); o.hasKbManage=E.includes('desk:kb:manage');
const pr=arr((await api('GET','/iam/profiles?app_key=desk')).j.data).find(p=>p.profileId===I.PROF); o.prof=pr;
return o;
