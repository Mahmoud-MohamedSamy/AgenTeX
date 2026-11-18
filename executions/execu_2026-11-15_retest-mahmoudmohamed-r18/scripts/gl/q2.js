const f=arr((await api('GET','/web-forms')).j.data).find(x=>x.name==='QA RT18 form'); return {share:f.share_url, en:f.is_enabled};
