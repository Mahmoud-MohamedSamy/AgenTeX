const pid = '44444444-4444-4444-4444-444444444402';
out.perm = JSON.stringify(D((await api('GET', '/iam/profiles/' + pid + '/permissions?app_key=desk')).j)).slice(0, 3100);
out.eff = JSON.stringify(D((await api('GET', '/iam/profiles/' + pid + '/effective?app_key=desk')).j)).slice(0, 1300);
return fin({ out });
