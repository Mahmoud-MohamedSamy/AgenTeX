import{Ii as e,Ly as t,fx as n,hx as r,lj as i,ux as a,vx as o}from"./index-mv9lGE1X.js";var s={failedTries:5,lockMinutes:15,rememberIdleDays:7,rememberMaxDays:14,invitationDays:30},c={failedTries:[3,5,10],lockMinutes:[5,15,60,1440],rememberIdleDays:[7,14,30],rememberMaxDays:[14,30,90],invitationDays:[7,14,30]},l={failedTries:`failed_tries`,lockMinutes:`lock_minutes`,rememberIdleDays:`remember_idle_days`,rememberMaxDays:`remember_max_days`,invitationDays:`invitation_days`},u=Object.keys(l);function ee(e){let t={...s};for(let n of u){let r=e?.[l[n]];typeof r==`number`&&c[n].includes(r)&&(t[n]=r)}return t}function te(e){return{failed_tries:e.failedTries,lock_minutes:e.lockMinutes,remember_idle_days:e.rememberIdleDays,remember_max_days:e.rememberMaxDays,invitation_days:e.invitationDays}}function ne(e,t){return u.every(n=>e[n]===t[n])}function re(e){return u.find(t=>e===`auth_policy.${l[t]}`)??null}function d(e,t,n){return t===`rememberIdleDays`&&n>e.rememberMaxDays?`idleOverMax`:t===`rememberMaxDays`&&n<e.rememberIdleDays?`maxUnderIdle`:null}function ie(e,t){let n=c[t],r=n.indexOf(e[t]);return[n[r+1],n[r-1]].filter(e=>e!==void 0).map(n=>d(e,t,n)).find(e=>e!==null)??null}function ae(e){return e>=1440&&e%1440==0?{unit:`days`,count:e/1440}:e>=60&&e%60==0?{unit:`hours`,count:e/60}:{unit:`minutes`,count:e}}var oe=[`all`,`active`,`pending_approval`,`invited`,`deactivated`];function se(e){return e===`all`?void 0:e}function ce(e){return oe.find(t=>t===e)??`all`}function le(e,t){if(t)return e===`all`?Object.values(t).reduce((e,t)=>e+(t??0),0):t[e]??0}function f(e,t){let n=[];return t.approve&&e.status===`pending_approval`&&n.push(`approve`,`reject`),t.manage&&(n.push(`edit`),e.status===`active`&&n.push(`changeEmail`),e.status===`invited`&&(t.enabled&&n.push(`resend`),n.push(`revoke`)),e.status===`active`&&n.push(`deactivate`),e.status===`deactivated`&&n.push(`reactivate`),e.locked&&n.push(`unlock`)),t.eraseCommunity&&(e.status===`active`||e.status===`deactivated`)&&n.push(`eraseCommunity`),t.manage&&n.push(`delete`),n}function ue(e,t){return e.filter(e=>f(e,t).includes(`deactivate`))}function de(e,t){return e.filter(e=>f(e,t).includes(`approve`))}var fe={approved:0,notWaiting:0,notFound:0,notAvailable:0,remaining:null};function pe(e,t){let n=t.results??[];return{approved:e.approved+n.filter(e=>e.outcome===`approved`).length,notWaiting:e.notWaiting+n.filter(e=>e.outcome===`not_waiting`).length,notFound:e.notFound+n.filter(e=>e.outcome===`not_found`).length,notAvailable:e.notAvailable+n.filter(e=>e.outcome===`unavailable`).length,remaining:t.remaining}}function me(e){return[{key:`approved`,count:e.approved},{key:`notWaiting`,count:e.notWaiting},{key:`notFound`,count:e.notFound}].filter(e=>e.key===`approved`||e.count>0)}var p=`unavailable`;async function he(e,t,n){let r=fe;try{if(`all`in t)for(;;){let t=await e({all_pending:!0}),i=r.approved;if(r=pe(r,t),n(r),r.notAvailable>0)return{tally:r,failed:!0,failure:p};if(t.remaining<=0||r.approved===i)break}else{let i=[...new Set(t.ids)];for(let t=0;t<i.length;t+=200)if(r=pe(r,await e({account_ids:i.slice(t,t+200)})),n(r),r.notAvailable>0)return{tally:r,failed:!0,failure:p}}return{tally:r,failed:!1}}catch(e){return{tally:r,failed:!0,failure:e}}}async function ge(e,t,n){let r=[...new Set(t)],i=[];for(let t=0;t<r.length;t+=50){let a=r.slice(t,t+50),o;try{o=await e(a)}catch(e){return{items:i,unsent:r.slice(t),failed:!0,failure:e}}if(i.push(...o),n(t+a.length),o.some(e=>e.outcome===`daily_limit`))return{items:i,unsent:r.slice(t+50),failed:!1}}return{items:i,unsent:[],failed:!1}}var _e=[`invited`,`email_limit`,`already_user`,`daily_limit`,`not_sent`,`shared_address`,`no_email`,`spam`,`not_found`];function ve(e){let t=e.failed?`not_sent`:`daily_limit`;return _e.map(n=>({key:n,items:e.items.filter(e=>e.outcome===n),unsent:n===t?e.unsent.length:0})).filter(e=>e.items.length+e.unsent>0)}function ye(e){let t=new Set;for(let n of e.split(/[\s,;]+/)){let e=n.trim().toLowerCase();e&&t.add(e)}return[...t]}function be(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)&&e.length<=254}function xe(e){return{invited:e.filter(e=>e.outcome===`invited`).length,alreadyUsers:e.filter(e=>e.outcome===`already_user`).length,emailLater:e.filter(e=>e.outcome===`email_limit`).length}}function Se(e){return[e.first_name,e.last_name].filter(e=>e&&e.trim()).join(` `).trim()||e.email}function Ce(e){let t=[e.first_name,e.last_name].map(e=>e?.trim()??``).filter(e=>e!==``);return(t.length>0?t.map(e=>Array.from(e)[0]).join(``):Array.from(e.email)[0]??`?`).slice(0,2).toUpperCase()}function we(e,t,n){let r={},i=[];for(let a of e){let e=/^emails\[(\d+)\]$/.exec(a.path);if(e){i.push(t[Number(e[1])]??a.path);continue}a.path===`first_name`||a.path===`last_name`?r[a.path]??=a.type===`required`?n(`settings.helpCenter.users.problems.lastName`):n(`settings.helpCenter.users.problems.name`,{max:100}):a.path===`language`?r.language??=n(`settings.helpCenter.problems.language`):a.path===`emails`?r.emails??=n(`settings.helpCenter.users.problems.count`,{max:50}):a.path===`contact_id`?r.contact_id??=n(`settings.helpCenter.users.problems.contact`):r[a.path]??=a.message}return i.length>0&&(r[`emails.bad`]=n(`settings.helpCenter.users.problems.addresses`,{addresses:i.join(`, `)})),r}var m=`/help-centers`,h=e=>`${m}/${encodeURIComponent(e)}`,g=[`help_center.invitation`,`help_center.already_registered`,`help_center.reset`,`help_center.approved`,`help_center.password_changed`,`help_center.deactivated`,`help_center.reactivated`,`help_center.email_change`,`help_center.email_changed`],Te=e=>g.includes(e),_=new class{list(){return i.get(m)}inviteTarget(){return i.get(`${m}/invite-target`)}servedDepartments(e){return i.get(`${h(e)}/served-departments`)}create(e){return i.post(m,{name:e})}save(e,t){return i.put(h(e),t)}turnOnPreview(e){return i.get(`${h(e)}/enable-preview`)}emailPreview(e,t){return i.post(`${h(e)}/email-preview`,t)}ticketFields(e){return i.get(`${h(e)}/ticket-fields`)}saveTicketFields(e,t){return i.put(`${h(e)}/ticket-fields`,t)}emailTemplates(e){return i.get(`${h(e)}/email-templates`)}saveEmailTemplate(e,t,n,r){return i.put(`${h(e)}/email-templates/${encodeURIComponent(t)}/${n}`,r)}resetEmailTemplate(e,t,n){return i.delete(`${h(e)}/email-templates/${encodeURIComponent(t)}/${n}`)}testEmail(e,t){return i.post(`${h(e)}/email-templates/test`,t)}saveDraft(e,t){return i.put(`${h(e)}/draft`,t)}publish(e,t){return i.post(`${h(e)}/publish`,{row_version:t})}discardDraft(e,t){return i.post(`${h(e)}/discard`,{row_version:t})}widgetCatalogue(e){return i.get(`${h(e)}/widget-catalogue`)}customWidgets(e,t){return i.get(`${h(e)}/custom-widgets?state=${t}`)}createCustomWidget(e,t){return i.post(`${h(e)}/custom-widgets`,t)}saveCustomWidget(e,t,n){return i.put(`${h(e)}/custom-widgets/${encodeURIComponent(t)}`,n)}trashCustomWidget(e,t){return i.delete(`${h(e)}/custom-widgets/${encodeURIComponent(t)}`)}restoreCustomWidget(e,t){return i.post(`${h(e)}/custom-widgets/${encodeURIComponent(t)}/restore`)}purgeCustomWidget(e,t){return i.delete(`${h(e)}/custom-widgets/${encodeURIComponent(t)}/purge`)}designs(e){return i.get(`${h(e)}/designs`)}createDesign(e,t){return i.post(`${h(e)}/designs`,t)}saveDesign(e,t,n){return i.put(`${h(e)}/designs/${encodeURIComponent(t)}`,n)}deleteDesign(e,t){return i.delete(`${h(e)}/designs/${encodeURIComponent(t)}`)}setEnabled(e,t){return i.post(`${h(e)}/${t?`enable`:`disable`}`)}accounts(e,t){let n=new URLSearchParams({page:String(t.page),page_size:String(t.pageSize)});return t.status&&n.set(`status`,t.status),t.search&&n.set(`search`,t.search),t.labelId&&n.set(`label_id`,t.labelId),t.groupId&&n.set(`group_id`,t.groupId),i.get(`${h(e)}/accounts?${n.toString()}`)}editAccount(e,t,n){return i.patch(`${h(e)}/accounts/${encodeURIComponent(t)}`,n)}changeAccountEmail(e,t,n){return i.post(`${h(e)}/accounts/${encodeURIComponent(t)}/email`,{email:n})}accountAction(e,t,n){return i.post(`${h(e)}/accounts/${encodeURIComponent(t)}/${n}`)}approveAccounts(e,t){return i.post(`${h(e)}/accounts/approve`,t)}labels(e){return i.get(`${h(e)}/labels`)}createLabel(e,t){return i.post(`${h(e)}/labels`,t)}saveLabel(e,t,n){return i.put(`${h(e)}/labels/${encodeURIComponent(t)}`,n)}groups(e){return i.get(`${h(e)}/groups`)}createGroup(e,t){return i.post(`${h(e)}/groups`,t)}saveGroup(e,t,n){return i.put(`${h(e)}/groups/${encodeURIComponent(t)}`,n)}deleteMemberSet(e,t,n){return i.delete(`${h(e)}/${t}/${encodeURIComponent(n)}`)}members(e,t,n,r){return i.post(`${h(e)}/${t}/${encodeURIComponent(n)}/accounts`,r)}revokeInvitation(e,t){return i.delete(`${h(e)}/accounts/${encodeURIComponent(t)}/invitation`)}deleteAccount(e,t){return i.delete(`${h(e)}/accounts/${encodeURIComponent(t)}`)}invite(e,t){return i.post(`${h(e)}/invitations`,t)}inviteContacts(e,t){return i.post(`${h(e)}/invitations/contacts`,{contact_ids:t})}};function v(e,t,n){let r=e.trim();if(!r)return`required`;if(r.length>n)return`tooLong`;let i=r.toLocaleLowerCase();return t.some(e=>e.trim().toLocaleLowerCase()===i)?`taken`:null}function Ee(e,t){return e.filter(e=>e.id!==t).map(e=>e.name)}function De(e,t){return e.some(e=>e.id===t.id)?e.map(e=>e.id===t.id?t:e):[t,...e]}function Oe(e){return e.taken!==null&&e.draft.name.trim().toLocaleLowerCase()===e.taken.toLocaleLowerCase()}function ke(e){if(!e)return!1;let t=e.from;return Object.entries(e.draft).some(([e,n])=>t[e]!==n)}var Ae=[`standard`,`harbor`,`atlas`,`paper`,`signal`,`bento`,`concierge`],je=`standard`,Me={standard:{html:`<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="#">{{logo}}<span>{{help_center_name}}</span></a>
    {{navigation}}
    {{sign_in}}
  </div>
</header>

<main>
  <section class="hero" data-hc="hero">
    <div class="wrap hero-inner">
      <h1>{{welcome_title}}</h1>
      <p class="lead">{{welcome_lead}}</p>
      {{search}}
    </div>
  </section>

  <div class="wrap content">
    {{announcement}}
    {{actions}}
    {{topics}}
    {{widgets.main}}
    {{widgets.side}}
  </div>
</main>

<footer class="site-footer">
  <div class="wrap">© {{year}} {{help_center_name}}</div>
</footer>
`,css:`body { background: #ffffff; color: #0f1312; font-family: "Onest", var(--font); }
.wrap { max-width: 1120px; margin: 0 auto; padding-inline: clamp(16px, 4vw, 32px); }

.site-header { background: rgb(255 255 255 / .86); backdrop-filter: saturate(1.4) blur(12px); border-bottom: 1px solid #e4e7e6; }
.bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 28px; min-height: 64px; padding-block: 10px; }
.brand { display: inline-flex; align-items: center; gap: 10px; min-width: 0; color: #0f1312; font-weight: 650; letter-spacing: -0.01em; text-decoration: none; }
.hc-logo { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 8px; background: var(--brand); color: var(--brand-ink); font-size: 14px; font-weight: 700; }
.hc-nav { display: flex; flex: 1; align-items: center; gap: 2px; }
.hc-nav a { display: inline-flex; align-items: center; gap: 6px; min-height: 36px; padding: 0 12px; border-radius: 8px; color: #3f4644; font-size: 15px; font-weight: 500; text-decoration: none; white-space: nowrap; }
.hc-nav a:hover, .hc-nav a[aria-current] { background: #f6f7f7; color: #0f1312; }
.hc-nav .hc-nav-icon { display: block; width: 16px; height: 16px; }
.hc-nav a[data-hc-nav="language"] { order: 1; margin-inline-start: auto; padding-inline: 10px; font-size: 14px; }
.hc-nav a[data-hc-nav="new_ticket"] { order: 2; margin-inline-start: 8px; padding-inline: 14px; background: var(--brand); color: var(--brand-ink); font-size: 14px; font-weight: 600; }
.hc-nav a[data-hc-nav="new_ticket"]:hover, .hc-nav a[data-hc-nav="new_ticket"][aria-current] { background: var(--brand); color: var(--brand-ink); opacity: .92; }
.hc-nav:not(:has([data-hc-nav="language"])) a[data-hc-nav="new_ticket"] { margin-inline-start: auto; }
.hc-sign-in { padding: 6px 4px; color: #3f4644; font-weight: 500; text-decoration: none; }
.hc-sign-in:hover { color: #0f1312; }

.hero { background: radial-gradient(900px 300px at 50% -60px, color-mix(in srgb, var(--brand) 14%, #fff), transparent 72%), linear-gradient(to bottom, color-mix(in srgb, var(--brand) 8%, #fff), #fff); }
.hero-inner { display: grid; justify-items: center; padding-block: clamp(40px, 8vw, 80px) clamp(36px, 5vw, 52px); text-align: center; }
.hero h1 { font-size: clamp(32px, 5vw, 48px); font-weight: 650; line-height: 1.08; letter-spacing: -0.035em; }
.lead { margin-block: 12px 28px; color: #3f4644; font-size: clamp(16px, 1.6vw, 18px); }
.hc-search { display: flex; align-items: center; gap: 10px; width: 100%; max-width: 720px; min-height: 58px; padding-block: 6px; padding-inline: 18px 6px; border: 1px solid #c9cfcc; border-radius: 14px; background: #fff; color: #646c69; box-shadow: 0 1px 2px rgb(16 24 22 / .08), 0 20px 44px -24px color-mix(in srgb, var(--brand) 40%, transparent); }
.hc-search input { flex: 1; min-width: 0; height: 44px; border: 0; outline: 0; background: none; color: #0f1312; font-size: 17px; }
.hc-search button { height: 44px; padding-inline: 18px; border: 0; border-radius: 10px; background: var(--brand); color: var(--brand-ink); font-weight: 600; }

.content { display: grid; align-content: start; gap: 44px; padding-block: 0 64px; }
.hc-announcement { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 12px; background: #fff4dc; color: #8a4b00; font-size: 14px; }
.hc-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 14px; }
.hc-action { display: flex; align-items: center; gap: 14px; padding: 18px 20px; border: 1px solid #e4e7e6; border-radius: 16px; background: #fff; color: #646c69; text-decoration: none; transition: border-color .16s, box-shadow .16s; }
.hc-action:hover { border-color: #c9cfcc; box-shadow: 0 1px 2px rgb(16 24 22 / .08), 0 12px 32px -16px rgb(16 24 22 / .08); }
.hc-action-icon { display: grid; place-items: center; flex: none; width: 42px; height: 42px; border-radius: 11px; background: color-mix(in srgb, var(--brand) 8%, #fff); color: var(--brand); }
.hc-action[data-hc-action="new_ticket"] .hc-action-icon { background: var(--brand); color: var(--brand-ink); }
.hc-action-body { display: grid; flex: 1; gap: 2px; min-width: 0; }
.hc-action-title { color: #0f1312; font-weight: 600; }
.hc-action-text { font-size: 14px; }
.hc-action-arrow { color: #c9cfcc; }
.hc-action-arrow:dir(rtl) { transform: scaleX(-1); }
.hc-section-title { margin-bottom: 18px; font-size: 18px; font-weight: 650; letter-spacing: -0.01em; }
.hc-topics { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
.hc-topic a { display: grid; grid-template-columns: auto 1fr; column-gap: 14px; align-items: center; height: 100%; padding: 18px 20px; border: 1px solid #e4e7e6; border-radius: 16px; background: #fff; text-decoration: none; transition: border-color .16s, box-shadow .16s; }
.hc-topic a:hover { border-color: #c9cfcc; box-shadow: 0 12px 32px -16px rgb(16 24 22 / .12); }
.hc-topic-icon { display: grid; grid-row: span 2; place-items: center; width: 42px; height: 42px; border-radius: 11px; background: #eef0ef; color: #3f4644; }
.hc-topic-name { color: #0f1312; font-weight: 600; }
.hc-topic-count { color: #646c69; font-size: 13px; }

.site-footer { padding-block: 24px; border-top: 1px solid #e4e7e6; color: #646c69; font-size: 14px; }

@media (max-width: 760px) {
  .bar { gap: 6px 16px; }
  .hc-sign-in { margin-inline-start: auto; }
  .hc-nav { order: 3; flex: 1 0 100%; flex-wrap: wrap; }
  .hc-nav { gap: 0; }
  .hc-nav a { flex: none; padding-inline: 8px; }
  /* The language and ticket form links keep only their icon; their words stay their accessible names. */
  .hc-nav a[data-hc-nav="language"], .hc-nav a[data-hc-nav="new_ticket"] { gap: 0; padding-inline: 9px; font-size: 0; }
  .hc-actions, .hc-topics { grid-template-columns: 1fr; }
}
`},harbor:{html:`<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="#">{{logo}}<span>{{help_center_name}}</span></a>
    {{navigation}}
    {{sign_in}}
  </div>
</header>

<main>
  <section class="hero" data-hc="hero">
    <div class="wrap">
      <h1>{{welcome_title}}</h1>
      <p class="lead">{{welcome_lead}}</p>
      {{search}}
    </div>
  </section>

  <div class="wrap content">
    {{announcement}}
    {{topics}}
    {{widgets.main}}
    <div class="split">
      {{popular_articles}}
      {{contact}}
      {{widgets.side}}
    </div>
  </div>
</main>

<footer class="site-footer">
  <div class="wrap">© {{year}} {{help_center_name}}</div>
</footer>
`,css:`body { background: #f8fafc; color: #0f172a; }
.wrap { max-width: 1080px; margin: 0 auto; padding-inline: 32px; }

.site-header { background: var(--brand); color: var(--brand-ink); }
.header-row { display: flex; align-items: center; gap: 28px; height: 64px; }
.brand { display: flex; align-items: center; gap: 10px; font-weight: 650; text-decoration: none; }
.hc-logo { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 8px; background: color-mix(in srgb, var(--brand-ink) 18%, transparent); font-size: 14px; font-weight: 700; }
.hc-nav { display: flex; flex: 1; gap: 4px; }
.hc-nav a { padding: 6px 12px; border-radius: 8px; font-size: 14px; text-decoration: none; opacity: .85; }
.hc-nav a[aria-current] { opacity: 1; background: color-mix(in srgb, var(--brand-ink) 14%, transparent); }
.hc-sign-in { padding: 7px 14px; border-radius: 8px; background: var(--brand-ink); color: var(--brand); font-size: 14px; font-weight: 600; text-decoration: none; }

.hero { padding-block: 72px 64px; text-align: center; background: linear-gradient(180deg, var(--brand-soft), #f8fafc); }
.hero h1 { font-size: 40px; line-height: 1.15; letter-spacing: -0.02em; }
.lead { margin-top: 12px; color: #475569; font-size: 17px; }
.hc-search { display: flex; align-items: center; gap: 10px; max-width: 600px; margin: 28px auto 0; padding-block: 6px; padding-inline: 16px 6px; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; box-shadow: 0 10px 30px -12px rgb(15 23 42 / .18); }
.hc-search-icon { color: #94a3b8; }
.hc-search input { flex: 1; min-width: 0; height: 44px; border: 0; outline: 0; background: none; font-size: 16px; }
.hc-search button { height: 44px; padding-inline: 20px; border: 0; border-radius: 10px; background: var(--brand); color: var(--brand-ink); font-weight: 600; }

.content { display: grid; gap: 40px; padding-block: 40px 64px; }
.hc-announcement { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border: 1px solid #fde68a; border-radius: 12px; background: #fffbeb; color: #78350f; font-size: 14px; }
.hc-section-title { margin-bottom: 16px; font-size: 20px; letter-spacing: -0.01em; }
.hc-topics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.hc-topic a { display: grid; grid-template-columns: auto 1fr; column-gap: 14px; height: 100%; padding: 20px; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; text-decoration: none; transition: border-color .15s, box-shadow .15s, transform .15s; }
.hc-topic a:hover { border-color: color-mix(in srgb, var(--brand) 40%, #e2e8f0); box-shadow: 0 8px 24px -12px rgb(15 23 42 / .2); transform: translateY(-1px); }
.hc-topic-icon { grid-row: span 2; display: grid; place-items: center; width: 42px; height: 42px; border-radius: 10px; background: var(--brand-soft); color: var(--brand); }
.hc-topic-name { font-weight: 600; }
.hc-topic-count { color: #64748b; font-size: 13px; }

.split { display: grid; grid-template-columns: 1.6fr 1fr; gap: 24px; align-items: start; }
.hc-articles { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; }
.hc-articles li + li { border-top: 1px solid #f1f5f9; }
.hc-articles a { display: flex; align-items: center; gap: 12px; padding: 14px 18px; font-size: 15px; text-decoration: none; }
.hc-articles a:hover { color: var(--brand); }
.hc-article-icon { color: #94a3b8; }
.hc-contact { padding: 24px; border-radius: 14px; background: var(--brand); color: var(--brand-ink); }
.hc-contact-icon { display: block; margin-bottom: 14px; }
.hc-contact .hc-section-title { margin-bottom: 6px; }
.hc-contact p { font-size: 14px; opacity: .85; }
.hc-button { display: inline-flex; margin-top: 18px; padding: 10px 16px; border-radius: 10px; background: var(--brand-ink); color: var(--brand); font-size: 14px; font-weight: 600; text-decoration: none; }

.site-footer { padding-block: 24px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 13px; }

@media (max-width: 760px) {
  .wrap { padding-inline: 18px; }
  .header-row { flex-wrap: wrap; justify-content: space-between; gap: 6px 16px; height: auto; padding-block: 12px 8px; }
  .hc-nav { order: 3; flex: 1 0 100%; overflow-x: auto; margin-inline: -12px; scrollbar-width: none; }
  .hc-nav a { flex: none; white-space: nowrap; }
  .hero { padding-block: 44px 40px; }
  .hero h1 { font-size: 30px; }
  .hc-topics, .split { grid-template-columns: 1fr; }
}
`},atlas:{html:`<header class="bar">
  <a class="brand" href="#">{{logo}}<span>{{help_center_name}}</span></a>
  {{navigation}}
  {{sign_in}}
</header>

<main>
  <div class="hero" data-hc="hero">
    <div class="hero-copy">
      <p class="eyebrow">{{help_center_name}}</p>
      <h1>{{welcome_title}}</h1>
      <p class="lead">{{welcome_lead}}</p>
      {{search}}
    </div>
  </div>

  <div class="body">
    {{topics}}
    {{widgets.main}}
    <div class="row">
      {{popular_articles}}
      <div class="side">
        {{announcement}}
        {{contact}}
        {{widgets.side}}
      </div>
    </div>
  </div>
</main>

<footer class="foot">{{help_center_name}} · {{year}}</footer>
`,css:`body { background: #fff; color: #111; }

.hero { position: relative; overflow: hidden; padding-inline: 56px; padding-bottom: 128px; background: var(--brand); color: var(--brand-ink); }
.hero::after { content: ""; position: absolute; inset-inline-end: -120px; top: -160px; width: 560px; height: 560px; border-radius: 50%; background: radial-gradient(circle, color-mix(in srgb, var(--brand-ink) 22%, transparent), transparent 65%); pointer-events: none; }
.bar { position: relative; z-index: 2; display: flex; align-items: center; gap: 32px; height: 76px; padding-inline: 56px; background: var(--brand); color: var(--brand-ink); }
.brand { display: flex; align-items: center; gap: 12px; font-size: 18px; font-weight: 800; letter-spacing: -0.01em; text-decoration: none; }
.hc-logo { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: var(--brand-ink); color: var(--brand); font-weight: 800; }
.hc-nav { display: flex; flex: 1; gap: 24px; font-size: 15px; }
.hc-nav a { text-decoration: none; opacity: .75; }
.hc-nav a[aria-current] { opacity: 1; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 6px; }
.hc-sign-in { padding: 10px 18px; border: 1.5px solid currentColor; border-radius: 999px; font-size: 14px; font-weight: 600; text-decoration: none; }

.hero-copy { position: relative; z-index: 1; max-width: 760px; padding-top: 48px; }
.eyebrow { font-size: 13px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; opacity: .7; }
.hero h1 { margin-top: 14px; font-size: 64px; font-weight: 800; line-height: 1.02; letter-spacing: -0.035em; }
.lead { max-width: 560px; margin-top: 18px; font-size: 19px; opacity: .85; }
.hc-search { display: flex; align-items: center; gap: 12px; max-width: 640px; height: 64px; margin-top: 36px; padding-inline: 22px 8px; border-radius: 16px; background: #fff; color: #111; box-shadow: 0 24px 48px -20px rgb(0 0 0 / .45); }
.hc-search-icon { color: var(--brand); }
.hc-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: none; font-size: 17px; }
.hc-search button { height: 48px; padding-inline: 24px; border: 0; border-radius: 12px; background: #111; color: #fff; font-weight: 700; }

.body { position: relative; max-width: 1160px; margin: -72px auto 0; padding: 0 56px 80px; }
.hc-topics-block > .hc-section-title { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.hc-topics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; overflow: hidden; border-radius: 22px; background: #e9e9ee; box-shadow: 0 30px 60px -30px rgb(0 0 0 / .35); }
.hc-topic a { display: flex; flex-direction: column; gap: 6px; height: 100%; padding: 28px; background: #fff; text-decoration: none; transition: background .15s; }
.hc-topic a:hover { background: color-mix(in srgb, var(--brand) 6%, #fff); }
.hc-topic-icon { display: grid; place-items: center; width: 48px; height: 48px; margin-bottom: 12px; border-radius: 14px; background: var(--brand); color: var(--brand-ink); }
.hc-topic-name { font-size: 18px; font-weight: 700; letter-spacing: -0.01em; }
.hc-topic-count { color: #6b6b76; font-size: 14px; }

.row { display: grid; grid-template-columns: 1.5fr 1fr; gap: 48px; margin-top: 64px; }
.hc-section-title { margin-bottom: 18px; font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
.hc-articles a { display: flex; align-items: center; gap: 14px; padding-block: 16px; border-bottom: 1px solid #ececf1; font-size: 16px; font-weight: 500; text-decoration: none; }
.hc-articles a:hover { color: var(--brand); }
.hc-article-icon { color: var(--brand); }
.side { display: grid; align-content: start; gap: 16px; }
.body > .hc-widgets { margin-top: 64px; }
.hc-announcement { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 18px 20px; border-radius: 16px; background: #f4f4f6; font-size: 14px; }
.hc-announcement-icon { display: none; }
.hc-announcement strong { padding: 2px 8px; border-radius: 999px; background: var(--brand); color: var(--brand-ink); font-size: 12px; }
.hc-contact { padding: 28px; border-radius: 20px; background: #111; color: #fff; }
.hc-contact-icon { display: none; }
.hc-contact .hc-section-title { margin-bottom: 8px; font-size: 22px; }
.hc-contact p { color: #b4b4bf; }
.hc-button { display: inline-flex; margin-top: 20px; padding: 12px 20px; border-radius: 999px; background: var(--brand); color: var(--brand-ink); font-weight: 700; text-decoration: none; }

.foot { padding: 32px 56px; border-top: 1px solid #ececf1; color: #6b6b76; font-size: 14px; }

@media (max-width: 760px) {
  .hero { padding-inline: 20px; padding-bottom: 96px; }
  .bar { flex-wrap: wrap; justify-content: space-between; gap: 8px 16px; height: auto; padding: 18px 20px 4px; }
  .hc-nav { order: 3; flex: 1 0 100%; gap: 20px; overflow-x: auto; padding-block: 6px 10px; font-size: 14px; scrollbar-width: none; }
  .hc-nav a { flex: none; white-space: nowrap; }
  .hero-copy { padding-top: 20px; }
  .hero h1 { font-size: 40px; }
  .hc-search { height: 56px; }
  .hc-search button { display: none; }
  .body { padding: 0 20px 56px; }
  .hc-topics { grid-template-columns: 1fr 1fr; border-radius: 18px; }
  .hc-topic a { gap: 2px; padding: 18px 16px; }
  .hc-topic-icon { width: 38px; height: 38px; margin-bottom: 8px; border-radius: 11px; }
  .hc-topic-name { font-size: 16px; }
  .hc-topic-count { font-size: 13px; }
  .row { grid-template-columns: 1fr; }
  .foot { padding: 24px 20px; }
}
`},paper:{html:`<header class="masthead">
  <a class="title" href="#">{{help_center_name}}</a>
  {{navigation}}
  {{sign_in}}
</header>

<main class="page">
  <section class="intro" data-hc="hero">
    <h1>{{welcome_title}}</h1>
    <p>{{welcome_lead}}</p>
    {{search}}
  </section>

  {{announcement}}

  <div class="columns">
    {{topics}}
    {{popular_articles}}
  </div>

  {{widgets.main}}

  {{contact}}
  {{widgets.side}}
</main>

<footer class="colophon">{{help_center_name}}, {{year}}</footer>
`,css:`:root { --serif: Georgia, "Times New Roman", "Noto Naskh Arabic", serif; --ink: #1c1917; --muted: #78716c; --rule: #e7e5e4; }
body { background: #faf8f3; color: var(--ink); }

.masthead { display: flex; align-items: baseline; gap: 32px; padding-block: 36px 20px; padding-inline: max(40px, calc((100% - 900px) / 2)); border-bottom: 1px solid var(--ink); }
.title { font-family: var(--serif); font-size: 26px; font-style: italic; text-decoration: none; }
.hc-nav { display: flex; flex: 1; gap: 22px; font-size: 14px; }
.hc-nav a { color: #57534e; text-decoration: none; }
.hc-nav a[aria-current] { color: var(--ink); box-shadow: inset 0 -2px var(--brand); }
.hc-sign-in { color: var(--brand); font-size: 14px; text-underline-offset: 4px; }

.page { max-width: 980px; margin: 0 auto; padding: 0 40px 72px; }
.intro { max-width: 680px; padding-block: 72px 48px; }
.intro h1 { font-family: var(--serif); font-size: 58px; font-weight: 400; line-height: 1.05; letter-spacing: -0.02em; }
.intro p { margin-top: 18px; color: #57534e; font-size: 19px; }
.hc-search { display: flex; align-items: center; gap: 12px; margin-top: 36px; padding-bottom: 8px; border-bottom: 2px solid var(--ink); }
.hc-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: none; font-family: var(--serif); font-size: 20px; }
.hc-search input::placeholder { color: #a8a29e; font-style: italic; }
.hc-search button { border: 0; background: none; color: var(--brand); font-size: 13px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }

.hc-announcement { display: flex; align-items: baseline; gap: 12px; padding-block: 16px; border-block: 1px solid var(--rule); font-size: 15px; }
.hc-announcement-icon { display: none; }
.hc-announcement strong { color: var(--brand); font-size: 12px; letter-spacing: .12em; text-transform: uppercase; }

.columns { display: grid; grid-template-columns: 1.3fr 1fr; gap: 64px; padding-top: 48px; }
.page > .hc-widgets { padding-top: 48px; }
.hc-section-title { margin-bottom: 4px; padding-bottom: 12px; border-bottom: 1px solid var(--ink); color: var(--muted); font-size: 12px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.hc-topics { counter-reset: topic; }
.hc-topic a { display: flex; align-items: baseline; gap: 14px; padding-block: 16px; border-bottom: 1px solid var(--rule); text-decoration: none; }
.hc-topic a::before { counter-increment: topic; content: counter(topic, decimal-leading-zero); color: #a8a29e; font-family: var(--serif); font-size: 15px; font-style: italic; }
.hc-topic-icon { display: none; }
.hc-topic-name { flex: 1; font-family: var(--serif); font-size: 22px; }
.hc-topic a:hover .hc-topic-name { color: var(--brand); }
.hc-topic-count { color: var(--muted); font-size: 13px; }
.hc-articles a { display: block; padding-block: 14px; border-bottom: 1px solid var(--rule); font-size: 16px; line-height: 1.4; text-decoration: none; }
.hc-articles a:hover { color: var(--brand); text-decoration: underline; text-underline-offset: 4px; }
.hc-article-icon { display: none; }

.hc-contact { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 4px 32px; margin-top: 64px; padding: 40px; background: var(--ink); color: #faf8f3; }
.hc-contact-icon { display: none; }
.hc-contact .hc-section-title { margin: 0; padding: 0; border: 0; color: #a8a29e; }
.hc-contact p { font-family: var(--serif); font-size: 24px; }
.hc-button { grid-column: 2; grid-row: 1 / span 2; padding: 14px 22px; background: var(--brand); color: var(--brand-ink); font-weight: 600; text-decoration: none; }

.colophon { padding-block: 24px 48px; padding-inline: max(40px, calc((100% - 900px) / 2)); color: var(--muted); font-family: var(--serif); font-style: italic; }

@media (max-width: 760px) {
  .masthead { flex-wrap: wrap; gap: 12px 20px; padding: 24px 20px 16px; }
  .hc-nav { order: 3; flex-basis: 100%; overflow-x: auto; scrollbar-width: none; }
  .hc-nav a { flex: none; white-space: nowrap; }
  .hc-sign-in { margin-inline-start: auto; }
  .page { padding: 0 20px 56px; }
  .intro { padding-block: 40px 32px; }
  .intro h1 { font-size: 40px; }
  .columns { grid-template-columns: 1fr; gap: 40px; }
  .hc-contact { grid-template-columns: 1fr; padding: 28px; }
  .hc-button { grid-column: 1; grid-row: auto; justify-self: start; margin-top: 16px; }
  .colophon { padding: 20px; }
}
`},signal:{html:`<header class="nav">
  <div class="shell nav-row">
    <a class="brand" href="#">{{logo}}<span>{{help_center_name}}</span></a>
    {{navigation}}
    {{sign_in}}
  </div>
</header>

<main>
  <section class="hero" data-hc="hero">
    <div class="glow" aria-hidden="true"></div>
    <div class="shell hero-inner">
      {{announcement}}
      <h1>{{welcome_title}}</h1>
      <p class="lead">{{welcome_lead}}</p>
      {{search}}
    </div>
  </section>

  <div class="shell main">
    {{topics}}
    {{widgets.main}}
    <div class="pair">
      {{popular_articles}}
      {{contact}}
      {{widgets.side}}
    </div>
  </div>
</main>

<footer class="foot">
  <div class="shell foot-row">
    <span>{{help_center_name}}</span>
    <span>© {{year}}</span>
  </div>
</footer>
`,css:`body { background: #09090b; color: #fafafa; }
.shell { max-width: 1120px; margin: 0 auto; padding-inline: 32px; }

.nav { position: sticky; top: 0; z-index: 2; border-bottom: 1px solid #1f1f23; background: rgb(9 9 11 / .72); backdrop-filter: blur(12px); }
.nav-row { display: flex; align-items: center; gap: 28px; height: 60px; }
.brand { display: flex; align-items: center; gap: 10px; font-weight: 600; text-decoration: none; }
.hc-logo { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 7px; background: var(--brand); color: var(--brand-ink); font-size: 13px; font-weight: 700; }
.hc-nav { display: flex; flex: 1; gap: 2px; font-size: 14px; }
.hc-nav a { padding: 6px 10px; border-radius: 6px; color: #a1a1aa; text-decoration: none; }
.hc-nav a:hover, .hc-nav a[aria-current] { background: #18181b; color: #fafafa; }
.hc-sign-in { padding: 7px 14px; border-radius: 8px; background: #fafafa; color: #09090b; font-size: 14px; font-weight: 600; text-decoration: none; }

.hero { position: relative; overflow: hidden; padding-block: 88px 72px; border-bottom: 1px solid #1f1f23; text-align: center; }
.hero::before { content: ""; position: absolute; inset: 0; background-image: linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px); background-size: 48px 48px; mask-image: radial-gradient(ellipse at top, #000 30%, transparent 75%); pointer-events: none; }
.glow { position: absolute; inset: -40% 10% auto; height: 520px; background: radial-gradient(closest-side, color-mix(in srgb, var(--brand) 55%, transparent), transparent); filter: blur(40px); opacity: .55; pointer-events: none; }
.hero-inner { position: relative; display: flex; flex-direction: column; align-items: center; }
.hc-announcement { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 28px; padding-block: 5px; padding-inline: 6px 14px; border: 1px solid #27272a; border-radius: 999px; background: #18181b; color: #d4d4d8; font-size: 13px; }
.hc-announcement-icon { display: none; }
.hc-announcement strong { padding: 2px 10px; border-radius: 999px; background: color-mix(in srgb, var(--brand) 25%, transparent); color: color-mix(in srgb, var(--brand) 60%, #fff); font-size: 12px; }
.hero h1 { max-width: 760px; font-size: 56px; font-weight: 700; line-height: 1.05; letter-spacing: -0.04em; background: linear-gradient(180deg, #fff 30%, #a1a1aa); -webkit-background-clip: text; background-clip: text; color: transparent; }
.lead { margin-top: 18px; color: #a1a1aa; font-size: 18px; }
.hc-search { display: flex; align-items: center; gap: 10px; width: 100%; max-width: 580px; height: 52px; margin-top: 36px; padding-inline: 16px 8px; border: 1px solid #27272a; border-radius: 12px; background: #111113; box-shadow: 0 0 0 4px #ffffff05, 0 20px 50px -20px color-mix(in srgb, var(--brand) 60%, transparent); }
.hc-search-icon { color: #71717a; }
.hc-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: none; font-size: 15px; }
.hc-search input::placeholder { color: #71717a; }
.hc-search button { height: 36px; padding-inline: 14px; border: 1px solid #3f3f46; border-radius: 8px; background: #18181b; color: #e4e4e7; font-size: 13px; font-weight: 500; }

.main { display: grid; gap: 56px; padding-block: 64px 80px; }
.hc-section-title { margin-bottom: 18px; color: #71717a; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; }
.hc-topics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.hc-topic a { display: flex; flex-direction: column; gap: 4px; height: 100%; padding: 22px; border: 1px solid #1f1f23; border-radius: 14px; background: linear-gradient(180deg, #111113, #0c0c0e); text-decoration: none; transition: border-color .2s; }
.hc-topic a:hover { border-color: color-mix(in srgb, var(--brand) 60%, #1f1f23); }
.hc-topic-icon { display: grid; place-items: center; width: 36px; height: 36px; margin-bottom: 14px; border: 1px solid #27272a; border-radius: 9px; background: #18181b; color: color-mix(in srgb, var(--brand) 70%, #fff); }
.hc-topic-name { font-weight: 600; }
.hc-topic-count { color: #71717a; font-size: 13px; }

.pair { display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; }
.hc-articles { overflow: hidden; border: 1px solid #1f1f23; border-radius: 14px; }
.hc-articles li + li { border-top: 1px solid #1f1f23; }
.hc-articles a { display: flex; align-items: center; gap: 12px; padding: 14px 18px; color: #d4d4d8; font-size: 15px; text-decoration: none; }
.hc-articles a:hover { background: #111113; color: #fff; }
.hc-article-icon { color: #52525b; }
.hc-contact { padding: 28px; border: 1px solid transparent; border-radius: 14px; background: linear-gradient(#111113, #111113) padding-box, linear-gradient(135deg, var(--brand), #27272a 60%) border-box; }
.hc-contact-icon { display: grid; place-items: center; width: 36px; height: 36px; margin-bottom: 16px; border-radius: 9px; background: var(--brand); color: var(--brand-ink); }
.hc-contact .hc-section-title { margin-bottom: 6px; color: #fafafa; font-family: inherit; font-size: 20px; letter-spacing: -0.01em; text-transform: none; }
.hc-contact p { color: #a1a1aa; font-size: 15px; }
.hc-button { display: inline-flex; margin-top: 20px; padding: 9px 16px; border-radius: 8px; background: var(--brand); color: var(--brand-ink); font-size: 14px; font-weight: 600; text-decoration: none; }

.foot { border-top: 1px solid #1f1f23; color: #85858e; font-size: 13px; }
.foot-row { display: flex; justify-content: space-between; padding-block: 28px; }

@media (max-width: 760px) {
  .shell { padding-inline: 18px; }
  .nav-row { flex-wrap: wrap; justify-content: space-between; gap: 4px 16px; height: auto; padding-block: 10px 6px; }
  .hc-nav { order: 3; flex: 1 0 100%; overflow-x: auto; margin-inline: -10px; scrollbar-width: none; }
  .hc-nav a { flex: none; white-space: nowrap; }
  .hero { padding-block: 56px 48px; }
  .hero h1 { font-size: 36px; }
  .hc-topics { grid-template-columns: 1fr 1fr; gap: 10px; }
  .hc-topic a { padding: 16px; }
  .hc-topic-icon { width: 32px; height: 32px; margin-bottom: 10px; }
  .pair { grid-template-columns: 1fr; }
}
`},bento:{html:`<header class="top">
  <a class="brand" href="#">{{logo}}<span>{{help_center_name}}</span></a>
  {{navigation}}
  {{sign_in}}
</header>

<main class="bento">
  <section class="tile hero" data-hc="hero">
    <h1>{{welcome_title}}</h1>
    <p>{{welcome_lead}}</p>
    {{search}}
  </section>
  <div class="tile note">{{announcement}}</div>
  <div class="tile contact">{{contact}}</div>
  <div class="topics">{{topics}}</div>
  <div class="tile popular">{{popular_articles}}</div>
  <div class="widgets">{{widgets.main}}</div>
  <div class="tile side">{{widgets.side}}</div>
</main>

<footer class="bottom">{{help_center_name}} · {{year}}</footer>
`,css:`body { background: #f2f2f0; color: #18181b; }

.top { display: flex; align-items: center; gap: 24px; padding-block: 22px; padding-inline: max(28px, calc((100% - 1124px) / 2)); }
.brand { display: flex; align-items: center; gap: 10px; font-weight: 700; text-decoration: none; }
.hc-logo { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 10px; background: #18181b; color: #fff; font-weight: 800; }
.hc-nav { display: flex; gap: 2px; margin-inline: auto; padding: 4px; border-radius: 999px; background: #fff; box-shadow: 0 1px 2px rgb(0 0 0 / .06); }
.hc-nav a { padding: 7px 16px; border-radius: 999px; color: #52525b; font-size: 14px; text-decoration: none; }
.hc-nav a[aria-current] { background: #18181b; color: #fff; }
.hc-sign-in { padding: 9px 16px; border-radius: 999px; background: var(--brand); color: var(--brand-ink); font-size: 14px; font-weight: 600; text-decoration: none; }

.bento { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; max-width: 1180px; margin: 0 auto; padding: 8px 28px 48px; }
.tile { padding: 28px; border-radius: 26px; background: #fff; }
.hero { position: relative; overflow: hidden; grid-column: span 3; grid-row: span 2; display: flex; flex-direction: column; justify-content: flex-end; min-height: 340px; background: var(--brand); color: var(--brand-ink); }
.hero::before { content: ""; position: absolute; inset-inline-end: -60px; top: -60px; width: 300px; height: 300px; border-radius: 40% 60% 55% 45%; background: color-mix(in srgb, var(--brand-ink) 14%, transparent); }
.hero > * { position: relative; }
.hero h1 { max-width: 620px; font-size: 52px; font-weight: 800; line-height: 1; letter-spacing: -0.035em; }
.hero p { margin-top: 14px; font-size: 17px; opacity: .85; }
.hc-search { display: flex; align-items: center; gap: 10px; max-width: 560px; height: 56px; margin-top: 28px; padding-inline: 18px 6px; border-radius: 999px; background: #fff; color: #18181b; }
.hc-search-icon { color: #a1a1aa; }
.hc-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: none; font-size: 16px; }
.hc-search button { height: 44px; padding-inline: 22px; border: 0; border-radius: 999px; background: #18181b; color: #fff; font-weight: 600; }

.note { background: #fef3c7; }
.hc-announcement { display: flex; flex-direction: column; gap: 10px; color: #78350f; font-size: 15px; }
.hc-announcement-icon { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; background: #fde68a; }
.hc-announcement strong { font-size: 18px; }
.contact { background: #18181b; color: #fff; }
.hc-contact-icon { display: grid; place-items: center; width: 40px; height: 40px; margin-bottom: 12px; border-radius: 12px; background: #27272a; }
.hc-contact .hc-section-title { margin: 0 0 6px; font-size: 20px; }
.hc-contact p { color: #a1a1aa; font-size: 14px; }
.hc-button { display: inline-flex; margin-top: 16px; padding: 10px 18px; border-radius: 999px; background: #fff; color: #18181b; font-size: 14px; font-weight: 600; text-decoration: none; }

.topics { grid-column: span 4; }
.hc-section-title { margin-bottom: 16px; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
.topics .hc-section-title { padding: 18px 4px 0; }
.hc-topics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.hc-topic a { display: flex; flex-direction: column; gap: 4px; min-height: 160px; padding: 24px; border-radius: 26px; background: #fff; text-decoration: none; transition: transform .2s; }
.hc-topic a:hover { transform: scale(1.015); }
.hc-topic-icon { display: grid; place-items: center; width: 44px; height: 44px; margin-bottom: auto; border-radius: 14px; background: var(--brand-soft); color: var(--brand); }
.hc-topic:nth-child(2) .hc-topic-icon { background: #dcfce7; color: #15803d; }
.hc-topic:nth-child(3) .hc-topic-icon { background: #fce7f3; color: #be185d; }
.hc-topic:nth-child(4) .hc-topic-icon { background: #e0e7ff; color: #4338ca; }
.hc-topic:nth-child(5) .hc-topic-icon { background: #ffedd5; color: #c2410c; }
.hc-topic:nth-child(6) .hc-topic-icon { background: #ccfbf1; color: #0f766e; }
.hc-topic-name { margin-top: 20px; font-size: 17px; font-weight: 700; }
.hc-topic-count { color: #71717a; font-size: 13px; }

.popular { grid-column: span 4; }
.widgets, .side { grid-column: span 4; }
.hc-articles { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0 32px; }
.hc-articles a { display: flex; align-items: center; gap: 12px; padding-block: 12px; border-bottom: 1px solid #f0f0ee; text-decoration: none; }
.hc-article-icon { color: var(--brand); }

.bottom { padding-block: 8px 40px; padding-inline: max(28px, calc((100% - 1124px) / 2)); color: #66666e; font-size: 13px; }

@media (max-width: 760px) {
  .top { flex-wrap: wrap; padding: 16px 16px 8px; }
  .hc-nav { order: 3; width: 100%; margin: 0; justify-content: space-between; overflow-x: auto; scrollbar-width: none; }
  .hc-nav a { flex: none; padding-inline: 12px; white-space: nowrap; }
  .hc-sign-in { margin-inline-start: auto; }
  .bento { grid-template-columns: 1fr; padding: 8px 16px 32px; }
  .hero, .topics, .popular, .widgets, .side { grid-column: auto; grid-row: auto; }
  .hero { min-height: 0; }
  .hero h1 { font-size: 36px; }
  .hc-topics { grid-template-columns: 1fr 1fr; }
  .hc-articles { grid-template-columns: 1fr; }
  .bottom { padding: 8px 16px 32px; }
}
`},concierge:{html:`{{announcement}}
<header class="header">
  <a class="brand" href="#">{{logo}}<span>{{help_center_name}}</span></a>
  {{navigation}}
  {{sign_in}}
</header>

<main>
  <section class="welcome" data-hc="hero">
    <div class="copy">
      <h1>{{welcome_title}}</h1>
      <p>{{welcome_lead}}</p>
      {{search}}
    </div>
    <div class="card">{{contact}}{{widgets.side}}</div>
  </section>

  <div class="lower">
    {{topics}}
    {{popular_articles}}
    {{widgets.main}}
  </div>
</main>

<footer class="footer">© {{year}} {{help_center_name}}</footer>
`,css:`body { background: #fffaf5; color: #2b2118; }

.hc-announcement { display: flex; justify-content: center; align-items: center; gap: 10px; padding: 10px 20px; background: var(--brand); color: var(--brand-ink); font-size: 14px; }
.hc-announcement strong { font-weight: 700; }
.header { display: flex; align-items: center; gap: 28px; padding-block: 22px; padding-inline: max(32px, calc((100% - 1056px) / 2)); }
.brand { display: flex; align-items: center; gap: 10px; font-size: 17px; font-weight: 700; text-decoration: none; }
.hc-logo { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: var(--brand-soft); color: var(--brand); font-weight: 800; box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--brand) 25%, transparent); }
.hc-nav { display: flex; flex: 1; justify-content: center; gap: 24px; font-size: 15px; }
.hc-nav a { color: #7a6a5c; text-decoration: none; }
.hc-nav a[aria-current] { color: #2b2118; font-weight: 600; }
.hc-sign-in { padding: 10px 20px; border-radius: 999px; background: #2b2118; color: #fffaf5; font-size: 14px; font-weight: 600; text-decoration: none; }

.welcome { display: grid; grid-template-columns: 1.4fr 1fr; align-items: center; gap: 48px; max-width: 1120px; margin: 0 auto; padding: 48px 32px 72px; }
.welcome > * { min-width: 0; }
.copy h1 { font-size: 54px; font-weight: 750; line-height: 1.05; letter-spacing: -0.03em; }
.copy p { margin-top: 16px; color: #7a6a5c; font-size: 18px; }
.hc-search { display: flex; align-items: center; gap: 10px; height: 60px; margin-top: 32px; padding-inline: 22px 8px; border-radius: 999px; background: #fff; box-shadow: 0 1px 0 #f0e6dc, 0 18px 40px -18px rgb(80 50 20 / .25); }
.hc-search-icon { color: #b8a898; }
.hc-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: none; font-size: 16px; }
.hc-search button { height: 44px; padding-inline: 22px; border: 0; border-radius: 999px; background: var(--brand); color: var(--brand-ink); font-weight: 600; }
.card { padding: 32px; border-radius: 28px; background: #fff; box-shadow: 0 30px 60px -30px rgb(80 50 20 / .3); transform: rotate(-1.5deg); }
[dir="rtl"] .card { transform: rotate(1.5deg); }
.hc-contact-icon { display: grid; place-items: center; width: 52px; height: 52px; margin-bottom: 18px; border-radius: 50%; background: var(--brand-soft); color: var(--brand); }
.hc-contact .hc-section-title { margin-bottom: 8px; font-size: 24px; }
.hc-contact p { color: #7a6a5c; }
.hc-button { display: flex; justify-content: center; margin-top: 22px; padding: 14px; border-radius: 999px; background: #2b2118; color: #fffaf5; font-weight: 600; text-decoration: none; }

.lower { display: grid; gap: 48px; max-width: 1120px; margin: 0 auto; padding: 0 32px 72px; }
.hc-section-title { margin-bottom: 18px; font-size: 24px; letter-spacing: -0.02em; }
.hc-topics { display: flex; flex-wrap: wrap; gap: 12px; }
.hc-topic a { display: inline-flex; align-items: center; gap: 10px; padding-block: 10px; padding-inline: 10px 18px; border-radius: 999px; background: #fff; box-shadow: inset 0 0 0 1px #f0e6dc; text-decoration: none; transition: box-shadow .15s; }
.hc-topic a:hover { box-shadow: inset 0 0 0 2px var(--brand); }
.hc-topic-icon { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: var(--brand-soft); color: var(--brand); }
.hc-topic-name { font-weight: 600; }
.hc-topic-count { color: #b8a898; font-size: 13px; }
.hc-articles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.hc-articles a { display: flex; flex-direction: column; gap: 14px; height: 100%; padding: 22px; border-radius: 20px; background: #fff; box-shadow: inset 0 0 0 1px #f0e6dc; font-weight: 600; line-height: 1.35; text-decoration: none; }
.hc-article-icon { color: var(--brand); }

.footer { padding: 28px 32px 40px; color: #7d6a59; font-size: 13px; text-align: center; }

@media (max-width: 760px) {
  .header { flex-wrap: wrap; justify-content: space-between; gap: 10px 16px; padding: 16px 18px 6px; }
  .hc-nav { order: 3; flex: 1 0 100%; justify-content: safe center; gap: 22px; overflow-x: auto; padding-block: 6px; border-top: 1px solid #f0e6dc; scrollbar-width: none; }
  .hc-nav a { flex: none; white-space: nowrap; }
  .welcome { grid-template-columns: 1fr; gap: 32px; padding: 24px 18px 48px; }
  .copy h1 { font-size: 38px; }
  .card { transform: none; }
  [dir="rtl"] .card { transform: none; }
  .lower { padding: 0 18px 48px; }
  .hc-articles { grid-template-columns: 1fr; }
}
`}},Ne={html:`<header class="header">
  {{logo}}
  <strong>{{help_center_name}}</strong>
  {{sign_in}}
</header>

<main class="main">
  <section class="hero" data-hc="hero">
    <h1>{{welcome_title}}</h1>
    {{search}}
  </section>
  {{topics}}
</main>
`,css:`/* Your brand colors are var(--brand) and var(--brand-ink). */
body { background: #fff; color: #111827; }

.header { display: flex; align-items: center; gap: 10px; padding: 16px 24px; border-bottom: 1px solid #e5e7eb; }
.header .hc-sign-in { margin-inline-start: auto; }
.hc-logo { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 8px; background: var(--brand); color: var(--brand-ink); font-weight: 700; }

.main { display: grid; gap: 24px; max-width: 880px; margin: 0 auto; padding: 48px 24px; }
.hero { display: grid; gap: 24px; }
.hc-search { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 10px; }
.hc-search input { flex: 1; border: 0; outline: 0; }
.hc-topics { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.hc-topic a { display: block; padding: 16px; border: 1px solid #e5e7eb; border-radius: 10px; text-decoration: none; }
.hc-topic-name { display: block; margin-top: 8px; font-weight: 600; }
`},y=[`en`,`ar`],Pe={en:`English`,ar:`العربية`};function Fe(e){return[e,...y.filter(t=>t!==e)]}var Ie=new Set([`ar`]);function Le(e){let t={en:``,ar:``};return t[e.default_language]=e.name,{default:e.default_language,on:{en:!0,ar:!0},names:t}}function Re(e,t,n){return t===e.default&&!n?e:{...e,on:{...e.on,[t]:n}}}function ze(e,t,n){return{...e,names:{...e.names,[t]:n}}}function Be(e,t){return e.names[t].trim()||e.names[e.default].trim()}function Ve(e){return y.filter(t=>e.on[t])}function He(e){let t={en:!0,ar:!0},n={en:``,ar:``};for(let r of y)typeof e?.on?.[r]==`boolean`&&(t[r]=e.on[r]),typeof e?.names?.[r]==`string`&&(n[r]=e.names[r]);return{on:t,names:n}}function Ue(e,t,n){let r=Le({name:n,default_language:t});return{default:t,on:{...e.on,[t]:!0},names:{...e.names,[t]:r.names[t]}}}function We(e,t){let n=e.default;return{on:{...e.on,[n]:t.on[n]},names:{...e.names,[n]:t.names[n]}}}function b(e){return{on:{...e.on},names:{en:e.names.en.trim(),ar:e.names.ar.trim()}}}var x=[`home`,`kb`,`ticket`],Ge={home:[],kb:[`kb`],ticket:[`tickets`,`new`]},Ke={desktop:{title:60,description:160},phone:{title:52,description:120}};function qe(e){return Fe(e)}function Je(e){let t=(e=``)=>({title:e,description:``,keywords:[]});return{home:{en:t(e),ar:t(e)},kb:{en:t(),ar:t()},ticket:{en:t(),ar:t()}}}function Ye(e,t){return t?`home`:e}function Xe(e){return Array.from(e).length}function Ze(e,t){return e===0?`empty`:e>t?`over`:e>t*.85?`near`:e<t*.3?`short`:`good`}function Qe(e,t){let n=Array.from(e);return n.length>t?`${n.slice(0,t-1).join(``).trimEnd()}…`:e}var S={title:200,description:500,keyword:60,keywords:30};function $e(e,t){let n=et(t).trim();return!n||e.length>=S.keywords||e.some(e=>e.toLocaleLowerCase()===n.toLocaleLowerCase())?e:[...e,n]}function et(e){return e.replace(/[\r\n\t]+/g,` `)}function tt(e,t,n=`en`,r={}){let i=e?.texts??{},a=Je(``);for(let e of x)for(let o of y){let s=i[e]?.[o];s?a[e][o]={title:s.title??``,description:s.description??``,keywords:[...s.keywords??[]]}:e===`home`&&(a[e][o].title=o===n?t:r[o]?.trim()||t)}return{texts:a,hideFromSearch:e?.hide_from_search===!0,sameEverywhere:e?.same_everywhere===!0}}var C=e=>({title:e.title.trim(),description:e.description.trim(),keywords:e.keywords.map(e=>e.trim()).filter(Boolean)}),nt=(e,t)=>JSON.stringify(C(e))===JSON.stringify(C(t));function rt(e,t){return e.hideFromSearch===t.hideFromSearch&&e.sameEverywhere===t.sameEverywhere&&x.every(n=>y.every(r=>nt(e.texts[n][r],t.texts[n][r])))}function it(e,t,n={}){let r={};for(let i of x)for(let a of y){let o=C(e.texts[i][a]);!o.title&&!o.description&&o.keywords.length===0||t&&!n[i]?.[a]&&nt(o,t.texts[i][a])||(r[i]={...r[i],[a]:o})}return{texts:r,hide_from_search:e.hideFromSearch,same_everywhere:e.sameEverywhere}}function at(e,t){if(!e)return null;let n;try{n=new URL(e)}catch{return null}let r=n.pathname.split(`/`).filter(Boolean);return[n.host,...r,...Ge[t]]}var ot=2e4;function w(e){return e.kind===`custom`?`custom:${e.id}`:e.kind}function st(e,t,n,r){let i=new Set(n.map(w)),a=e.widgets.filter(e=>e.pages.includes(t)&&!i.has(e.kind)).map(e=>({kind:e.kind})),o=r.filter(e=>e.in_help_center&&!i.has(`custom:${e.id}`)).map(e=>({kind:`custom`,id:e.id}));return[...a,...o]}var T=(e,t)=>e.kind!==`custom`||t.has(e.id??``);function ct(e,t){return e.flatMap((e,n)=>T(e,t)?[{widget:e,index:n}]:[])}function lt(e,t,n){let r=[],i=0;for(let a of e)T(a,t)?i<n.length&&r.push(n[i++]):r.push(a);return[...r,...n.slice(i)]}function ut(e,t){let n={};for(let{page:r,zones:i}of t.pages)n[r]=Object.fromEntries(i.map(t=>[t,[...e?.[r]?.[t]??[]]]));return n}function dt(e,t){return e?Object.keys(e).filter(n=>Object.values(e[n]??{}).some(e=>e?.some(e=>w(e)===t))):[]}function ft(e,t){if(!e||!t)return!e==!t;let n=new Set([...Object.keys(e),...Object.keys(t)]);for(let r of n)for(let n of[`main`,`side`]){let i=(e[r]?.[n]??[]).map(w),a=(t[r]?.[n]??[]).map(w);if(i.length!==a.length||i.some((e,t)=>e!==a[t]))return!1}return!0}var pt=e=>[...e].length;function mt(e){let t=[];for(let n of[`name`,`heading`]){let r=pt(e[n].trim());r===0?t.push({path:n,type:`required`,message:``}):r>100&&t.push({path:n,type:`too_long`,message:``})}return e.content_html.length>2e4&&t.push({path:`content_html`,type:`too_long`,message:``}),t}var ht=864e5;function gt(e,t){return e?Math.max(0,Math.ceil((Date.parse(e)-t)/ht)):0}var _t=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;function vt(e,t){if(!e.includes(`data-file-id`))return e;let n=new DOMParser().parseFromString(e,`text/html`).body;for(let e of Array.from(n.querySelectorAll(`img[data-file-id]`))){let r=(e.getAttribute(`data-file-id`)??``).toLowerCase();if(!_t.test(r)){e.remove();continue}let i=n.ownerDocument.createElement(`img`);i.setAttribute(`src`,`/api/v1/help-center/public/${encodeURIComponent(t)}/assets/images/${r}`),i.setAttribute(`alt`,e.getAttribute(`alt`)??``),e.replaceWith(i)}return n.innerHTML}function yt(e,t){return t?e.needs===`community`&&!t.community_enabled?`community`:e.kind===`customer_happiness`&&!t.show_happiness?`happiness`:null:null}var E=[`image/png`,`image/jpeg`,`image/webp`];function bt(e){return{...e,landing:e.landing===`ticket_form`?`ticket_form`:`home`,ask_department_first:e.ask_department_first===!0,colleague_tickets:e.colleague_tickets===!0,cc_tickets:e.cc_tickets===!0,custom_status_filter:e.custom_status_filter===!0,search_in_category:e.search_in_category===!0,show_happiness:e.show_happiness===!0,auto_invite:e.auto_invite===!0,auto_invite_all_departments:e.auto_invite_all_departments!==!1,auto_invite_departments:e.auto_invite_departments??null,privacy_url:e.privacy_url??``,terms_url:e.terms_url??``,community_enabled:e.community_enabled===!0}}function xt(e){let t=e.draft??{name:e.name,default_language:e.default_language,appearance:e.appearance,live_design:e.live_design};return{name:t.name,default_language:t.default_language,appearance:{...t.appearance},live_design:t.live_design??e.live_design??`standard`,page_widgets:t.page_widgets??e.page_widgets??null,access:bt(e.access),languages:He(e.languages),seo:tt(e.seo,e.name,e.default_language,e.languages?.names),auth_policy:ee(e.auth_policy)}}function St(e){return{...xt(e),name:e.name,default_language:e.default_language,appearance:{...e.appearance},live_design:e.live_design,page_widgets:e.page_widgets??null}}function Ct(e){let t=e.link_back_url?.trim()??``;return{...e,link_back_url:t===``?null:t,brand_color:e.brand_color.trim()}}function D(e){return{...e,auto_invite_departments:e.auto_invite_all_departments?null:e.auto_invite_departments,privacy_url:(e.privacy_url??``).trim(),terms_url:(e.terms_url??``).trim()}}function O(e,t){return{name:e.name.trim(),default_language:e.default_language,appearance:Ct(e.appearance),live_design:e.live_design,...e.page_widgets?{page_widgets:e.page_widgets}:{},row_version:t}}function wt(e,t,n,r){let i=k(e,t);return{access:D(e.access),row_version:r,...i.has(`languages`)?{languages:b(e.languages)}:{},...i.has(`seo`)?{seo:it(e.seo,t.seo,n.seo?.texts)}:{},...i.has(`authentication`)?{auth_policy:te(e.auth_policy)}:{}}}function k(e,t){let n=new Set,r=e=>JSON.stringify(e),i=O(e,0),a=O(t,0);return(i.name!==a.name||i.default_language!==a.default_language||r(i.appearance)!==r(a.appearance))&&n.add(`rebranding`),i.live_design!==a.live_design&&n.add(`customization`),ft(e.page_widgets,t.page_widgets)||n.add(`widgets`),r(D(e.access))!==r(D(t.access))&&n.add(`access`),r(b(e.languages))!==r(b(t.languages))&&n.add(`languages`),rt(e.seo,t.seo)||n.add(`seo`),ne(e.auth_policy,t.auth_policy)||n.add(`authentication`),n}var Tt=new Set([`rebranding`,`customization`,`widgets`]);function Et(e,t){return k(e,t).size===0}function Dt(e){return E.includes(e.type)?e.size>1048576?`settings.helpCenter.rebranding.imageSize`:null:`settings.helpCenter.rebranding.imageType`}var A=(e,t)=>e===t||e.startsWith(`${t}.`);function Ot(e){return A(e,`access`)?`access`:A(e,`languages`)?`languages`:A(e,`seo`)?`seo`:A(e,`live_design`)?`customization`:A(e,`page_widgets`)?`widgets`:A(e,`auth_policy`)?`authentication`:`rebranding`}function j(e){let t=(e??``).trim();return t===``||/^https:\/\/\S+$/i.test(t)}function kt(e){let t=[],n=e.name.trim();(n===``||n.length>100)&&t.push({path:`name`,type:`invalid`,message:``}),N(e.appearance.brand_color)||t.push({path:`appearance.brand_color`,type:`invalid`,message:``}),j(e.access.privacy_url)||t.push({path:`access.privacy_url`,type:`invalid`,message:``}),j(e.access.terms_url)||t.push({path:`access.terms_url`,type:`invalid`,message:``}),e.access.auto_invite&&!e.access.auto_invite_all_departments&&(e.access.auto_invite_departments??[]).length===0&&t.push({path:`access.auto_invite_departments`,type:`count`,message:``});for(let n of[`en`,`ar`])n!==e.default_language&&e.languages.names[n].trim().length>100&&t.push({path:`languages.names.${n}`,type:`invalid`,message:``});return e.auth_policy.rememberIdleDays>e.auth_policy.rememberMaxDays&&t.push({path:`auth_policy.remember_idle_days`,type:`idle_over_max`,message:``}),t}var M={name:`settings.helpCenter.problems.name`,default_language:`settings.helpCenter.problems.language`,access:`settings.helpCenter.problems.captcha`,"access.mode":`settings.helpCenter.problems.choice`,"access.sign_up":`settings.helpCenter.problems.choice`,"access.landing":`settings.helpCenter.problems.choice`,"access.privacy_url":`settings.helpCenter.problems.link`,"access.terms_url":`settings.helpCenter.problems.link`,"access.auto_invite_departments":`settings.helpCenter.problems.autoInviteDepartments`,"appearance.brand_color":`settings.helpCenter.problems.brandColor`,"appearance.link_back_url":`settings.helpCenter.problems.linkBackUrl`,"appearance.logo_file_id":`settings.helpCenter.problems.image`,"appearance.favicon_file_id":`settings.helpCenter.problems.image`,live_design:`settings.helpCenter.problems.design`,auth_policy:`settings.helpCenter.problems.choice`,"auth_policy.failed_tries":`settings.helpCenter.problems.choice`,"auth_policy.lock_minutes":`settings.helpCenter.problems.choice`,"auth_policy.remember_max_days":`settings.helpCenter.problems.choice`,"auth_policy.invitation_days":`settings.helpCenter.problems.choice`};function At(e,t){if(e===`auth_policy.remember_idle_days`)return[t===`idle_over_max`?`settings.helpCenter.problems.rememberIdleOverMax`:`settings.helpCenter.problems.choice`,{}];if(A(e,`page_widgets`))return[`settings.helpCenter.problems.widget`,{}];if(M[e])return[M[e],{max:100}];if(/^languages\.names\.[a-z]+$/.test(e))return[`settings.helpCenter.problems.languageName`,{max:100}];if(/^languages\.on\.[a-z]+$/.test(e))return[`settings.helpCenter.problems.choice`,{}];let n=/^seo\.texts\.[a-z]+\.[a-z]+\.(title|description|keywords)$/.exec(e);return n?.[1]===`title`?[`settings.helpCenter.problems.seoTitle`,{max:S.title}]:n?.[1]===`description`?[`settings.helpCenter.problems.seoDescription`,{max:S.description}]:n?.[1]===`keywords`?[`settings.helpCenter.problems.seoKeywords`,{max:S.keywords,length:S.keyword}]:null}function jt(e,t){let n={};for(let r of e){let e=At(r.path,r.type);n[r.path]??=e?t(e[0],e[1]):r.message}return n}function N(e){if(!/^#[0-9A-Fa-f]{6}$/.test(e.trim()))return null;let t=t=>{let n=parseInt(e.trim().slice(1+t,3+t),16)/255;return n<=.03928?n/12.92:((n+.055)/1.055)**2.4},n=.2126*t(0)+.7152*t(2)+.0722*t(4),r=e=>(Math.max(n,e)+.05)/(Math.min(n,e)+.05),i=r(1),a=r(0);return i>=a?{ink:`#FFFFFF`,ratio:i}:{ink:`#000000`,ratio:a}}function Mt(e){return e>=7?`easy`:`readable`}var Nt=[`round`,`square`],P={blue:`#2563EB`,violet:`#7C3AED`,pink:`#DB2777`,red:`#DC2626`,orange:`#EA580C`,amber:`#CA8A04`,green:`#16A34A`,teal:`#0F5E57`,slate:`#475569`},F=Object.keys(P);function Pt(e){return Object.prototype.hasOwnProperty.call(P,e)}function Ft(e){let t=t=>e.filter(e=>e.color===t).length;return F.reduce((e,n)=>t(n)<t(e)?n:e)}function It(e){return{name:``,color:Ft(e),shape:`round`}}function Lt(e,t,n){return v(e.name,Ee(t,n),30)}function Rt(e){let t=P[e];return{background:t,color:N(t)?.ink??`#FFFFFF`}}function I(e){return{...e,name:e.name.trim()}}var L=1e3;function zt(e,t){let n=[...new Set(e)],r=[...new Set(t)].filter(e=>!n.includes(e)),i=[...n.map(e=>({id:e,add:!0})),...r.map(e=>({id:e,add:!1}))],a=[];for(let e=0;e<i.length;e+=L){let t=i.slice(e,e+L);a.push({add:t.filter(e=>e.add).map(e=>e.id),remove:t.filter(e=>!e.add).map(e=>e.id)})}return a}function Bt(e){return t=>{let n=e.filter(e=>e.ids.includes(t)).length;return{all:e.length>0&&n===e.length,some:n>0}}}function Vt(e){return e.length<500}var Ht={name:``,description:``};function Ut(e,t,n){let r={},i=v(e.name,Ee(t,n),60);return i&&(r.name=i),e.description.trim().length>160&&(r.description=`tooLong`),r}function R(e){return{name:e.name.trim(),description:e.description.trim()}}function z(e,t){return e.groupIds.map(e=>({id:e,name:t.find(t=>t.id===e)?.name??null}))}function Wt(e,t){return e.groupIds.length>=50?[]:t.filter(t=>!e.groupIds.includes(t.id))}function Gt(e,t,n){return n?e.groupIds.includes(t)?[...e.groupIds]:[...e.groupIds,t]:e.groupIds.filter(e=>e!==t)}function Kt(e,t){return e.filter(e=>e.groupIds.includes(t))}function qt(e,t){let n=0,r=0;for(let i of e){let e=z(i,t);e.some(e=>e.name===null)&&(e.every(e=>e.name===null)?n+=1:r+=1)}return{hidden:n,partly:r}}function Jt(e,t){let n=e.findIndex(e=>e.id===t),r=e.filter(e=>e.id!==t);return r.length===0?null:r[Math.min(Math.max(n,0),r.length-1)].id}function B(e){return e===`help_center.reset`?[`customer_name`,`help_center_name`,`link`,`reset_code`]:e===`help_center.deactivated`?[`customer_name`,`help_center_name`]:[`customer_name`,`help_center_name`,`link`]}var V={subject:200,body:5e3},Yt=/\{([A-Za-z0-9_]+)\}/g;function Xt(e,t){let n=[],r=t.subject.trim(),i=t.body.replace(/\r\n/g,`
`).trim();r===``?n.push({path:`subject`,type:`required`}):/[\r\n]/.test(r)?n.push({path:`subject`,type:`lineBreak`}):r.length>V.subject&&n.push({path:`subject`,type:`tooLong`}),i===``?n.push({path:`body`,type:`required`}):i.length>V.body&&n.push({path:`body`,type:`tooLong`});let a=B(e);for(let[e,t]of[[`subject`,r],[`body`,i]]){let r=[...new Set(Array.from(t.matchAll(Yt),e=>e[1]).filter(e=>!a.includes(e)))];r.length>0&&n.push({path:e,type:`placeholder`,tokens:r})}return e===`help_center.reset`&&i!==``&&!i.includes(`{reset_code}`)&&n.push({path:`body`,type:`missing_placeholder`,tokens:[`reset_code`]}),n}function Zt(e,t){let n=`settings.helpCenter.emailsPage.problems`,r=e.path===`subject`?`subject`:`body`;return e.type===`placeholder`?e.tokens?.length?t(`${n}.placeholder`,{tokens:e.tokens.map(e=>`{${e}}`).join(`, `),count:e.tokens.length}):t(`${n}.placeholderAny`):e.type===`missing_placeholder`?t(`${n}.resetCodeMissing`):e.type===`required`?t(`${n}.${r}Required`):e.type===`lineBreak`?t(`${n}.subjectLine`):t(`${n}.${r}Limit`,{max:V[r]})}var Qt=/\{(customer_name|help_center_name|link|reset_code)\}/;function H(e){return e.split(Qt).map((e,t)=>t%2==1?{placeholder:e}:{text:e}).filter(e=>!(`text`in e)||e.text!==``)}function U(e){let t=Array.from(e.querySelectorAll(`p`)),n=t.findIndex(e=>e.querySelector(`a`));return n===-1?{text:t,button:null}:{text:t.slice(0,n),button:t[n]}}var W=/^(\S+)\s+(.+?)([,،])$/;function $t(e){let t=e.filter(e=>e!==``).sort((e,t)=>t.length-e.length).map(e=>e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`));return t.length===0?null:RegExp(`(?<![\\p{L}\\p{M}\\p{N}_])(?:${t.join(`|`)})(?![\\p{L}\\p{M}\\p{N}_])`,`gu`)}function en(e){let t=`center_name`in e?e.center_name:null;return typeof t==`string`&&t.trim()!==``?t:null}function tn(e,t){let n=$t(t),r=e=>n?e.replace(n,`{help_center_name}`):e,i=U(new DOMParser().parseFromString(e.html,`text/html`)).text.map((e,t)=>{let n=(e.textContent??``).trim();return r(t===0?n.replace(W,`$1 {customer_name}$3`):n)});return{subject:r(e.subject),body:i.join(`

`)}}function nn(e,t){let{text:n,button:r}=U(new DOMParser().parseFromString(e.html,`text/html`)),i=W.exec((n[0]?.textContent??``).trim())?.[2],a=t.find(e=>e!==``),o=r?.querySelector(`a`)?.getAttribute(`href`);return{...i&&{customer_name:i},...a&&{help_center_name:a},...o&&{link:o}}}function rn(e,t,n){let r=new DOMParser().parseFromString(e,`text/html`),{text:i,button:a}=U(r),o=i[0]??a;if(!o?.parentElement)return e;let s=o.parentElement,c=i[0]?.getAttribute(`style`)??`margin:0 0 12px;`;for(let e of i)e.remove();for(let e of t.split(/\n\s*\n/).filter(e=>e.trim()!==``)){let t=r.createElement(`p`);t.setAttribute(`style`,`${c}white-space:pre-line;overflow-wrap:anywhere;`);for(let i of H(e.trim())){if(`text`in i){t.append(i.text);continue}let e=r.createElement(`span`);e.setAttribute(`style`,`border-radius:2px;background:rgba(37,99,235,0.08);box-shadow:inset 0 -1px 0 rgba(37,99,235,0.45);`),e.dataset.placeholder=i.placeholder,e.textContent=n(i.placeholder),t.append(e)}s.insertBefore(t,a)}return`<!doctype html>${r.documentElement.outerHTML}`}function an(e){let t=e?.body,n=e?.defaultView;if(!t||!n)return null;let r=n.getComputedStyle(t);return Math.ceil(t.scrollHeight+(parseFloat(r.marginTop)||0)+(parseFloat(r.marginBottom)||0))}var on=e=>e.replace(/\r\n|\r|\n/g,` `),G=(e,t)=>`${e}|${t}`;function sn(e,t,n,r){let{[t]:i,...a}=e;return n.subject===r.subject&&n.body===r.body?a:{...a,[t]:n}}function cn(e,t){return Object.keys(e).some(e=>e.startsWith(`${t}|`))}function ln(e,t){let{[t]:n,...r}=e;return r}function un(e,t,n,r){let i=`{${r}}`;return{text:e.slice(0,t)+i+e.slice(n),caret:t+i.length}}var K={all:[`desk`,`help-center`],list:()=>[...K.all,`list`],inviteTarget:()=>[...K.all,`invite-target`],servedDepartments:e=>[...K.all,`served-departments`,e],accounts:e=>[...K.all,`accounts`,e],accountPage:(e,t)=>[...K.accounts(e),t],emailPreview:(e,t)=>[...K.all,`email-preview`,e,t],designs:e=>[...K.all,`designs`,e],labels:e=>[...K.all,`labels`,e],groups:e=>[...K.all,`groups`,e],emailTemplates:e=>[...K.all,`email-templates`,e],ticketFields:e=>[...K.all,`ticket-fields`,e],widgetCatalogue:e=>[...K.all,`widget-catalogue`,e],customWidgets:(e,t)=>[...K.all,`custom-widgets`,e,t]},q={settingsInvalid:`HELP_CENTER_SETTINGS_INVALID`,captchaNotConfigured:`HELP_CENTER_CAPTCHA_NOT_CONFIGURED`,conflict:`CONFLICT`,exists:`HELP_CENTER_EXISTS`,notFound:`HELP_CENTER_NOT_FOUND`,forbidden:`FORBIDDEN`,unavailable:`HELP_CENTER_UNAVAILABLE`,invalid:`HELP_CENTER_INVALID`,disabled:`HELP_CENTER_DISABLED`,accountStatus:`HELP_CENTER_ACCOUNT_STATUS`,accountNotFound:`HELP_CENTER_ACCOUNT_NOT_FOUND`,invitationLimit:`HELP_CENTER_INVITATION_LIMIT`,emailLimit:`HELP_CENTER_EMAIL_LIMIT`,emailTaken:`HELP_CENTER_EMAIL_TAKEN`,emailRecentlyChanged:`HELP_CENTER_EMAIL_RECENTLY_CHANGED`,designLimit:`HELP_CENTER_DESIGN_LIMIT`,designLive:`HELP_CENTER_DESIGN_LIVE`,designInvalid:`HELP_CENTER_DESIGN_INVALID`,designNotFound:`HELP_CENTER_DESIGN_NOT_FOUND`,nameTaken:`HELP_CENTER_NAME_TAKEN`,labelLimit:`HELP_CENTER_LABEL_LIMIT`,groupLimit:`HELP_CENTER_GROUP_LIMIT`,labelNotFound:`HELP_CENTER_LABEL_NOT_FOUND`,groupNotFound:`HELP_CENTER_GROUP_NOT_FOUND`},J=class extends Error{constructor(e,t,n){super(e),this.code=t,this.problems=n}};function Y(e){if(e.success)return e.data;let t=Array.isArray(e.error?.details)?e.error.details:[];throw new J(e.error?.message??``,e.error?.code??`UNKNOWN`,t)}function dn(e,t,n,r){if(!(e instanceof J))return t(`settings.helpCenter.errors.unavailable`);switch(e.code){case q.captchaNotConfigured:return t(`settings.helpCenter.problems.captcha`);case q.conflict:return t(r??`settings.helpCenter.errors.conflict`);case q.forbidden:return t(`settings.helpCenter.errors.forbidden`);case q.unavailable:return t(`settings.helpCenter.errors.unavailable`);case q.exists:return t(`settings.helpCenter.errors.exists`);case q.notFound:return t(`settings.helpCenter.errors.notFound`);case q.settingsInvalid:return t(`settings.helpCenter.errors.invalid`);case q.disabled:return t(`settings.helpCenter.users.errors.disabled`);case q.accountStatus:return t(`settings.helpCenter.users.errors.changed`);case q.accountNotFound:return t(`settings.helpCenter.users.errors.gone`);case q.invitationLimit:return t(`settings.helpCenter.users.errors.invitationLimit`);case q.emailLimit:return t(`settings.helpCenter.users.errors.emailLimit`);case q.emailTaken:return t(`settings.helpCenter.users.errors.emailTaken`);case q.emailRecentlyChanged:return t(`settings.helpCenter.users.errors.emailRecentlyChanged`);case q.designLimit:return t(`settings.helpCenter.customizationPage.errors.limit`);case q.designLive:return t(`settings.helpCenter.customizationPage.errors.live`);case q.designInvalid:return t(`settings.helpCenter.customizationPage.errors.invalid`);case q.designNotFound:return t(`settings.helpCenter.customizationPage.errors.notFound`);case q.nameTaken:return t(`settings.helpCenter.errors.nameTaken`);case q.labelLimit:return t(`settings.helpCenter.labelsPage.limitReached`,{max:500});case q.groupLimit:return t(`settings.helpCenter.groupsPage.limitReached`,{max:500});case q.labelNotFound:return t(`settings.helpCenter.labelsPage.errors.gone`);case q.groupNotFound:return t(`settings.helpCenter.groupsPage.errors.gone`);default:return t(n)}}function fn(e){return n({queryKey:K.list(),enabled:e,queryFn:async()=>{let e=Y(await _.list());return Array.isArray(e)?e:e?.items??[]},select:e=>e[0]??null})}function pn(e){return n({queryKey:K.inviteTarget(),enabled:e,queryFn:async()=>Y(await _.inviteTarget())})}function mn(e){return n({queryKey:K.servedDepartments(e),staleTime:0,queryFn:async()=>Y(await _.servedDepartments(e)).department_ids})}function X(){let e=r();return{cancel:()=>e.cancelQueries({queryKey:K.list()}),put:t=>{e.setQueryData(K.list(),e=>e?.some(e=>e.id===t.id)?e.map(e=>e.id===t.id?t:e):[...e??[],t]),e.invalidateQueries({queryKey:K.inviteTarget()})}}}function hn(){let{cancel:e,put:t}=X(),n=r();return a({mutationFn:async e=>Y(await _.create(e)),onMutate:e,onSuccess:t,onError:e=>{e instanceof J&&e.code===q.exists&&n.invalidateQueries({queryKey:K.list()})}})}function gn(){let{cancel:e,put:t}=X();return a({mutationFn:async({id:e,body:t})=>Y(await _.save(e,t)),onMutate:e,onSuccess:t})}function _n(){let{cancel:e,put:t}=X();return a({mutationFn:async({id:e,body:t})=>Y(await _.saveDraft(e,t)),onMutate:e,onSuccess:t})}function vn(){let{cancel:e,put:t}=X(),n=r();return a({mutationFn:async({id:e,rowVersion:t,action:n})=>Y(await(n===`publish`?_.publish(e,t):_.discardDraft(e,t))),onMutate:e,onSuccess:t,onError:e=>{e instanceof J&&(e.code===q.conflict||e.code===q.designNotFound)&&n.invalidateQueries({queryKey:K.list()})}})}function Z(e){return{key:e.key,name:e.name??``,prebuilt:e.prebuilt??null,from:e.from??null,html:e.html??``,css:e.css??``,style:e.style&&typeof e.style==`object`&&!Array.isArray(e.style)?e.style:{},rowVersion:e.row_version}}function yn(e){return n({queryKey:K.designs(e),queryFn:async()=>(Y(await _.designs(e))?.designs??[]).map(Z)})}function bn(e){let t=r(),n=K.designs(e);return a({mutationFn:async t=>{switch(t.kind){case`create`:{let n=Y(await _.createDesign(e,t.body));return{design:Z(n.design),removed:n.removed??[]}}case`save`:{let n=Y(await _.saveDesign(e,t.key,t.body));return{design:Z(n.design),removed:n.removed??[]}}case`delete`:return Y(await _.deleteDesign(e,t.key)),{design:null,removed:[]}}},onMutate:()=>t.cancelQueries({queryKey:n}),onSuccess:(e,r)=>{t.setQueryData(n,t=>{if(!t)return t;if(r.kind===`delete`)return t.filter(e=>e.key!==r.key);let n=e.design;return n?t.some(e=>e.key===n.key)?t.map(e=>e.key===n.key?n:e):[...t,n]:t})},onError:e=>{e instanceof J&&(e.code===q.conflict||e.code===q.designNotFound)&&t.invalidateQueries({queryKey:n})}})}function xn(){return a({mutationFn:async e=>Y(await _.turnOnPreview(e))})}function Sn(){let{cancel:e,put:t}=X();return a({mutationFn:async({id:e,enabled:t})=>Y(await _.setEnabled(e,t)),onMutate:e,onSuccess:t})}function Cn(e,t){return n({queryKey:K.accountPage(e,t),placeholderData:o,queryFn:async()=>Y(await _.accounts(e,t))})}function wn(e){return Cn(e,{status:`pending_approval`,page:1,pageSize:3})}function Tn(e){let t=r(),n=()=>t.invalidateQueries({queryKey:K.accounts(e)});return a({mutationFn:async t=>{switch(t.kind){case`action`:return Y(await _.accountAction(e,t.accountId,t.action));case`edit`:return Y(await _.editAccount(e,t.accountId,t.body));case`email`:return Y(await _.changeAccountEmail(e,t.accountId,t.email));case`revoke`:return Y(await _.revokeInvitation(e,t.accountId));case`delete`:return Y(await _.deleteAccount(e,t.accountId))}},onSuccess:n,onError:e=>{e instanceof J&&(e.code===q.accountStatus||e.code===q.accountNotFound)&&n()}})}function En(e){let t=r();return a({mutationFn:({target:t,onProgress:n})=>he(async t=>{try{return Y(await _.approveAccounts(e,t))}catch(e){if(`all_pending`in t&&e instanceof J&&e.code===q.invalid)return{results:[],remaining:0};throw e}},t,n),onSettled:()=>t.invalidateQueries({queryKey:K.accounts(e)})})}function Dn(e){let t=r();return a({mutationFn:async t=>{let n=Y(await _.invite(e,t));return Array.isArray(n)?n:n?.items??[]},onSuccess:()=>t.invalidateQueries({queryKey:K.accounts(e)})})}function On(e){let t=r();return a({mutationFn:({contactIds:t,onProgress:n})=>ge(async t=>{let n=Y(await _.inviteContacts(e,t));return Array.isArray(n)?n:n?.items??[]},t,n),onSettled:()=>t.invalidateQueries({queryKey:K.accounts(e)})})}function kn(e,t){return n({queryKey:t?K.emailPreview(e,t):[...K.all,`email-preview`,e,`none`],queryFn:async()=>Y(await _.emailPreview(e,t)),enabled:t!==null,placeholderData:o,staleTime:1/0,retry:!1})}function Q(e){return{id:e.id,name:e.name??``,color:Pt(e.color)?e.color:`blue`,shape:e.shape===`square`?`square`:`round`,accountCount:e.account_count??0}}function $(e){return{id:e.id,name:e.name??``,description:e.description??``,accountCount:e.account_count??0}}function An(e){return n({queryKey:K.labels(e),queryFn:async()=>(Y(await _.labels(e))?.labels??[]).map(Q)})}function jn(e){return n({queryKey:K.groups(e),queryFn:async()=>(Y(await _.groups(e))?.groups??[]).map($)})}function Mn(e,t,n,i){let o=r(),s=t===`labels`?K.labels(e):K.groups(e);return a({mutationFn:async r=>{switch(r.kind){case`create`:return n.create(r.draft);case`save`:return n.save(r.itemId,r.draft);case`delete`:return Y(await _.deleteMemberSet(e,t,r.itemId)),null}},onMutate:()=>o.cancelQueries({queryKey:s}),onSuccess:(t,n)=>{if(n.kind===`delete`){o.setQueryData(s,e=>e?.filter(e=>e.id!==n.itemId)),o.invalidateQueries({queryKey:K.accounts(e)});return}t&&o.setQueryData(s,e=>e&&De(e,t))},onError:e=>{e instanceof J&&(e.code===i||e.code===q.nameTaken)&&o.invalidateQueries({queryKey:s})}})}function Nn(e){return Mn(e,`labels`,{create:async t=>Q(Y(await _.createLabel(e,I(t)))),save:async(t,n)=>Q(Y(await _.saveLabel(e,t,I(n))))},q.labelNotFound)}function Pn(e){return Mn(e,`groups`,{create:async t=>$(Y(await _.createGroup(e,R(t)))),save:async(t,n)=>$(Y(await _.saveGroup(e,t,R(n))))},q.groupNotFound)}function Fn(e){let t=r(),n=t=>t===`labels`?K.labels(e):K.groups(e);return a({mutationFn:async({kind:t,itemId:n,add:r,remove:i})=>{let a=null;for(let o of zt(r,i))a=Y(await _.members(e,t,n,o)).account_count;return a},onSuccess:(e,{kind:r,itemId:i})=>{e!==null&&t.setQueryData(n(r),t=>t?.map(t=>t.id===i?{...t,accountCount:e}:t))},onError:(e,{kind:r})=>void t.invalidateQueries({queryKey:n(r)}),onSettled:()=>t.invalidateQueries({queryKey:K.accounts(e)})})}function In(e){return{categoryId:e.category_id,name:e.name??``,articleCount:e.article_count??0,groupIds:e.group_ids??[]}}function Ln(r){return n({queryKey:t.kb.categoryGroups(),enabled:r,queryFn:async()=>(Y(await e.getCategoryGroups())?.categories??[]).map(In)})}function Rn(){let n=r(),i=t.kb.categoryGroups();return a({mutationFn:async({categoryId:t,groupIds:n})=>In(Y(await e.setCategoryGroups(t,n))),onMutate:()=>n.cancelQueries({queryKey:i}),onSuccess:e=>n.setQueryData(i,t=>t?.map(t=>t.categoryId===e.categoryId?e:t)),onError:()=>void n.invalidateQueries({queryKey:i})})}function zn(e){let t={};for(let n of e)Te(n.kind)&&(t[G(n.kind,n.language)]={subject:n.subject??``,body:n.body??``});return t}function Bn(e){return n({queryKey:K.emailTemplates(e),queryFn:async()=>zn(Y(await _.emailTemplates(e))?.templates??[])})}function Vn(e){let t=r(),n=K.emailTemplates(e);return a({mutationFn:async t=>{if(t.kind===`reset`)return Y(await _.resetEmailTemplate(e,t.email,t.language)),null;let n=Y(await _.saveEmailTemplate(e,t.email,t.language,t.text));return{subject:n.subject??``,body:n.body??``}},onMutate:()=>t.cancelQueries({queryKey:n}),onSuccess:(e,r)=>t.setQueryData(n,t=>{let n=G(r.email,r.language),i=Object.fromEntries(Object.entries(t??{}).filter(([e])=>e!==n));return e?{...i,[n]:e}:i}),onError:e=>{e instanceof J&&e.code===q.conflict&&t.invalidateQueries({queryKey:n})}})}function Hn(e){return a({mutationFn:async t=>Y(await _.testEmail(e,t)).sent_to})}function Un(e){return n({queryKey:K.ticketFields(e),queryFn:async()=>Y(await _.ticketFields(e)),staleTime:0})}function Wn(e){let t=r(),n=K.ticketFields(e);return a({mutationFn:async t=>Y(await _.saveTicketFields(e,t)),onSuccess:r=>{t.setQueryData(n,r),t.setQueryData(K.list(),t=>t?.map(t=>t.id===e?{...t,row_version:r.row_version}:t))},onError:e=>{e instanceof J&&e.code===q.conflict&&t.invalidateQueries({queryKey:n})}})}export{Wt as $,We as $t,Wn as A,we as An,mt as At,Zt as B,S as Bt,Un as C,ue as Cn,Ot as Ct,vn as D,ye as Dn,wt as Dt,Ln as E,be as En,Et,xn as F,ae as Fn,w as Ft,on as G,Ye as Gt,an as H,$e as Ht,wn as I,re as In,ct as It,nn as J,at as Jt,H as K,Ze as Kt,en as L,ee as Ln,vt as Lt,Sn as M,c as Mn,ut as Mt,Rn as N,ie as Nn,yt as Nt,gn as O,se as On,ot as Ot,Hn as P,d as Pn,dt as Pt,Ht as Q,Ie as Qt,rn as R,lt as Rt,An as S,le as Sn,N as St,Dn as T,Ce as Tn,St as Tt,un as U,Xe as Ut,Xt as V,x as Vt,cn as W,Qe as Wt,sn as X,y as Xt,tn as Y,qe as Yt,ln as Z,Pe as Zt,yn as _,oe as _n,Mt as _t,K as a,Re as an,Gt as at,jn as b,me as bn,O as bt,Tn as c,Me as cn,Nt as ct,Pn as d,ke as dn,Lt as dt,Fe as en,z as et,Nn as f,Oe as fn,Bt as ft,Cn as g,fe as gn,k as gt,fn as h,p as hn,Tt as ht,$ as i,Be as in,Jt as it,mn as j,ce as jn,gt as jt,_n as k,xe as kn,st as kt,bn as l,Ae as ln,Vt as lt,hn as m,_ as mn,E as mt,J as n,Ue as nn,Ut as nt,Y as o,ze as on,P as ot,Fn as p,g as pn,It as pt,B as q,et as qt,dn as r,Ve as rn,Kt as rt,En as s,Ne as sn,F as st,q as t,He as tn,qt as tt,Vn as u,je as un,Rt as ut,kn as v,f as vn,xt as vt,On as w,Se as wn,jt as wt,pn as x,ve as xn,Dt as xt,Bn as y,de as yn,kt as yt,G as z,Ke as zt};