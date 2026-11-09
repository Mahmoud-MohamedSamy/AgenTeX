// 8 Nov: print the QA web form's iframe snippet + share URL (embed keys are public by design: they are in the website code)
eval(require('fs').readFileSync('lib.js','utf8'));
const g=(await api('GET','/web-forms/'+IDS.WF_D14)).j.data;
return {iframe:g.snippets&&g.snippets.iframe,share_url:g.share_url,share_link_enabled:g.definition.share_link_enabled,enabled:g.is_enabled};
