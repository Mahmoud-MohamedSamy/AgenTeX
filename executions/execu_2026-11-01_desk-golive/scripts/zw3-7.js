async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techsolutionsegypt/api/v1/'; const D='1475109000000426945'; const r={};
    const csrf = (document.cookie.match(/crmcsr=([^;]+)/)||document.cookie.match(/CSRF[^=]*=([^;]+)/i)||[])[1];
    for (const p of ['profiles','supportPlans?departmentId='+D,'supportPlans?departmentId='+D+'&status=INACTIVE','functions?limit=20','customFunctions?limit=20','workflowRules?module=tickets&limit=5','connections?limit=10','ticketSettings','archiveSettings','spamSettings']) {
      try { const x = await fetch(B+p,{headers: csrf?{'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf}:{}}); const t = await x.text(); r[p]=x.status+' '+t.slice(0,700); } catch(e){ r[p]='ERR '+e.message; }
    }
    r.csrf = !!csrf; return r;
  });
}
