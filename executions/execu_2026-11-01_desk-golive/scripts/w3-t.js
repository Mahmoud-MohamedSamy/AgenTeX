out.u = page.url(); out.me = (await api('GET','/iam/me')).s; return fin({out});
