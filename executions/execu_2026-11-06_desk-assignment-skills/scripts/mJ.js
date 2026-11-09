eval(require('fs').readFileSync('lib.js','utf8'));
const g=(await api('GET','/web-forms/ea8a3838-2d86-4f33-ba1b-afb7ab3a8b77')).j.data;
return {iframe:g.snippets&&g.snippets.iframe,inline:g.snippets&&g.snippets.inline,share_url:g.share_url,updated:g.updated_at,fields:g.definition.fields.map(f=>f.key)};
