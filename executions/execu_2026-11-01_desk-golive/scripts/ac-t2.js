out.cst = st(await probe('CST')); out.list = (await listQA()).ids.filter(x => /^[A-Z]/.test(x)).join(',');
return fin({ out });
