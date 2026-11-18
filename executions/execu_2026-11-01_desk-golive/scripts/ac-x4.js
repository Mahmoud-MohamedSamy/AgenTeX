out.r1now = st(await probe('R1')); await sleep(30000); out.r1after30 = st(await probe('R1')); out.r2 = st(await probe('R2'));
out.r2comment = await prr('POST', '/desk/tickets/' + TK.R2 + '/comments', { body_html: '<p>QA AC2 C comment on spam ticket</p>', is_private: true });
return fin({ out });
