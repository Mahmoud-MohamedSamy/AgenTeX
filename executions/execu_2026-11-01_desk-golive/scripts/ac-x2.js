await sleep(30000); out.r1 = st(await probe('R1', true)); out.r2 = st(await probe('R2'));
return fin({ out });
