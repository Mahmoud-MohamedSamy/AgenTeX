const f=arr((await api('GET','/web-forms')).j.data).find(f=>f.name==='Tech Webform'); I.deskShare=f.share_url; I.deskWf=f.id; SAVE(); return 'ok';
