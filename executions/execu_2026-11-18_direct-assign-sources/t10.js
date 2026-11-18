const f = arr((await api('GET', '/web-forms?app=desk')).j).find(x => x.name === 'Customer Support Webform');
log({ share: f.share_url, enabled: f.is_enabled, channel: f.channel_enabled, captcha: f.captcha_available, def: JSON.stringify(f.definition).slice(0, 1500) });
