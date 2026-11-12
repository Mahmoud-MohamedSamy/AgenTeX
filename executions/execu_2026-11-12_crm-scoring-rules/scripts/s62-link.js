const g=await api('GET','/web-forms/'+I.webform); fs.writeFileSync(RUN+'/out/wf-link.txt',g.j.data.share_url); return 'saved, length '+g.j.data.share_url.length;
