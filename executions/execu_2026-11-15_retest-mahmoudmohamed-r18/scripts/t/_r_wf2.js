const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const E=r=>r&&r.j&&r.j.error?(r.j.error.code+': '+r.j.error.message):'';
const SR=r=>r.s+(E(r)?' '+E(r):'');
const IDS=RUN+'/out/ids-crm9.json'; const I=fs.existsSync(IDS)?JSON.parse(fs.readFileSync(IDS,'utf8')):{}; const SAVE=()=>fs.writeFileSync(IDS,JSON.stringify(I,null,1));
const L='841043e1-c078-41f9-8d6e-dfd61bee45c3', D='f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const enc=v=>({kind:'string',value:String(v)}); const rec=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
const o={};
const lay=arr((await api('GET','/modules/'+L+'/layouts')).j.data); const std=lay.find(x=>/^standard$/i.test(x.name)); o.std=std&&std.id;
const fld = k => ({ key: k, placeholder: null, label: null, required: false, hidden: false, default_value: null, help: null });
const def = { version: 2, language: 'en', success_message: 'QA RT18 2959 thank you', fields: [fld('first_name'), fld('lead_source')], attachments: { enabled: false, screenshot_enabled: false, target_field_key: null, required: false, label: null }, captcha_enabled: false, launcher: null, allowed_origins: [], style: { font_family: 'system', font_size: 13, font_color: '#1F2937', background_color: '#FFFFFF', label_alignment: 'top', width_px: 600, submit_label: null, reset_label: null, show_form_name: false, field_columns: null }, redirect_url: null, default_owner_id: null, live_chat: false, share_link_enabled: true, owner: { mode: 'unassigned', user_id: null, assignment_rule_id: null, notify_owner: false, notify_email: false, notify_user_ids: [] }, duplicates: null, capture: null, acknowledgement: null, tags: null, consent: null, review: null, double_opt_in: null, related: null };
if(!I.wf){ const w=await api('POST','/web-forms',{kind:'advanced_form',app_key:'crm',name:'QA RT18 2959 form',module_id:L,layout_id:std.id,is_enabled:true,definition:def}); o.create=SR(w).slice(0,300)+' '+w.t.slice(0,900); if(w.j&&w.j.data){I.wf=w.j.data.id;SAVE();LED('web form "QA RT18 2959 form" '+I.wf+' (CRM Leads, Standard)');} }
o.dbg=I.wf; const g=await api('GET','/web-forms/'+I.wf); if(!g.j||!g.j.data) return [o,g.s,g.t.slice(0,300)]; const d=g.j.data; o.share=String(d.share_url||'null').replace(/f\/[^"'\s]+/,'f/<k>'); o.shareOn=d.definition&&d.definition.share_link_enabled;
const res={};
const forms=arr((await api('GET','/web-forms')).j.data);
for(const f of forms.filter(f=>f.id===I.wf||f.name==='Tech Webform')){
  const urls={hosted:f.share_url, iframe:'https://staging-crm.taviportal.com/embed/feedback/index.html?key='+f.embed_key+'&mode=frame'};
  for(const [k,u] of Object.entries(urls)){ if(!u){res[f.name+' '+k]='no url';continue;} const r=await fetch(u,{redirect:'manual'}); const t=await r.text(); res[f.name+' '+k]=r.status+' '+(r.headers.get('server')||'')+' '+(t.match(/<title>[^<]*<\/title>/)||[''])[0]+' '+(/404 Not Found/.test(t)?'NGINX404':'')+' len'+t.length+' url='+u.replace(/(f\/|key=)[^&]+/,'$1<k>'); }
}
o.res=res; I.wfShare=d.share_url; SAVE(); return o;
