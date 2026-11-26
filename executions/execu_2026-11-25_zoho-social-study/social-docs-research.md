# Zoho Social: functional breakdown for the clone

Compiled 25 Nov 2026 from official Zoho pages: the help KB (https://help.zoho.com/portal/en/kb/social/), zoho.com/social (features, pricing, plan comparison) and the Zoho Social API v2 docs. Each subsection cites its source URLs. Anything not confirmed is marked "unconfirmed".

## Where each requested topic is

| # | Topic | Location in this file |
|---|---|---|
| 1 | Core concepts: portal, brands, channels, networks | Part A, sections 1–2 |
| 2 | Users and roles, client access | Part A, section 3 (also Part C, section 9) |
| 3 | Home / Dashboard | Part A, section 4 |
| 4 | Publishing | Part B (all) |
| 5 | Monitor | Part C, section 3 |
| 6 | Messages / Inbox, Desk/CRM from interactions | Part C, sections 1, 2, 5, 6 |
| 7 | Reports and analytics | Part D, section 1 |
| 8 | Collaboration, notifications | Part C, sections 7–8; Part B, section 7 (approvals) |
| 9 | Integrations, mobile, browser extension | Part D, sections 2–7; Part B, section 9 (zShare) |
| 10 | Settings, plan limits per edition | Part A, sections 5–6 |
| 11 | Public REST API | Part D, section 8 |

Known source conflicts: the pricing page and the plan comparison page disagree on which plan holds some features (Part A uses the comparison page). Channel counts per plan and the plan for YouTube also differ between pages, and so do some media limits (see the notes in Part B). These are recorded inline.

---

# Part A. Zoho Social: core concepts, users and roles, account settings, channels, plans

Research date: 25 Nov 2026. Sources are official Zoho pages only (help.zoho.com KB and zoho.com/social). Each subsection lists its sources. "Unconfirmed" means no official page fetched states it. Where official pages contradict each other, both values are shown under **Conflict**.

---

### 1. Data model: Portal, Brand, Channel, Members

#### 1.1 Portal
| Fact | Detail |
|---|---|
| Creation | Created automatically at sign-up, named after the company given at sign-up. |
| Owner | First user who signs up becomes **Portal Owner** and also a **Portal Admin**. |
| Purpose | Container for all Brands. Every user in it is a **Portal Member**. |
| Portal settings | Settings (gear, top right) > General Settings > **Portal Settings**. Tabs seen in KB: **Portal Info** (Company Name, Portal Name, Portal Owner, Edit, Delete Portal), **My Settings** (Primary time zone), **Customization** (Agency only), **Email Authentication** (DKIM domains). Only Portal Admins can edit Portal settings. |
| Multiple portals | One Zoho login can belong to many Portals. Joining is by email confirmation link; joined Portals appear under **My Portals** (profile picture, top right). Switch Portal by selecting it there. |
| Visibility | An invited member sees only Brands of that Portal that a Portal Admin gave them. |
| Default client domain | `yourcompanyname.social-public.com`, derived from the Portal/company name. Changing the Portal name changes the default domain. |
| Delete Portal | Only shown for users not on a paid plan (paid users must downgrade to Free first). Settings > Portal Settings > Portal Info > **Delete Portal** > confirm **Delete Portal**. Deletes all Brands; all members lose access; scheduled posts, monitoring columns, drafts, custom reports and other data erased permanently; cannot be recovered. The same email can sign up again later. Which role may delete: unconfirmed (steps assume Portal Settings access, i.e. Portal Admin). |

Sources:
- https://help.zoho.com/portal/en/kb/social/getting-started/articles/brands-and-portals
- https://help.zoho.com/portal/en/kb/social/getting-started/articles/adding-team-members-and-member-roles
- https://help.zoho.com/portal/en/kb/social/manage-account/articles/closing-your-account
- https://help.zoho.com/portal/en/kb/social/faqs/plan-and-pricing/articles/zoho-social-for-agencies-frequently-asked-questions

#### 1.2 Brand
| Fact | Detail |
|---|---|
| Definition | The set of social channels of one entity or business unit (like a department). |
| Creation | First Brand is created automatically when the first channel is connected. |
| Channel rule | **One channel of each type per Brand** (one Facebook Page, one X profile, one LinkedIn Company Page, one LinkedIn Profile, ...). Reason given: performance is measured per profile. A second account of the same type (e.g., two Facebook Pages) needs a second Brand. |
| Number of Brands | Plan-dependent (see section 6). Extra Brands via Brand add-ons. |
| Add Brand | Portal Admins only. Click Brand logo (top left) > **Add another Brand** > pick channels in pop-up (at least one channel required; user must be logged in to each network) > if several pages/profiles exist on a network, select one per network > **+Add**. |
| Add channels to existing Brand | Brand Admins and Portal Admins. |
| Switch Brand | Click Brand logo (top left): drop-down lists Brands and the channels connected to each; click to switch. Brands in another Portal: via My Portals. |
| Brand settings | Settings > Brand Settings > **Brand Information** > Edit: **Brand name, Brand image, Brand Description, Time Zone** > Save. Only Brand Admins and Portal Admins. |
| Brand Settings sections seen in KB | Brand Information, Social Channels, Brand Members (tabs Team Members / Client Members), Roles and Permissions, Notifications, Publishing > Publishing Preferences (approvers), Audit log. General Settings: All Members, Portal Settings. |
| Delete Brand | Settings > Brand Settings > **Delete Brand** (top right) > **Delete**. Scheduled posts of the Brand are deleted; posts already published on networks stay. No restore: Brand must be rebuilt and channels re-authenticated. |
| Lite/Free downgrade | When a trial ends and the account drops to Lite with one Brand allowed, the user chooses which Brand to keep (Lite FAQ). |

**Conflict:** brands-and-portals article says "one each of the eight social channels" but lists 12 types; the Plans FAQ lists 14 types.

Sources:
- https://help.zoho.com/portal/en/kb/social/getting-started/articles/brands-and-portals
- https://help.zoho.com/portal/en/kb/social/faqs/plan-and-pricing/articles/plans-frequently-asked-questions
- https://help.zoho.com/portal/en/kb/social/faqs/plan-and-pricing/articles/zoho-social-lite-edition-frequently-asked-questions
- https://help.zoho.com/portal/en/kb/social/collaboration/articles/content-approvals-on-zoho-social

#### 1.3 Member types
| Term | Meaning |
|---|---|
| Portal Owner | First user; only user who manages the subscription and gets subscription mails (one article). Can be transferred. |
| Portal Admin | Access to all Brands; adds Brands and members, creates roles, sets channel permissions, deletes Brands/members, Audit Log. |
| Portal Member | Any user in the Portal. |
| Team Member | User assigned to a specific Brand, with a Brand role and a set of channels. |
| Client Member | External user invited to a Brand (Agency / Agency Plus only). |

**Conflict:** transfer article says only the Portal Owner manages subscriptions; Plans FAQ says "Only Portal Admins can manage subscription plans", Brand Admins and Users cannot.

Sources:
- https://help.zoho.com/portal/en/kb/social/getting-started/articles/adding-team-members-and-member-roles
- https://help.zoho.com/portal/en/kb/social/managing-your-team-members/articles/transferring-or-replacing-the-portal-owner
- https://help.zoho.com/portal/en/kb/social/faqs/plan-and-pricing/articles/plans-frequently-asked-questions

---

### 2. Channels

#### 2.1 Supported channel types (one of each per Brand)
From Plans FAQ (14 types) plus channels with their own KB connect articles.

| # | Channel type | Plan availability (per plan-comparison / Plans FAQ) | Notes |
|---|---|---|---|
| 1 | Facebook Page | All incl. Free | Pages only. **Facebook Groups not supported** (Meta discontinued Groups API). **Facebook personal profiles not supported**. |
| 2 | X (Twitter) Profile | All incl. Free | |
| 3 | Instagram Business / Professional profile | All incl. Free | Direct publishing needs Business profile; Personal/Creator use mobile-notification publishing. |
| 4 | LinkedIn Company Page | All incl. Free | Showcase Pages also connectable. |
| 5 | LinkedIn Profile (personal) | All incl. Free | |
| 6 | Google Business Profile listing | All incl. Free | Creating a new GBP inside Zoho Social: Standard and above. |
| 7 | Pinterest Profile | Standard and above | Personal or business account. |
| 8 | TikTok (Business) Profile | Standard and above | Not available in India. |
| 9 | Mastodon Profile | Standard and above ("all paid plans") | Any server. |
| 10 | Threads Profile | Standard and above | Requires Instagram account. |
| 11 | Bluesky Profile | Standard and above | App password. |
| 12 | YouTube Channel | Premium, Agency, Agency Plus | **Conflict:** YouTube connect article says "available on all paid plans". |
| 13 | WhatsApp Business account | Premium, Agency, Agency Plus | Inbox integration + templates/bulk messages. |
| 14 | Telegram Business account | Premium, Agency, Agency Plus | Inbox integration via bot token; connected under Settings > Integrations. |
| - | Snapchat (Public Profile, Professional) | Standard and above (connect article) | Not in the 14-type list of Plans FAQ; listed in intro article. |
| - | Arattai (Zoho messenger) | "all paid plans" (connect article) | Not in the 14-type list; listed in intro article. |

**Conflict on counts per plan:** Plans FAQ: Standard/Professional 10 channels, Premium 13, Agency 130 (10x13), Agency Plus 250. Agency FAQ and pricing page: 14 channels per brand. Pricing page channel lists: Free 6, Standard/Professional 11, Premium+ 14. The connect article says "up to 14 channels" depending on plan.

**Older KB text (outdated):** upgrade article says each Brand includes 8 channels incl. **Facebook Group**; this contradicts the Facebook FAQ (Groups unsupported).

Sources:
- https://help.zoho.com/portal/en/kb/social/faqs/plan-and-pricing/articles/plans-frequently-asked-questions
- https://help.zoho.com/portal/en/kb/social/getting-started/articles/an-introduction-to-zoho-social
- https://help.zoho.com/portal/en/kb/social/getting-started/articles/connecting-social-channels-on-zoho-social
- https://help.zoho.com/portal/en/kb/social/faqs/social-channels/facebook/articles/facebook-frequently-asked-questions
- https://www.zoho.com/social/plan-comparison.html
- https://www.zoho.com/social/pricing.html
- https://help.zoho.com/portal/en/kb/social/manage-account/articles/upgrading-to-a-paid-plan

#### 2.2 General connection rules
- Where: **Settings > (Brand Settings) > Social Channels > Connect** next to the channel. Shortcut for most channels: channel icon under **Add more channels** in the Home **Brand Health** card.
- Who: must be an admin (Brand Admin / Portal Admin) in Zoho Social. Network side: must hold Admin rights on the Page (Facebook), super admin (LinkedIn page). Only users with Admin access on the network can (re)authenticate.
- After network login, the user picks one page/profile per network and clicks **Add**.
- Pages missing after login: network account has no pages, page is unpublished, or user lacks page Admin role.
- Zoho CRM users: channels configured in CRM Social module connect automatically on first Zoho Social login; non-admins see "Invite your CRM Admin".
- Feature availability per channel depends on the network API; publishing and scheduling work on all channels.
- Facebook first connection imports the past 30 days of Page data, then real-time.

Sources:
- https://help.zoho.com/portal/en/kb/social/getting-started/articles/connecting-social-channels-on-zoho-social
- https://help.zoho.com/portal/en/kb/social/faqs/social-channels/others/articles/connecting-social-channels-frequently-asked-questions
- https://help.zoho.com/portal/en/kb/social/getting-started/articles/an-introduction-to-zoho-social
- https://help.zoho.com/portal/en/kb/social/faqs/social-channels/facebook/articles/facebook-frequently-asked-questions

#### 2.3 Per-channel connection method
| Channel | Auth method / steps | Prerequisites and rules |
|---|---|---|
| Facebook Page | OAuth: log in to Facebook, choose Page, **Add**. | Admin privileges on Page. If Zoho Social app blocked in Facebook Business Integrations: remove it there, then **Reconnect** from Brand Health alert or Settings > Social Channels. |
| Instagram | Method 1 via Facebook (choose IG account, select account type, Add, Done). Method 2 **Connect via Instagram** (direct IG login, Allow). | Professional account; for Method 1 IG must be linked to a Facebook Page where the user is admin. Direct IG login cannot show Stories impressions/stats. Creator account can be switched to Business under Settings > Social Channels. |
| LinkedIn (profile, Company Page, Showcase Pages) | OAuth, approve mobile sign-in notification, grant permissions, select profile/page, Add. | Super admin on the page. |
| Google Business Profile | Google OAuth, select listing, Add. Option **Create a new Google Business Profile** (fields: business name, location, category, business group, address + map pin, city, PIN code, state, contact number, website optional, opening days/hours optional; verification by call or SMS OTP). Edit via Settings > Social Channels > Edit > Update. | Verification required before posting. |
| YouTube | Google OAuth (choose account, Allow), select channel, Add. Also "Connect Your YouTube Channel" in Brand Health. | Verify channel for advanced features; after verifying, ask support to reconnect. Warning: disconnecting from user side can delete scheduled posts and drafts. |
| Pinterest | Log in (credentials, Facebook or Google), **Give Access** to boards, pins, account details. | Personal or business account. |
| Mastodon | Select server from list or **Others** and type domain only (e.g., `travels.zylker`), **Connect Mastodon**, log in, **Authorize**. | Web and Android apps. |
| TikTok | Log in, **Authorize**. | Business Profile; blocked in India. |
| X | Enter X credentials, **Authorize app**. | |
| Threads | Log in with Instagram / authorize via Instagram, optional **Edit access**, **Continue as <username>**. | Mandatory permission: "Access and display your Threads information and posts"; others optional but needed for publishing/stats. On reconnect permissions cannot be changed; to change, remove Zoho Social under Threads Settings > Account > Website permissions and authorize again. |
| Bluesky | Username + **app password**, **Connect Bluesky**. | App password generated in Bluesky Settings > Privacy and Security > App passwords; tick message access to get DMs in Inbox/Messages. |
| Snapchat | Log in, **Continue** when account appears. | Public Profile set as Professional. |
| WhatsApp Business | Facebook login, authorize FB + WhatsApp Business, **Get Started**, pick/create business portfolio, add WhatsApp profile + number, Next, authorize, **Finish**, pick phone number, **Choose**. Also via Integrations tab. | Facebook account (Meta requirement). WABA can be created in flow. |
| Telegram Business | Settings > **Integrations** > **Connect Telegram**; enter **Bot Token** (from BotFather /newbot or /mybots > API Token) and bot username, **Connect**. | |
| Arattai | Phone number > Next > verification code > Verify > tick authorization checkbox. | Account linked to phone number. |

Sources: as 2.2 plus
- https://help.zoho.com/portal/en/kb/social/connecting-social-media-channels/google-business-profile/articles/connecting-google-business-profile-with-zoho-social
- https://help.zoho.com/portal/en/kb/social/connecting-social-media-channels/youtube/articles/connecting-a-youtube-channel
- https://help.zoho.com/portal/en/kb/social/connecting-social-media-channels/pinterest/articles/pinterest-on-social
- https://help.zoho.com/portal/en/kb/social/connecting-social-media-channels/mastodon/articles/publishing-on-mastodon-from-zoho-social
- https://help.zoho.com/portal/en/kb/social/connecting-social-media-channels/tiktok/articles/connecting-tiktok-with-zoho-social
- https://help.zoho.com/portal/en/kb/social/connecting-social-media-channels/threads/articles/connecting-threads-with-zoho-social
- https://help.zoho.com/portal/en/kb/social/connecting-social-media-channels/bluesky/articles/connecting-bluesky-with-zoho-social
- https://help.zoho.com/portal/en/kb/social/connecting-social-media-channels/snapchat/articles/connecting-snapchat-with-zoho-social
- https://help.zoho.com/portal/en/kb/social/connecting-social-media-channels/whatsapp/articles/connecting-whatsapp-with-zoho-social
- https://help.zoho.com/portal/en/kb/social/connecting-social-media-channels/arattai/articles/connecting-arattai-with-zoho-social
- https://help.zoho.com/portal/en/kb/social/connecting-social-media-channels/instagram/articles/instagram-publishing

#### 2.4 What each channel supports (from KB; incomplete per channel)
| Channel | Publishing | Inbox / messages | Monitor | Reports / stats | Limits stated |
|---|---|---|---|---|---|
| Facebook Page | Posts, Reels, Stories | Messages (Professional+), Inbox (Premium+) | Yes (Professional+) | Yes; "Total followers" shows Page likes (Meta API) | - |
| X | Posts, polls, DM links | Messages | Yes, incl. X Lists columns | Yes | - |
| Instagram | Direct publish (Business). KB article: 1 image/post, no GIF, captions 2,200 chars, 30 hashtags, image 8 MB JPEG, ratio 4:5 to 1.91:1; repeat posts only Business. Plan page lists carousels, Reels, Stories, collaborators, first comment (newer). | Comments; messages | Yes | Yes; Stories analytics (not via direct IG login) | SmartQ needs ~7 days data |
| LinkedIn profile/page | Posts, polls, documents/PDF, @mentions (only connections/followers; en-US locale only) | Page messages (Professional+) | **No** (API) | Profile analytics yes; Connections tab not for profiles | No Sales Navigator integration |
| Google Business Profile | Image post + CTA button / event / offer; 1 image, JPG/PNG, 250x250 to 3000x3000, 5 MB | unconfirmed | Yes (Professional+) | unconfirmed | - |
| YouTube | Video upload with title, description, visibility (public/private/unlisted), category, tags; Shorts (Premium+); edit after publish | Comments | Likes, Dislikes, Playlists, Moderate Comments columns | Summary, Audience, Posts and Engagement, Video Performance, Cards and End Screen | - |
| Pinterest | Pins to boards | - | - | Pin clicks, click rate, saves, save rate | - |
| TikTok | Upload, schedule, calendar; mobile-manual publish | unconfirmed | - | unconfirmed | Video < 10 min |
| Mastodon | Posts, media, hashtags; queues/SmartQ | - | - | Favorites, replies, re-blogs, engagement | Server-specific: e.g. mastodon.social 500 chars, image 16 MB, video 99 MB |
| Threads | Text, media, carousel (2-10), poll, location, alt text | - | Keyword, Username, Mentions columns | Likes, replies, reposts, quotes, views, engagement rate | Text 500 chars; image JPEG/PNG 8 MB; video MOV/MP4 1 GB, 1-300 s |
| Bluesky | Posts, mentions, alt text | DMs in Inbox if permission granted | - | Likes, replies, reposts, quotes, engagement rate | Image/GIF 1 MB; video 50 MB, 1-180 s |
| Snapchat | Posts, Spotlight, Stories | - | - | unconfirmed | unconfirmed |
| WhatsApp | Template messages, bulk messages (to saved contacts, delivered as 1:1 chats) | Inbox + saved replies | - | unconfirmed | unconfirmed |
| Telegram | - | Inbox | - | - | - |
| Arattai | Channel posts, Stories, bulk schedule | - | - | unconfirmed | 50 MB media; video 30 min (post) / 90 s (story) |
| Live Stream | Only Facebook Page, X, Instagram, Bluesky appear in Live Stream. | | | | |
| Brand Health | Facebook Page, X, Instagram, YouTube, LinkedIn Page, LinkedIn Profile, TikTok, Threads, Mastodon, Bluesky. | | | | |

Sources: channel articles above plus
- https://help.zoho.com/portal/en/kb/social/faqs/social-channels/linkedin/articles/linkedin-frequently-asked-questions
- https://help.zoho.com/portal/en/kb/social/connecting-social-media-channels/whatsapp/articles/publishing-on-whatsapp
- https://help.zoho.com/portal/en/kb/social/connecting-social-media-channels/arattai/articles/publishing-on-arattai
- https://help.zoho.com/portal/en/kb/social/connecting-social-media-channels/facebook (article list: Stories, Reels)
- https://help.zoho.com/portal/en/kb/social/faqs/social-channels/twitter/articles/x-frequently-asked-questions

#### 2.5 Token expiry, reconnect, disconnect
- Reconnect needed when: token expired, network password changed, or API permissions changed.
- **Facebook, Instagram, LinkedIn access tokens expire after 60 days**; generic FAQ: "many social networks keep you logged in for only 60 days".
- Reconnect: Settings > Brand Settings > Social Channels > **Reconnect** next to channel; a Brand Health alert also shows "needs reconnecting" with a Reconnect action.
- Email notification is sent when a channel is disconnected because its token expired; admins are prompted to re-authenticate.
- Authenticating/reauthenticating channels is written to the Audit Log.
- **Disconnect:** Settings > Social Channels > **Disconnect** > confirm. Effects: all team members lose access; channel data removed from Social Channels and Notifications; draft, scheduled, unpublished and pending-approval posts for that channel removed (multi-channel posts keep other channels); channel removed from New Post, Customize Content, Bulk Scheduler, Publishing Groups; message history and Inbox interactions/activity logs deleted; Inbox automation rules for the channel stop; Monitor columns removed; Collaborate feeds removed; channel reports inaccessible; dashboard cards removed; scheduled reports keep sending without the channel's cards.
- Whether data returns after reconnecting: unconfirmed.

Sources:
- https://help.zoho.com/portal/en/kb/social/faqs/social-channels/facebook/articles/facebook-frequently-asked-questions
- https://help.zoho.com/portal/en/kb/social/faqs/social-channels/others/articles/connecting-social-channels-frequently-asked-questions
- https://help.zoho.com/portal/en/kb/social/connecting-social-media-channels/others/articles/what-happens-when-you-disconnect-a-social-media-channel-from-zoho-social
- https://help.zoho.com/portal/en/kb/social/notifications-and-live-stream-1/articles/email-notifications-9-6-2021
- https://help.zoho.com/portal/en/kb/social/collaboration/articles/audit-log

---

### 3. Users and roles

#### 3.1 Built-in roles
| Role | Scope | Can do |
|---|---|---|
| Portal Owner | Portal | Subscription owner; must be a Portal Admin. |
| Portal Admin | All Brands | Everything: add/delete Brands, invite/remove/deactivate members, create roles, set channel permissions, Portal settings, Audit Log, approver by default. |
| Brand Admin | One Brand | Any action in that Brand incl. connect/manage channels, invite members, notifications settings, add approvers (if it has approver privilege). Cannot manage subscription (Plans FAQ). |
| User | One Brand | Default access to all features but cannot manage social channels or add people to Brand/Portal. |
| Limited Publisher | One Brand | Views all content of the Brand; cannot publish directly, must send for approval; always has Drafts and Collaborate. |
| Approver (flag, not a role) | Brand | "Add as an approver" checkbox. Approve, update, reject posts; full publishing permission. Only users with publishing permission on **all** connected channels of the Brand can be approvers. |
| Client Member | Brand | See 3.5. |

#### 3.2 Permission matrix (default)
Permissions defined in "Understanding Roles and Permissions". Matrix rebuilt from default-role text; the KB shows it as an image.

| Permission | Effect when off | Portal Admin | Brand Admin | User | Limited Publisher |
|---|---|---|---|---|---|
| Publishing | Must send posts to approvers | Yes | Yes | Yes | No |
| Messages | Messages tab hidden (FB, X, IG) | Yes | Yes | Yes | Yes |
| Comment/Reply | View only | Yes | Yes | Yes | Yes |
| Advanced Reports | Only Summary reports (others: Audience, Post & Engagement, Performance, Reach & Impression) | Yes | Yes | Yes | Yes |
| Leads Data | Sees lead forms, status, mappings, not lead records | Yes | Yes | Yes | No |
| Zia | No Compose with Zia (generate, rephrase, images) | Yes | Yes | Yes | Yes |
| Inbox | No Inbox module (Zia drafts replies when on) | Yes | Yes | No | No |

Unconfirmed: the matrix values above for User and Limited Publisher come from a text summary of an image; verify against the live product.

#### 3.3 Custom roles
- Settings > Brand Settings > **Roles and Permissions** > **Create New Role** > name > tick permissions > Save. Assign to existing members or use while inviting. Permissions can be toggled any time.
- Plan: Premium, Agency, Agency Plus (roles article and plan-comparison). **Conflict:** pricing page groups "custom roles" in the Professional feature block.
- Change a member's role: Settings > Brand Settings > Brand Members > click the role > pick from drop-down; channel checkboxes set channel access.

#### 3.4 Invite, remove, deactivate
- **Invite fields:** Email, Role, Channels (checkbox per connected channel = channel-level access), **Add as an approver** checkbox, "+ Add more" for multiple rows.
- **Entry points:** (a) on-boarding pop-up "Invite people to work on this Brand"; (b) Settings > Brand Members > Team Members > Invite; (c) same, **Add from Zoho CRM** (pick CRM users); (d) Portal Admin: Settings > General Settings > **All Members** > **+ Invite** with fields Email, "invite as Portal Admin" checkbox (all Brands), Brands (multi), Brand Role, Channels, approver checkbox.
- Invitee receives an email; adding team members requires a paid plan with seats.
- **Remove from Brand:** Settings > Brand Members > hover > Remove (or X icon) > confirm; or All Members > member > Remove beside Brand > Delete. Other Brands unaffected. Portal Admins and Brand Admins can remove.
- **Remove from Portal:** Portal Admin only, All Members > Portal Members tab > Delete icon > Remove. All access revoked.
- **Deactivate:** All Members > member > Deactivate > confirm. Status "Deactivated", stays in list, no access; reactivation re-sends an email invite.
- **Removed member's content:** scheduled posts still publish; posts, comments, discussions remain; their Monitor tabs deleted; can no longer be tagged.
- **Drafts:** only creator and Portal Admins can edit/delete a draft; Brand Admins and Users can view others' drafts.
- Invitation statuses (pending/expired), seat-check messages: unconfirmed.

#### 3.5 Clients (Agency, Agency Plus)
- Invite: Settings > Brand Settings > Brand Members > **Client Members** > Invite > email (multiple via + Add more) > optional approver checkbox > Invite. Portal Admins can invite clients to specific Brands. No separate role needed.
- Invite email carries agency branding; link uses default domain or custom domain (if set before inviting). Changing domain after inviting: clients must be told manually.
- Client screens: **Home** (Brand Health, recent posts, Live Stream), **Posts** (published, scheduled, unpublished, pending approval, post analytics), **Collaborate**, **Reports** (only reports/custom dashboards shared with them; export PNG/PDF). Also view RSS feeds, manage Social Library, upload media (desktop or Media Library).
- Collaboration rules: team discussions notify only team; internal threads hidden from clients; tagging a client in any comment exposes the whole thread; clients can start discussions; **clients cannot tag team members**.
- Client approvers: approve posts for publishing/scheduling.
- Free client login (no seat cost) per plan pages.

#### 3.6 Ownership transfer
- Transfer: Settings > Portal Settings > Portal Info > **Edit** > pick user in **Portal Owner** drop-down > Save. Done by Portal Owner or Portal Admin; target must be a Portal Admin in the same account.
- Replace (single-licence accounts, Standard/Professional): Portal Settings > **Invite Member** next to Portal Owner > email > Invite; ownership switches when the invitee joins.

Sources (section 3):
- https://help.zoho.com/portal/en/kb/social/getting-started/articles/assigning-permissions-to-roles
- https://help.zoho.com/portal/en/kb/social/getting-started/articles/adding-team-members-and-member-roles
- https://help.zoho.com/portal/en/kb/social/faqs/manage-your-team/articles/team-members-and-roles-frequently-asked-questions
- https://help.zoho.com/portal/en/kb/social/managing-your-team-members/articles/removing-or-deactivating-team-members-from-zoho-social
- https://help.zoho.com/portal/en/kb/social/managing-your-team-members/articles/transferring-or-replacing-the-portal-owner
- https://help.zoho.com/portal/en/kb/social/collaboration/articles/content-approvals-on-zoho-social
- https://help.zoho.com/portal/en/kb/social/manage-account/articles/zoho-social-for-agencies-25-7-2018
- https://help.zoho.com/portal/en/kb/social/faqs/plan-and-pricing/articles/zoho-social-for-agencies-frequently-asked-questions
- https://www.zoho.com/social/plan-comparison.html

---

### 4. Home / Dashboard
- **Brand Health** card: last 30 days, metrics **Total followers, New followers, No. of posts, Reach, Engagement** per channel. Channels: Facebook Page, X, Instagram, YouTube, LinkedIn Page, LinkedIn Profile, TikTok, Threads, Mastodon, Bluesky. Holds **Add more channels** icons and reconnect alerts.
- **Recent Posts**: posts published across channels with audience response.
- **Live Stream**: real-time feed of likes/shares/comments/mentions; click item for profile details, follow the handle, send message. Only Facebook Page, X, Instagram, Bluesky.
- Lite users see **Try Other Editions** above the Live Stream.
- Dashboard layout cannot be customized (Agency FAQ).
- Plan: "Main dashboard" Standard and above; Notifications and Live Stream Professional and above; "Recent posts" all (plan-comparison).
- Top bar: Brand logo/switcher (top left), New Post, bell (social notifications), Team Notifications icon, Settings gear, profile picture (My Portals, Manage Subscription).

Sources:
- https://help.zoho.com/portal/en/kb/social/getting-started/articles/an-introduction-to-zoho-social
- https://help.zoho.com/portal/en/kb/social/notifications-and-live-stream-1/articles/live-stream-9-6-2021
- https://help.zoho.com/portal/en/kb/social/faqs/social-channels/others/articles/connecting-social-channels-frequently-asked-questions
- https://www.zoho.com/social/plan-comparison.html

---

### 5. Settings

#### 5.1 Time zone
- Primary time zone (per user): Settings > Portal Settings > **My Settings** > Primary time zone: **Account** (Zoho account TZ), **Browser** (OS TZ), **Brand** (each Brand's TZ), or a **custom** zone > Proceed.
- Brand time zone: Settings > Brand information > Edit > Time Zone > Save.
- All timestamps show in the primary TZ; posts schedule and publish in the selected TZ; **Reports tab always uses GMT**.
- Time zone changes are audit-logged.

Source: https://help.zoho.com/portal/en/kb/social/manage-account/articles/time-zone

#### 5.2 Publishing settings (only what is in scope)
- Settings > Brand Settings > Publishing > **Publishing Preferences** > Add Approver. Approval is single-stage (one approver suffices); all brand approvers emailed; only single-brand posts can go for approval; bulk approve/reject max 200; statuses Yet to Review (default), Under Review, Approved, Rejected, Time Elapsed. Approvals plan: Premium+ (plan-comparison).
- Pausing/resuming posts is audit-logged and triggers team notifications.

Source: https://help.zoho.com/portal/en/kb/social/collaboration/articles/content-approvals-on-zoho-social

#### 5.3 Notifications
| Type | Where | Content | Config |
|---|---|---|---|
| Social / Brand notifications | Bell icon | FB Page: Visitor Posts, Comments, Messages, Likes. X: Mentions, Messages, Retweets, Likes, Replies. Instagram: Comments. Not for LinkedIn, GBP, YouTube, FB Groups. | Settings > Brand Settings > **Notifications** > choose channel > per interaction type **Add Member** (member gets email immediately); remove via X. Portal Admins and Brand Admins only. |
| Email notifications | Email | Scheduled post published; scheduled post failed; channel disconnected (token expired); @mention/tag in discussion. | Members chosen on the Brand Notifications page. |
| Team notifications | Icon next to bell | New user joins brand; new discussion; discussion/comment/share updated; connections/posts/reports shared; scheduled posts paused/resumed. Shows date-time, tagged members, type icon. | No settings documented. |

Frequency/digest options: unconfirmed.

Sources:
- https://help.zoho.com/portal/en/kb/social/notifications-and-live-stream-1/articles/social-notifications
- https://help.zoho.com/portal/en/kb/social/notifications-and-live-stream-1/articles/email-notifications-9-6-2021
- https://help.zoho.com/portal/en/kb/social/notifications-and-live-stream-1/articles/team-notifications

#### 5.4 Portal customization / white-label (Agency, Agency Plus)
- Settings > Portal Settings > **Customization**.
- Company logo: JPEG/JPG/PNG/GIF, max 20 KB, recommended 200x40 px; used on client portal, client login screen, exported reports.
- Favicon: PNG/GIF/ICO, max 20 KB, 16x16 or 32x32 px.
- Company name: shown on client login screen. Personalized client invite emails.
- Custom domain: enter domain > Submit > Zoho shows a ZS code > in DNS point CNAME and ZS code to `social.cs.zohohost.com` > **Verify Domain Mapping** > Zoho requests SSL > ready in 5-6 business days.
- Agency-branded reports: share in-app, email, schedule, export PDF/PNG, bulk CSV; custom dashboards with "Shared with".

Sources:
- https://help.zoho.com/portal/en/kb/social/manage-account/articles/zoho-social-for-agencies-25-7-2018
- https://help.zoho.com/portal/en/kb/social/faqs/plan-and-pricing/articles/zoho-social-for-agencies-frequently-asked-questions

#### 5.5 Email authentication (DKIM)
- Settings > General Settings > Portal Settings > **Email Authentication** > Add a domain > name > Add; pop-up shows Host name and TXT value; add TXT record in DNS; **Verify**. Multiple domains allowed (e.g., per Brand); list shows DKIM status. Domain must match portal admins' email domain. Portal admin only.
- Since 1 Feb 2025 custom domains must be DKIM-verified to send to recipients outside the portal; otherwise the default notification address is used. Domains verified in another Zoho product can be added directly.

Source: https://help.zoho.com/portal/en/kb/social/manage-account/articles/configuring-dkim-for-your-email-domain

#### 5.6 Audit log
- Settings > Brand Settings (or General Settings) > **Audit log**. Portal Admins only (page mentions it can be made available to Brand Users and Clients, method unconfirmed).
- Logs actions of Brand Admins and Portal Admins across all Brands: creating roles and inviting users; updating roles/permissions; customizing custom-role permissions; adding/deleting Brands; adding/removing members to/from Brand or Portal; changing time zones; pausing/resuming posts; authenticating/reauthenticating channels.
- Shows about 1 month; archive kept up to 1 year (GDPR). Filters/columns unconfirmed. Plan: pricing page lists "activity log" in its first feature block (tier unclear).

Sources:
- https://help.zoho.com/portal/en/kb/social/collaboration/articles/audit-log
- https://help.zoho.com/portal/en/kb/social/faqs/manage-your-team/articles/team-members-and-roles-frequently-asked-questions

#### 5.7 Security
- AES-256 at rest and in transit; application-layer encryption of AuthTokens and personal-data fields; DEK/KEK via Zoho KMS; full-disk encryption only in IN, AU, JP data centres. No user settings.

Source: https://help.zoho.com/portal/en/kb/social/manage-account/articles/encryption-in-social

#### 5.8 Billing and subscription
- Profile picture > **Manage Subscription**: Change Plan (Monthly/Yearly toggle; Upgrade/Downgrade buttons), Upgrade/Downgrade add-ons (brands, team members, "IM credits" mentioned once), billing details, Cancel Subscription.
- Upgrade flow: pick plan > Upgrade > optional add-on quantities > Proceed > review order and billing details > payment method > **PROCEED TO PAY**. Add-on flow ends with **Make Payment** and a confirmation page.
- Payment methods: credit card or PayPal in-app; FAQ also lists MasterCard, Visa, Amex, PayPal, bank transfer, cheque (contact sales).
- Auto-renew, receipt each cycle, card not stored by Zoho, prices in USD, taxes may apply, refunds per Terms of Service. Annual billing shown as "save 33%" on pricing page.
- Add-on quantities bill every future cycle until reduced manually.
- Cancel: **Skip a Month** (pause one month, once only) or **Cancel Subscription** (ends at cycle end, moves to Free). Unticking "Cancel automatically at the end of the billing cycle" cancels immediately. "Downgrade automatically" checkbox controls end-of-cycle downgrade.
- Downgrade keeps data of restricted features (reports, lists); restored on re-upgrade.
- Expired card: account moves to Free; 5 reminder emails in the 15 days before.
- Trial: 15 days, no card needed; can switch plans during trial ("Try Other Editions" > Try Now); after trial account moves to Free (Plans FAQ) or Lite (Lite FAQ for CRM/Desk users).
- Non-profit discount on request (sales@zohocorp.com).
- Proration: unconfirmed.

Sources:
- https://help.zoho.com/portal/en/kb/social/manage-account/articles/managing-your-subscription-in-zoho-social
- https://help.zoho.com/portal/en/kb/social/manage-account/articles/upgrading-to-a-paid-plan
- https://help.zoho.com/portal/en/kb/social/manage-account/articles/switching-to-another-plan
- https://help.zoho.com/portal/en/kb/social/manage-account/articles/free-plan
- https://help.zoho.com/portal/en/kb/social/faqs/plan-and-pricing/articles/payments-frequently-asked-questions
- https://help.zoho.com/portal/en/kb/social/faqs/plan-and-pricing/articles/plans-frequently-asked-questions
- https://www.zoho.com/social/pricing.html

---

### 6. Plans and limits

#### 6.1 Core limits
| Plan | Brands | Channels / brand | Team members incl. | Brand add-ons | Team-member add-ons | Clients |
|---|---|---|---|---|---|---|
| Free | 1 | 6 (FB Page, X, IG, LinkedIn Page, LinkedIn Profile, GBP) | 1 | No | No | No |
| Lite (bundled free with Zoho CRM/Desk) | 1 | same 6 | 2 (admin + 1) | CRM users can buy | CRM users can buy | No |
| Standard | 1 | 10 or 11 (conflict) | 1 | No | No | No |
| Professional | 1 | 10 or 11 (conflict) | 1 | Up to 5 | Unlimited | No |
| Premium | 1 | 13 or 14 (conflict) | 3 | Unlimited | Unlimited | No |
| Agency | 10 | 14 (FAQ) / 130 total | 5 | Unlimited, bundles of 5 | Unlimited | Yes, free logins |
| Agency Plus | 20 | 14 (FAQ) / 250 total | 5 | Unlimited, bundles of 5 | Unlimited | Yes, free logins |

#### 6.2 Prices (USD)
| Item | Monthly | Billed annually |
|---|---|---|
| Team member add-on (Professional and above) | $12 / member / month | $10 / member / month |
| Brand add-on, Professional | $17 / brand / month | $14.5 / brand / month |
| Brand add-on, Premium | $23 / brand / month | $19.5 / brand / month |
| Brand add-on, Agency / Agency Plus | $92 / 5 brands / month | $76 / 5 brands / month |
| Base plan prices | **unconfirmed**: pricing and plan-comparison pages render amounts by script; the fetched text had no figures. | |

**Conflict:** team-member add-on article says unlimited members on Professional; plan-comparison shows team-member add-ons for Professional too, but pricing page only lists them for Premium+.

Sources:
- https://help.zoho.com/portal/en/kb/social/managing-your-team-members/articles/purchasing-team-member-add-ons
- https://help.zoho.com/portal/en/kb/social/managing-your-team-members/articles/purchasing-brand-add-ons-27-5-2021

#### 6.3 Gated features (plan-comparison page, condensed)
| Feature | Free | Std | Pro | Prem | Agency | Agency+ |
|---|---|---|---|---|---|---|
| Recent posts, zShare, mobile app | Y | Y | Y | Y | Y | Y |
| Scheduling (custom), drafts, calendar, media library, image editor, alt text, Canva, Zia content | N | Y | Y | Y | Y | Y |
| Main dashboard | N | Y | Y | Y | Y | Y |
| Notifications, Live Stream | N | N | Y | Y | Y | Y |
| Bulk scheduler, CustomQ, pause/resume, multi-brand publishing, polls, hashtag groups, first comment, Bit.ly | N | N | Y | Y | Y | Y |
| Messages (X, FB, IG, LinkedIn page) | N | N | Y | Y | Y | Y |
| Monitoring columns | - | 5 | 15 | 15 | 15 | 15 |
| RSS feeds | - | 10 | 20 | 20 | 20 | 20 |
| Reports | none | summary 15 days | summary 3 months + post stats | advanced, 1 year, custom, scheduled, export | same | same |
| SmartQ, UTM, audience targeting, YouTube Shorts, post export/discussion, AI replies | N | N | N | Y | Y | Y |
| Inbox (assignment rules, saved replies, custom views, WhatsApp/Telegram) | N | N | N | Y | Y | Y |
| Custom roles and permissions | N | N | N | Y | Y | Y |
| Approvals/workflows, discussions, team chat, voice/video calls | N | N | N | Y | Y | Y |
| Zoho CRM / Zoho Desk integration | N | N | N | Y | Y | Y |
| Portal customization, custom client invites, branded reports, scheduled client reports, client view, free client login | N | N | N | N | Y | Y |

**Conflict:** the pricing page (zoho.com/social/pricing.html) groups features one tier lower than plan-comparison (e.g., Inbox, approvals, custom roles, CRM/Desk under "Professional plan features and more"; client features under "Premium plan features and more"). The Free-plan KB article says Free does not support scheduling, matching plan-comparison. Plan-comparison is treated as authoritative here; confirm in the live product before building gates.

Sources:
- https://www.zoho.com/social/plan-comparison.html
- https://www.zoho.com/social/pricing.html
- https://www.zoho.com/social/agencies.html
- https://help.zoho.com/portal/en/kb/social/manage-account/articles/free-plan
- https://help.zoho.com/portal/en/kb/social/faqs/plan-and-pricing/articles/zoho-social-lite-edition-frequently-asked-questions

---

### 7. Open gaps (not found on official pages)
- Base plan prices in USD (pages load them by script).
- Invitation status lifecycle (pending, expiry, resend).
- Exact per-role matrix for Inbox and other modules beyond the 7 permissions; whether custom roles can set channel-level permission sets.
- Reconnect data recovery after disconnect; token expiry for networks other than FB/IG/LinkedIn.
- Audit log filters, columns, and how to expose it to Brand Users/Clients.
- Notification frequency/digest settings, personal notification preferences.
- Per-channel Inbox/report support for GBP, TikTok, Snapchat, WhatsApp, Telegram.
- Proration on plan change.

---

# Part B. Zoho Social: Publishing (clone reference)

Scope: compose, scheduling, queues, repeat, drafts, calendar, post lists, approvals, bulk scheduler, RSS, media, link tools, Zia AI.
Sources: official Zoho help pages (help.zoho.com/portal/en/kb/social/...) and zoho.com/social, fetched 25 Nov 2026.
Base URL below: `KB = https://help.zoho.com/portal/en/kb/social`.
"Unconfirmed" means no official page found that states it. Where Zoho pages contradict each other, both values are given under "Conflict".

---

### 1. Compose window

#### 1.1 Entry and modes
- Open with **+ New Post** (top right). A dropdown next to New Post offers: **Customize Content**, **Instagram Story / Stories**, **Bulk Schedule**.
- **New Post window**: the same content goes to every selected channel. Default media limit is 4 images or 1 video.
- **Customize Content window**: opens on **Original Content**. Text and media added there apply to all networks. Select a network to override its caption, hashtags, mentions, tags and collaborators. This mode raises media limits (see 2.1).
- The preview panel on the right shows each network's layout. It is static and non-interactive. It shows only when the screen is wider than **1380 px**.
- Unavailable channels are disabled in the channel picker. Frequently used channels can be **pinned**, so they are selected by default. **Sort by** sorts the picker by channels, brands or groups.
- Max **30 channels** per post (cross-brand). The same content cannot go to several X/Twitter accounts at once.
- One schedule time applies to all selected channels. To post at different times, create separate posts.

Sources: KB/publishing-and-scheduling/publishing-posts/articles/how-to-create-a-new-post-in-zoho-social ; KB/publishing-and-scheduling/publishing-posts/articles/cross-brand-posting ; KB/faqs/publishing-and-scheduling/publishing-and-scheduling-posts/articles/composing-posts-frequently-asked-questions

#### 1.2 Compose toolbar and options (web)
| # | Option | Networks / rule |
|---|---|---|
| 1 | Attach media (Desktop, Media Library, Cloud Picker, Design on Canva) | All |
| 2 | Add location | Facebook, Instagram (Threads also listed in the compose article). X is not supported (X API) |
| 3 | Direct Message link | X |
| 4 | First comment | Facebook, LinkedIn, Instagram, YouTube |
| 5 | Google Business Profile options (G icon): Button, Offer, Event | GBP |
| 6 | Pinterest posting options: title, destination URL (Source), alt text; board picker | Pinterest |
| 7 | Hashtags: popular hashtags + saved hashtag groups | All |
| 8 | Emoji (button, or type `:`). "Frequently Used" keeps up to 40 emojis. Works in all text boxes | All |
| 9 | Create poll | X, LinkedIn (profile + page), Threads |
| 10 | Threaded posts | X, Threads, Bluesky |
| 11 | Target audience | Facebook Pages, LinkedIn Company Pages |
| 12 | Instagram posting options: tag accounts, invite collaborators, trial reel, share reel to feed | Instagram |
| 13 | YouTube video options (shown when a video is attached): title, description, visibility, category, tags, Post as shorts | YouTube |
| 14 | URL Properties (shown when a link is pasted): shorten, UTM tracking, domain, vanity name | All |
| 15 | Compose with Zia | All |
| 16 | Instagram grid preview | Instagram |
| 17 | Alt text per image | Facebook, LinkedIn, X, Pinterest, Mastodon (+ Bluesky on mobile) |
| 18 | @Mentions with suggestions | X, Facebook, LinkedIn, Bluesky (Instagram: exact username, no suggestions) |
| 19 | Convert to document (DOC, DOCX, PPT, PPTX, PDF; images to one PDF) | LinkedIn |
| 20 | Audio on video | Channels that support video with audio |
| 21 | Send for Approval toggle | All |

Source: KB/publishing-and-scheduling/publishing-posts/articles/how-to-create-a-new-post-in-zoho-social ; composing FAQ above.

#### 1.3 Publish actions (bottom/right of compose)
- **Publish Now / Post Now**: publishes at once.
- **Schedule / Custom Schedule**: calendar date + time. Shows the % of audience likely reached at the chosen time. Optional **Repeat this Post**.
- **Add to Queue (CustomQ)**: next free admin-defined slot.
- **SmartQ**: suggested best times.
- **Save as Draft**. A post is also kept as a draft if the compose screen is closed before scheduling.
- **Send for Approval**: goes to the brand's approvers instead of publishing.

Sources: KB/publishing-and-scheduling/scheduling-posts/articles/publishing-scheduling-overview ; how-to-create-a-new-post article.

#### 1.4 Character limits
| Network | Limit |
|---|---|
| Facebook Page | 63,206 |
| X profile | 280 (X Premium 25,000) |
| LinkedIn Page / Profile | 3,000 |
| Google Business Profile | 1,500 |
| Instagram | 2,200 (max 30 hashtags, counted across caption + first comment) |
| Threads | 500 |
| Pinterest profile | 800 |
| Mastodon | Depends on server |
| Bluesky, TikTok, YouTube description | Unconfirmed |
- A live per-network character counter in the UI is **unconfirmed** (no help page describes it).
- After a channel's limit is reached, more hashtag groups cannot be added.

Sources: composing FAQ ; KB/connecting-social-media-channels/instagram/articles/instagram-publishing ; KB/publishing-and-scheduling/tools-for-publishing-posts/articles/adding-first-comment ; KB/publishing-and-scheduling/tools-for-publishing-posts/articles/hashtag-manager

#### 1.5 Network posting rate limits (set by networks, shown by Zoho)
"Day" = 24 hours from the first post.
| Network | Limit |
|---|---|
| Facebook | 40 / 24 h |
| X | 200 / 15 min or 300 / 2 h (reposts included) |
| Instagram | 50 / 24 h |
| Threads | 250 / 24 h |
| YouTube | 20 / 24 h |
| GBP | 50 / 24 h |
| TikTok | 6 / min or 15 / 24 h |
| LinkedIn Profile and Page | 50 / 24 h |
| Pinterest | 30 requests / min (create, edit, delete, board create/view) |
| Mastodon | 300 / 5 min without media; 30 / 30 min with media |
| Bluesky | 100 / 24 h with images; 25 video posts / 24 h; 25 GB upload / day |
Source: composing FAQ.

#### 1.6 Link preview
- When a URL is pasted, a link preview is generated (zShare article: preview can be closed, then "Switch to Link preview" brings it back).
- X: preview not shown in the publishing window (API). The published post gets an auto-generated card.
- Facebook: link attachment customisation was removed 18 Dec 2017. Changing the thumbnail needs domain verification on Facebook.
- LinkedIn: arrows choose between images found on the page.
- Instagram and GBP: no link preview.
- A video URL cannot be shared as a video. It publishes as a link preview and may not play. Upload the file instead.
- Bulk scheduler: many links may be in Content, but only the one in the **Link** column gets a preview.
Sources: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/zshare-browser-extension ; KB/faqs/publishing-and-scheduling/publishing-and-scheduling-posts/articles/media-and-link-attachments-frequently-asked-questions ; bulk-scheduler article.

#### 1.7 Mentions / user tagging
- Type `@` + name, pick from suggestions. Works on web and mobile.
- Supported: Facebook Pages, X, LinkedIn Pages, LinkedIn Profiles, Bluesky, Instagram. Not supported: YouTube, GBP.
- Facebook: max **10** mentions per post.
- LinkedIn profile: only connections/followers can be mentioned. Only for connections with locale **en_US** (API).
- Instagram: no suggestions. Exact username is needed. A wrong username is published as plain text.
- X: FAQ says exact username is needed. The mention article lists X with suggestions. Conflict.
- Multi-network (web): Instagram uses the username tagged on the last selected supported network. If a matching Instagram profile exists it is tagged, else plain text. Mobile: the Instagram tag can be edited by hand.
- **Instagram image tagging** (Tag Accounts): click anywhere on the image, enter exact username, save. Max **20** unique accounts per post. A wrong username stops the post from publishing. Edit/delete icons per tag. Preview shows tags.
- **Instagram collaborators** (Invite Collaborators): exact usernames, max **5** per post. The invite is sent when the post publishes. Collaboration status shows in Post Details. A post with collaborators cannot be a trial reel.
Sources: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/mention-profiles-and-pages-in-your-posts ; KB/connecting-social-media-channels/instagram/articles/image-tagging-on-instagram ; KB/connecting-social-media-channels/instagram/articles/invite-collaborators-to-your-instagram-posts

#### 1.8 Hashtags
- **Popular hashtags**: typing `#` lists up to **10** hashtags already used in past posts on the selected channels, ranked by engagement, each with its total engagement count. Also in the Android app.
- **Hashtag Manager / groups**: Settings > Publishing > Hashtag Groups (or from the compose # icon; mobile # icon). Fields: group name + hashtags. Max **30 hashtags per group**, max **10 groups**. Edit and delete icons per group. Professional, Premium, Agency plans.
- On Instagram, a group can go in the caption or in the first comment.
- Sharing groups between users: unconfirmed.
Sources: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/popular-hashtags ; .../hashtag-manager

#### 1.9 Location
- Facebook and Instagram (web, Android, iOS). Click **Add Location**, type a place or pick a suggestion based on the browser's current location (browser location must be on), click **Add**. X not supported.
Sources: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/adding-location-via-zoho-social ; composing FAQ.

#### 1.10 Alt text
- Web: per image, or one checkbox "apply to all images". Click **Alt Text** > type > **Add**.
- Android: with several images only one shared alt text.
- Networks: Facebook, LinkedIn, X, Pinterest, Mastodon (mobile article adds Bluesky).
- Character limit and AI-generated alt text: unconfirmed.
Source: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/including-alt-text-on-zoho-social

#### 1.11 First comment
- Facebook, LinkedIn, Instagram, YouTube. Click **First Comment** icon > enter text/hashtags > **Add**. It is published with the post at the same time (now or scheduled).
- Plans: Professional and above (Instagram, Facebook, LinkedIn).
- Mobile: Android = Instagram (mobile publishing page: Instagram, Facebook, LinkedIn on Android and iOS; YouTube iOS only). Conflict between pages.
- Character limit, media in comment, failure handling: unconfirmed.
Source: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/adding-first-comment ; KB/zoho-social-mobile-app/articles/publishing-from-zoho-social-mobile-application

#### 1.12 Polls
- X and LinkedIn (compose article adds Threads). Plans: Professional and above.
- Fields: question, options (min **2**, max **4**, **Add option**, delete icon), duration. Click **Done**.
- X: a poll post cannot have caption, media or DM link. LinkedIn: no media; caption allowed.
- Results show in the Posts tab.
- Duration values and text limits: unconfirmed.
Source: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/create-poll-for-x-and-linkedin-posts

#### 1.13 Threads (X, Threads, Bluesky)
- Write long text and click the convert icon to split it, or open the thread composer and split by hand.
- Each post has its own media icon and delete icon; **Delete all** clears the thread; **Save** puts it in compose.
- X: each post max **280** chars. Text over 280 in compose is split automatically. Max **15** posts per thread. Each post: up to 4 images **or** 1 video.
- Publishing: **Post all at once** (in order) or **Time interval** (first now, then a set gap). Then Publish Now / Schedule / Add to Queue / SmartQ.
- Plans: Standard and above.
- Older article: X threads built by replying to a published tweet (Posts > Published > reply); "threads cannot be scheduled". This is older than the thread composer. Conflict.
Sources: KB/publishing-and-scheduling/publishing-posts/articles/creating-threaded-posts ; .../creating-a-twitter-thread

#### 1.14 Targeting
- Facebook Pages: countries (FAQ intro also mentions language). Not for Facebook Groups. Control in lower left of publishing window > enter countries > **Set**.
- **TimeWarp** (Facebook Pages): appears above Schedule after targeting; publishes at the same local time in each targeted country.
- LinkedIn Company pages: location + job functions. Audience must be at least **300** followers.
Source: KB/publishing-and-scheduling/publishing-posts/articles/creating-posts-for-a-target-audience

#### 1.15 X Direct Message link
- Message icon in publishing window adds a DM link to the tweet. Limits unconfirmed.
Source: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/adding-direct-message-links-to-tweets

#### 1.16 Google Business Profile post types
| Type | Fields | Rules |
|---|---|---|
| What's New + Button | Button type: Learn more, Sign up, Order online, Book, Buy, Call; website link | Link required |
| Event | Title (required), description, start date, end date | Start before end |
| Offer | Offer title (required), description, starts on (date+time), ends on (date+time), voucher code, redeem link, terms and conditions | Start before end |
- Media: 1 image, JPG/PNG, 250x250 to 3000x3000 px, 5 MB. Max 1,500 chars.
Sources: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/adding-a-cta-button-event ; media-guidelines.

#### 1.17 YouTube fields
- Title (max **100** chars), Description, Visibility (Public / Private / Unlisted), Category (dropdown), Tags (comma or semicolon separated), **Post as shorts** checkbox.
- Shorts: max 180 s, aspect 9:16 or 1:1 (media guidelines: aspect ≤ 1). Shorts are on Premium and Agency plans. Custom thumbnails are not supported for Shorts.
- "Made for kids", playlist: unconfirmed.
Source: KB/connecting-social-media-channels/youtube/articles/getting-started-with-youtube-shorts-on-zoho-social

#### 1.18 Pinterest fields
- Board (choose or **+ Create a new board**: name, checkbox "visible only to you and collaborators"), Title, Source (destination link), Alt text, caption.
- 1 image per pin, max 20 MB. Publishing article says 1000x1500 px; media guidelines say min 75x75 px. Conflict.
- Deleting a board deletes all its pins. SmartQ cannot be used for pins (API).
- Bulk: image URLs in columns IMAGE URL 1, IMAGE URL 2, ...
Sources: KB/connecting-social-media-channels/pinterest/articles/publishing-on-pinterest ; KB/faqs/social-channels/pinterest/articles/pinterest-frequently-asked-questions

#### 1.19 TikTok
- Video 1 to 600 s, under 1 GB, min 360x360. Images: 4 in New Post, 10 in Customize Content.
- Line breaks in captions are removed (API).
- Thumbnail: suggested image or timeline frame.
- Privacy, comments, duet, stitch, disclosure options: unconfirmed.
Source: KB/connecting-social-media-channels/tiktok/articles/publishing-on-tiktok

#### 1.20 LinkedIn documents
- One document per post: DOC, DOCX, PPT, PPTX, PDF. Max 300 pages, 100 MB. Fields: title + caption; preview before posting.
- Images (Desktop, Media Library, Cloud Picker, Canva) can be combined into one PDF (toggle in pop-up, **Save**). Max image count: unconfirmed.
Source: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/post-documents-and-convert-images-to-pdf-on-linkedin

---

### 2. Media

#### 2.1 Media count per post
| Network | Images | Video | Other |
|---|---|---|---|
| Facebook Page | 10 post; 1 story | 1 post / 1 reel / 1 story | — |
| Instagram | 10 post (images and videos can be mixed); 10 stories | 1 reel; 1 story direct; 10 stories manual | — |
| X | 4 (or up to 4 GIFs) | 1 | — |
| LinkedIn Page / Profile | 10 (FAQ and carousel page say 9) | 1 | 1 document |
| GBP | 1 | — | — |
| YouTube | — | 1 video or Short | — |
| Pinterest | 1 | 1 | — |
| TikTok | 10 | 1 | — |
| Threads | 10 | 1 | — |
| Bluesky | 4 or 1 GIF | 1 | — |
| Mastodon | 4 | 1 | — |
| Arattai | 1 image or video | | |
- New Post default: 4 images or 1 video. Customize Content gives the higher counts. Only one video per post (API).
- For X, Facebook, LinkedIn, Pinterest: a post holds several static images, or 1 video, or 1 GIF.
- The first image can differ per network (drag and drop).
Sources: KB/publishing-and-scheduling/publishing-posts/articles/media-guidelines ; .../carousel-posts ; composing FAQ.

#### 2.2 Per-network specs (from Media guidelines)
| Network | Image | Video |
|---|---|---|
| Instagram post/story | PNG, JPEG, JPG, GIF (stories JPEG); 8 MB; aspect 1.91:1 to 3:4 (stories 9:16 rec.); GIF published as static | MOV/MP4; 100 MB; 3–60 s; max width 1920; aspect 0.8–1.78; 23–60 fps; AAC ≤48 kHz; HEVC/H.264; ≤25 Mbps |
| Instagram reel | — | MOV/MP4; 300 MB; 3 s–15 min; aspect 0.01:1–10:1 (Reels article: 1 GB max) |
| YouTube | — | MOV/MP4; 5 GB; 30 min; 24–60 fps; Shorts ≤180 s, aspect ≤1 |
| Facebook Page | JPG, JPEG, BMP, PNG, GIF, TIFF; 10 MB; ≤30000x30000 | MP4/MOV; 1 GB; 30 min; ≥120x120 |
| Facebook story | JPEG, JPG, GIF, PNG; <4 MB | 1 GB; 3–60 s; ≥540x960; 9:16 |
| Facebook reel | — | MP4/MOV; ≥540x960; 9:16; 3–90 s (Reels article: max 15 min) |
| X | JPG, PNG, GIF, JPEG; 5 MB; 4x4–8192x8192; GIF ≤1280x1080, ≤350 frames, 5 MB | MOV; 512 MB; 0.5–140 s (premium up to 120 min); 32x32–1280x1024; aspect 1:3–3:1 |
| LinkedIn | JPG, JPEG, PNG, GIF (≤250 frames); up to 36,152,320 px | MP4; 200 MB; 3 s–30 min; 256x144–4096x2304; aspect 5/12–2.4; ≤30 fps |
| GBP | JPG, PNG; 5 MB; 250x250–3000x3000 | — |
| Pinterest | PNG, JPEG, GIF; 20 MB; ≥75x75 | MP4/MOV; 1 GB; 4–900 s |
| TikTok | JPEG, JPG, PNG; 20 MB each; 1080x1920 or 1920x1080 | MP4/MOV; 1 GB; 1–600 s; ≥360x360; 23–60 fps |
| Threads | JPEG, PNG; 8 MB; ≥320 px wide; sRGB | MOV/MP4; 1 GB; 1–300 s; max width 1920 |
| Bluesky | 1 MB (GIF published static) | 50 MB; 1–180 s |
| Arattai | JPEG, JPG, PNG, GIF; 50 MB | MP4/MOV; 50 MB; story ≤90 s, channel post ≤30 min |
| Snapchat | Story image 10 MB, ≥540x960 | Spotlight 6–60 s, story 5–60 s; 1 GB |
- GIF size limits (FAQ): X 5 MB, Facebook 15 MB, Pinterest 20 MB, LinkedIn no limit.
- Older video-thumbnail article has other, older numbers (e.g. Facebook 140 s, 512 MB). Treat Media guidelines as current.
Sources: media-guidelines ; composing FAQ ; KB/publishing-and-scheduling/tools-for-publishing-posts/articles/video-thumbnail-customization ; KB/connecting-social-media-channels/instagram/articles/getting-started-with-instagram-reels-on-zoho-social ; KB/connecting-social-media-channels/facebook/articles/publishing-reels-on-facebook-from-zoho-social

#### 2.3 Carousel
- Instagram, Facebook, LinkedIn on web (Android app also X and GBP). Mixing images and videos only on Instagram.
- Facebook: single photo can choose an album; carousels go to "Timeline photos".
- Android: up to 10 items from gallery; X publishes first 4, LinkedIn first 9, GBP first 1; drag to reorder in **Customize**.
Source: KB/publishing-and-scheduling/publishing-posts/articles/carousel-posts

#### 2.4 Reels, Shorts, Stories
- Instagram reel: **Add to Instagram Feed** checkbox (unchecked = Reels tab only). Cover: suggested image, timeline frame (**+** > **Apply**), or upload.
- **Trial reels** (Professional+; account >200 followers; no collaborators): toggle **Post as Trial reel**; then **Share to everyone automatically** toggle (Instagram decides after 72 h) or manual (Posts > ⋮ > **Publish**). The Posts tab does not mark trial reels.
- **Instagram Story**: New Post dropdown > Instagram Story. Upload media, or create from scratch (background colour/image, text, stickers, filters, brightness/contrast/saturation). Direct publishing: 1 media, 1 story at a time, Business account. Manual publishing toggle: up to 10 items, captions allowed.
- **Facebook Story**: dropdown > Stories, select Facebook and/or Instagram. 1 story at a time, direct only (no manual). Live story shows a LIVE tag.
- Stories list: Posts > channel > Stories icon; filters Promoted, Scheduled, Approvals, Unpublished, Drafts.
Sources: how-to-create-a-new-post ; KB/publishing-and-scheduling/tools-for-publishing-posts/articles/instagram-trial-reels ; KB/connecting-social-media-channels/instagram/articles/create-and-publish-instagram-stories ; KB/connecting-social-media-channels/facebook/articles/creating-facebook-stories

#### 2.5 Manual publishing (Instagram, TikTok)
- Used when: Instagram Creator profile stories; media outside network specs; several stories, captions; TikTok videos outside API limits.
- At publish time the mobile app sends a notification (Publishing Notifications). User taps **Open Instagram / Open TikTok**; media is downloaded and caption copied to clipboard; user finishes in the native app.
- Instagram posts published this way cannot be edited or deleted from Zoho Social.
- Conflict on video range: "60 s to 10 min" vs "shorter than 3 s and longer than 60 s".
Source: KB/publishing-and-scheduling/publishing-posts/articles/manual-publishing-instagram-tiktok

#### 2.6 Custom video thumbnail
- Sources: auto suggestions (selected one gets an orange tick), **+** > **Choose Frame** (play and stop), **+** > **Upload Image** (max **5 MB**; Desktop, Media Library, Cloud Picker, Canva). Pencil icon replaces it.
- Frame thumbnails: Facebook (videos and reels), Instagram, X, YouTube, Pinterest, TikTok, LinkedIn, Mastodon. Uploaded image thumbnails: Facebook, Instagram, YouTube, Pinterest, Mastodon (API). YouTube Shorts: none.
Sources: video-thumbnail-customization ; media-and-link FAQ.

#### 2.7 Audio on video
- Hover video thumbnail > Audio icon > search Zoho Social audio or upload own (Desktop, Media Library, Cloud Picker) > **Next** > trim, set or mute original and added volume, preview > **Add audio**.
- One video per post. Audio loops to video length.
- Formats and size: unconfirmed.
Source: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/adding-audio-via-zoho-social

#### 2.8 Image and video optimisation
- Setting: Settings > General Settings > Preference (on/off). When on, uploads are processed in compose with a progress indicator.
- Video: format conversion, re-encode, scale down, reduce size, bitrate, stereo audio, frame rate. Max 5 GB; max 5376x2024 or 3024x5376.
- Image fit choice: **Black background** (letterbox) or **Skew background** (stretch).
- Plans: Standard and above (video).
Source: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/image-and-video-optimization

#### 2.9 Image editor
- Open: hover attached image > **Edit**.
- Crop: 4:3, 16:9, 3:4, 9:16, freehand; channel presets for Facebook, Instagram, X, Pinterest.
- Rotate (CW/CCW), flip (H/V).
- Text: font style, size, alignment, font colour, background colour, line spacing.
- Stickers: resize, rotate, drag.
- Filters: 10 (e.g. Warm, Vintage, B/W).
- Adjust sliders: brightness, contrast, hue, saturation, invert, opacity; **Reset All**.
- **Undo**, **Reset** (to original), **Save**, **Preview**.
Source: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/working-with-image-editor

#### 2.10 Media Library (stock) and Social Library (own files)
- **Media Library**: stock search in Pixabay, Pexels, Giphy (switch by icons on left; keyword search; tick items; **Attach**). A source credit is added to the caption automatically (editable). One item only in a comment or message reply. Available in Posts, Messages, Monitor.
- **Social Library** (Posts > Social Library): shared brand store of images, GIFs, videos. **Upload Media** from Desktop, Cloud Picker, Media Library, Canva. Images/GIFs up to **36 MB**, videos up to **5 GB**.
- Folders, tags, storage quota, rename/move/delete: unconfirmed.
Sources: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/media-library-on-zoho-social-3-2-2023 ; .../social-library ; media-and-link FAQ.

#### 2.11 Cloud Picker
- Zoho WorkDrive, Google Drive, Box, OneDrive, Dropbox, Evernote, Zoho Notebook. Each service must be authenticated from the Publishing Window first.
- WorkDrive picker: up to 5 files per selected folder; sort by name, modified, created; search by name; X removes a file.
- Images cannot be hotlinked by URL in single-post compose (only the Bulk Scheduler takes URLs).
Sources: social-library ; media-and-link FAQ.

#### 2.12 Canva
- Connect: Settings > Integrations > **Connect to Canva** (or from the media button). Canva login + email code + permissions. Disconnect in the same place.
- Media button > **Design on Canva** opens a new tab; **Return to Zoho Social** attaches the design as an image. **Edit in Canva** reopens it.
- Also from Social Library upload, Posts replies, Monitor replies. Professional plan or above.
Source: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/design-with-canva-button

---

### 3. Links

#### 3.1 URL shorteners
| Shortener | Plans | Notes |
|---|---|---|
| zurl (default) | Standard+ | No setup |
| Bit.ly | Professional+ | Admin connects their bit.ly account (OAuth) |
| Custom domain | Premium (1 per portal), Agency/Agency Plus (5 per portal) | Brand or portal admin |
- Settings > General Settings > Preference > URL Settings: **Auto Shorten URLs** toggle; choose shortener.
- Custom domain fields: domain name, home page URL (used when only the domain is opened), error page URL. DNS: A record (root domain) or CNAME to `smarturl.cs.zohohost.<dc>` (subdomain). Verify; **Retry** after DNS change. DC IPs: US 136.143.187.52, IN 103.103.196.76, EU 185.230.212.184, AU 103.138.128.96, CA 199.67.85.78, SA 199.67.80.89, JP 103.163.152.73, UAE 160.32.188.86.
- Compose: URL Properties > shorten toggle, tracking toggle, domain dropdown, vanity name, preview, **Apply**.
- Admin: **+ Shorten URL** (domain, long URL, vanity) > **Generate**. Existing URL list filterable by domain, sortable by date added or last used.
- A short URL can be edited: title, description, expiry date, fallback URL, UTM.
- Rules: a custom-domain vanity name cannot be edited after it is added; with utm_source = social network, no vanity name allowed.
Source: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/setting-up-url-shorteners

#### 3.2 UTM tracking
- Settings > Preferences > URL settings > enable URL tracking > **Customize UTM**. When on, UTMs are added automatically to every pasted URL. When off, they can be added by hand in URL Properties.
- Parameters: utm_source (option **Social Network** = auto channel name, or **Custom Value**), utm_medium, utm_campaign (max **20** chars), utm_content (option: first ten letters of post text, or custom), utm_term, custom parameters. Max **6** parameters in total.
- Changes to defaults apply only to new URLs. Preview of the tracked URL is shown.
Sources: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/utm-tracking ; KB/faqs/publishing-and-scheduling/publishing-and-scheduling-posts/articles/url-tracking-frequently-asked-questions

---

### 4. Scheduling

#### 4.1 Custom schedule
- Calendar picker on the right of compose; shows likely audience % reached. Same time for all channels.
- Time zone: set from the top-right dropdown (calendar article). Minimum lead time and maximum future date for single posts: unconfirmed (bulk needs ≥1 h).
Source: KB/publishing-and-scheduling/scheduling-posts/articles/publishing-scheduling-overview ; KB/managing-posts/articles/publishing-calendar

#### 4.2 SmartQ
- Right side of publishing window. Suggestions for next 7 days or a chosen date. Sort by **Engagement** or **Time**. Each slot shows % of top engagers reached.
- Only Facebook Page, Instagram profile, X profile. Other channels selected with them get times based only on the supported ones. With several supported channels, common times are suggested.
- Needs at least **7 days** of history; none for new brands. Slots change weekly. Several posts may share one SmartQ slot.
- Plans: Premium, Agency, Agency Plus. All users with publishing permission.
Sources: KB/publishing-and-scheduling/scheduling-posts/articles/scheduling ; KB/faqs/publishing-and-scheduling/publishing-and-scheduling-posts/articles/queues-frequently-asked-questions

#### 4.3 CustomQ (custom queues)
- Settings > Brand Settings > Publishing > CustomQ (Queue) Settings: days of week; **+Add Slot** (time) per day; max **25 slots per day**; **Clone** a day's slots to other days (adds, does not replace); delete with **X**.
- Slots are brand-wide, not per network.
- One post per slot; a new queued post takes the next free slot; users see only the next free slot. Scheduler posts may land on the same time as queue posts.
- Deleting or changing slots does not move posts already queued.
- Only Brand Admin / Portal Admin manage slots. Plans: Professional, Premium, Agency. Shuffle, queue pause: unconfirmed.
Sources: KB/publishing-and-scheduling/scheduling-posts/articles/scheduling-posts-with-publishing-queues ; queues FAQ.

#### 4.4 Repeat posts (the "post recycling" Zoho describes)
- Prerequisite: a date and time are set. Check **Repeat this Post**.
- **Weekly** (default): one weekday + **Repeat Until** date.
- **Monthly**: day of month + Repeat Until (within the next **6 months**). Day 31: "Last day of every month" or "Day 31 whenever available".
- No daily option, no repeat count.
- Network scope conflict: "all social channels" vs "Instagram Business Profiles only" (older pages).
- zoho.com publishing page calls this "post recycling". No separate evergreen recycling queue was found.
Sources: KB/publishing-and-scheduling/scheduling-posts/articles/repeating-posts ; publishing-scheduling-overview ; https://www.zoho.com/social/social-media-publishing.html

#### 4.5 Pause / resume (brand-wide)
- Settings > Brand Settings > Publishing > Publishing Preferences > **Pause Posts**. Asks for a team message (default or own), posted in Collaborate. Banner text: "All scheduled posts for this Brand are currently paused".
- Brand Admin / Portal Admin only; Standard plan and above. One brand at a time.
- While paused: users can still create and schedule (one-time alert pop-up). Team gets email and Team Notification.
- Resume from Publishing Preferences, Scheduled/Unpublished views or the Calendar **Resume** button. Posts whose time passed go to Unpublished > **Unattempted Posts** (edit, discuss, publish now, **Reschedule**). The rest publish on schedule.
- Clients get nothing unless tagged or added as team members.
Sources: KB/publishing-and-scheduling/scheduling-posts/articles/pause-and-resume-scheduled-posts ; KB/faqs/publishing-and-scheduling/publishing-and-scheduling-posts/articles/pause-and-resume-posts-frequently-asked-questions

#### 4.6 Publishing groups
- Named sets of channels across brands. Settings > Preference > Publishing > **Create New Group** (channels + name > Save). Created by admins only. Premium, Agency, Agency Plus.
- Compose: **+** > Sort by groups > select a group.
- Edit/delete, limits: unconfirmed.
Source: KB/publishing-and-scheduling/publishing-posts/articles/publishing-groups

#### 4.7 Retweets
- Retweet from Monitor columns, Posts > Published (X), or Notifications. Publishing window shows the tweet; add quote/comment; options **Retweet Now**, Schedule for a specific date, Add to Queue, SmartQ slot.
Source: KB/publishing-and-scheduling/scheduling-posts/articles/scheduling-retweets

---

### 5. Bulk Scheduler (CSV / XLS / XLSX)
- Open: dropdown next to New Post > **Bulk Schedule**. Plans: Professional, Premium, Agency, Agency Plus. Sample files can be downloaded in the window.
- Files: .CSV, .XLS, .XLSX. Max **350 posts per file**.
- Column order (as stated): **Schedule Time, Post Content, Link, Media, GMB Button Name, GMB Link**. Optional: Link, Media, GMB Button Name, GMB Link. A **Channels** column is also mentioned (exact header: check the sample file; unconfirmed). Pinterest: IMAGE URL 1, IMAGE URL 2, ... columns.
- Date/time: choose the format in the upload window; values must match it exactly, with leading zeros (09:30). Each post must be at least **1 hour** after upload.
- Channels column: XLS/XLSX comma-separated; CSV the whole list in double quotes ("Facebook, X, Instagram"). Channel and GMB button values are case-insensitive. If channels are in the file, none need to be picked in the pop-up.
- Channel names supported: Facebook, X, LinkedIn, LinkedInProfile, Instagram, GoogleMyBusiness, YouTube, Pinterest, TikTok, Mastodon, Bluesky, Threads (Arattai is chosen in the window).
- CSV line break: `\n`. Excel: real line breaks.
- Media: public direct URLs ending .JPG or .JPEG (or a Social Library URL). Up to 10 images per post.
- GMB Button Name: Learn more, Sign up, Order online, Book, Buy.
- Upload flow: Upload file > date format > link shortener toggle > channels (from file or Add Channel) > Pinterest board > Arattai channel > confirm column order > approval toggle (sends all posts to the brand approvers) > **Proceed to Review** > Next > Preview > **Schedule**.
- Review: each row is "with errors" or "completed". Error rows can be edited, moved to draft or deleted.
Source: KB/publishing-and-scheduling/scheduling-posts/articles/bulk-scheduler ; media-and-link FAQ ; publishing-on-pinterest.

---

### 6. Managing posts

#### 6.1 Posts tab sections
| Section | Content | Actions |
|---|---|---|
| Published Posts | date/time, content, Engagement Rate, Interactions. Sort: Date (range), Likes, Comments (high to low); data up to 400 days | ⋯: Edit (YouTube, Mastodon, GBP only), Delete (all except Instagram), Discuss, Embed Post, Edit as New Post, Copy URL, Retweet (X) |
| Scheduled Posts | time, channels, content | edit, reschedule, publish now, discuss, delete |
| Approvals | status, reviewers | approve, reject, status, comment, bulk |
| Unpublished Posts (shown only if any) | **Unattempted** (request error, or time passed while paused) and **Failed** (duplicate post, channel needs reconnect, wrong image size) | Reschedule / "Schedule again", "Retry" (publish now), edit; filter ▼ Failed / Unattempted |
| Drafts | unscheduled posts | edit (**Update draft**), discuss, schedule, publish |
| Calendar | see 6.3 | |
- Post details page: Post Details (content, likes, comments), Post Statistics (reactions, engagements, impressions, reach, video views, audience; per network), URL Statistics (clicks, location, device).
- "Posted by Zoho Social" tag shows in Published Posts; only page managers see it.
- Disconnected channel: posts not sent; after reconnecting, future posts go out, past ones become Failed.
- Reactions: Facebook view-only (Like, Love, Haha, Wow, Sad, Angry, Care); LinkedIn view/add/delete (Like, Celebrate, Support, Love, Insightful, Funny).
Sources: KB/managing-posts/articles/viewing-and-managing-posts ; .../viewing-and-editing-posts ; .../rescheduling-unpublished-posts ; composing FAQ ; KB/publishing-and-scheduling/tools-for-publishing-posts/articles/tracking-and-handling-reactions-in-facebook-and-linkedin

#### 6.2 Drafts and permissions
- Only users with publishing permission edit drafts. Portal Admin drafts: only Portal Admins. Brand Admins: drafts of Brand Admins and Users. Users: drafts of Users.
- Ownership moves to the user who last edits, publishes or schedules the draft.
- No publishing permission: view preview and discuss only. Channel-restricted roles manage only their channels.
- Draft limits, auto-save interval: unconfirmed.
Source: KB/managing-posts/articles/editing-drafts

#### 6.3 Publishing calendar
- Views: Month (default), Week, Day (hourly). Arrows / month picker. Regional holidays. Time zone (top right). Settings: time format, week start Sunday or Monday.
- Colours: blue scheduled, orange failed, green published, grey drafts.
- Create: New Post, dropdown (story, bulk). Date icon: add post, story, **note** (several per day) or **event** (description + date range 1 day to 6 months; one event per day).
- Drag and drop to another date reschedules; drag within a date changes the time. Click to edit, delete icon to delete.
- Filters: Type (posts, notes, events); Post type (unpublished, published, scheduled, drafts; Failed/Unattempted); Created by; Network; Schedule type (custom, bulk, custom queue, smart queue, repeat, RSS scheduled, scheduled stories).
- Posts made natively on the network do not show; native edits/deletes are not reflected.
Source: KB/managing-posts/articles/publishing-calendar

#### 6.4 Export
- Scheduled, draft, unpublished, awaiting approval (not published). PDF or CSV (one article adds PNG). Premium, Agency, Agency Plus.
- Posts > **Export** (top right) > format > channels + date range > Export; or select posts > Export; or single post ⋯ > **Export as PDF**. Filters: channel, post type, status, author, scheduled date.
- CSV fields: scheduled date/time, caption, GMB button, URL, media (re-usable in Bulk Scheduler). PDF: created/scheduled date, status, creator, channels.
Source: KB/publishing-and-scheduling/scheduling-posts/articles/exporting-posts

---

### 7. Approval workflow
- Roles: **Portal Admin** (approver by default in all brands), **Brand Admin** (approver by default), **Approver** (approve, update, reject; full publishing rights in their brands), **Limited Publisher** (drafts and Send for Approval only), custom roles.
- Approver must have publishing permission on all connected channels of the brand. Add: Settings > Brand Settings > Publishing > Publishing Preferences > **Add Approver** (also client members). Remove: Brand Members > uncheck Approver. A brand can have several approvers. If none exist, one can be added from compose.
- Send: compose > optional schedule > **Send for Approval** (admins can use the toggle too). Email to all brand approvers. Only single-brand posts. If no schedule is set, it publishes when approved (mobile).
- Statuses: **Yet to Review** (default), **Under Review**, **Approve(d)**, **Reject(ed)** (reason required; publisher notified), **Time Elapsed** (auto when not approved by the scheduled time; can still be approved and rescheduled).
- Any one approver's action decides. Yet to Review and Under Review can be switched. After approve or reject, status is final.
- Approve dropdown: **Approve and Publish Now**, **Approve and Add to Queue**.
- Editing: owner and admins can edit while pending. Editing an approved post sends it back as a new approval. A rejected post can be edited and resubmitted.
- Bulk: **Approve All / Reject All**, up to **200** posts.
- Post Activity panel: sent for approval, comments, status changes. Publisher notified in dashboard and by email (if enabled).
- Single-level only; multi-level chains: none found (unconfirmed / likely not supported).
- Bulk scheduler has an approval toggle.
- "Soft approval": Discuss a draft in Collaborate with visibility Everyone / Team Members / Custom Share.
Sources: KB/collaboration/articles/content-approvals-on-zoho-social ; KB/faqs/publishing-and-scheduling/publishing-and-scheduling-posts/articles/approvals-frequently-asked-questions ; KB/collaboration/articles/modify-discussions-and-manage-visibility

---

### 8. RSS feeds
- Posts > Content Library > **RSS Feeds** > **+New Feed**: search site name, paste feed URL, or upload .OPML/.XML. Sample feeds offered.
- Limits: Professional 10 feeds; Premium, Agency, Agency Plus 20.
- Feed Preferences (gear): channels, **prefix** text (before the URL), **suffix** text (e.g. hashtags) pre-filled in posts from that feed. Rename (pencil, tick), remove (bin > Delete).
- Article actions: pencil = compose post (Post Now / Schedule), mark as read (checkbox + double-tick), Move to Drafts, Hide, Discussion.
- Calendar has a "RSS scheduled" schedule type.
- **Auto-publish from RSS**: no official page describes it. Unconfirmed; the help shows only manual curation.
Sources: KB/collaboration/articles/rss-feeds ; KB/faqs/modules/articles/how-to-create-a-new-rss-feed-on-zoho-social ; publishing-calendar.

---

### 9. zShare browser extension
- Browsers: Ulaa, Chrome ("Google"), Firefox, Safari, Opera.
- Share selected text, an image (hover button, other page images shown as "Suggested Images"), a link with preview, or the page title.
- Brand dropdown; channels Facebook, X, Instagram, GBP, LinkedIn. Per-channel edits are marked "Edited" and can be restored.
- Schedule, repeat, CustomQ and SmartQ inside the extension. In Google search it shows X results (Top Results, People); adds zShare buttons on Facebook and X.
Sources: KB/publishing-and-scheduling/tools-for-publishing-posts/articles/zshare-browser-extension ; .../zshare-integration-with-google

---

### 10. Zia generative AI
- **Compose with Zia** (compose window): Category (social post, hashtags, Instagram captions, X threads, rephrase), Tone (examples: happy, sad, angry; full list unconfirmed), Language dropdown, Prompt, "include images" checkbox > **Generate** > **Add to Compose** / **Regenerate**.
- **Inbox replies**: reply, comment or rephrase with Zia; prompt, tone, language > Generate > **Add to Reply**. No image category.
- Credits per month: Free 5, Standard 40, Professional 40, Premium 80, Agency 80, Agency Plus 80. Cost varies by output (a caption "may" use 1). Result window shows credits used and left. Reset monthly, no carry-over. Plan change recalculates (floor 0).
- Not available in EU, South Africa, UAE data centres.
- **BYOK**: OpenAI key only; one key per org; edit/delete by the adder or Portal Admins; delete needs a new key before reuse. Only the prompt text is sent to OpenAI.
- Setup: Settings > Preferences > Create with Zia > AI credits tab (or enable BYOK + key) > enable Compose and/or Reply > privacy notice > **Proceed**. Usage history (View Details): date/time, user, activity category, credits.
- Permission per role: Settings > Roles & Preferences > Zia checkbox (Portal/Brand Admins assign).
- Errors: "Your monthly credits for AI content generation have been exhausted. Credits will renew next month"; "Your request was rejected as a result of our safety system."; "The key is invalid. Please enter a valid API secret key and try again."; "You don't have access to the OpenAI organization."; "You have reached the maximum monthly usage limit."; "Please try again after some time."; "Compose with Zia isn't enabled in your Zoho Social account yet."
- AI alt text, AI image generation details, length control: unconfirmed.
Sources: KB/generative-ai-zia/articles/zia-generative-ai ; .../ways-to-access-ai-in-zoho-social-zia-credits-byok-explained ; .../understanding-error-messages

---

### 11. Not found / unconfirmed (gaps for the dev team)
- Post templates / saved caption templates: no official page found.
- Evergreen recycling queue (beyond weekly/monthly repeat): not found.
- RSS auto-publish: not found (manual curation only).
- Live character counter UI, per-network counter behaviour: not documented.
- TikTok privacy / comments / duet / stitch / disclosure options: not documented.
- YouTube "made for kids", playlist, Pinterest/alt-text character limits, poll durations.
- Media/Social Library folders, tags, storage quotas, rename/move.
- Time zone rules for scheduling, minimum lead time for single posts, max future date.
- Multi-level approvals: not described (single approver decides).
- Publishing group edit/delete and limits.
- Several conflicts recorded inline: repeat-post scope, LinkedIn image count (9 vs 10), Pinterest image size, X thread scheduling, manual publishing video range, Reel limits.

---

# Part C. Zoho Social: Engagement (Inbox, Messages, Monitor, Live Stream, Notifications, Collaboration)

Research date: 25 Nov 2026. Sources: help.zoho.com (Zoho Social KB + FAQs) and zoho.com/social plan comparison. Every fact has a source URL. Anything the docs do not confirm is marked **unconfirmed**. Where two official pages conflict, both are shown and the conflict is flagged.

Product vocabulary used below:
- **Portal**: the account (organization). It holds one or more **Brands**.
- **Brand**: a group of connected social channels plus its team members.
- **Interaction**: one Inbox item (a message thread, comment, review, mention, and so on).
- **Connection**: a person or account that interacted with the Brand.

---

### 0. Plan availability (engagement features)

Source: https://www.zoho.com/social/plan-comparison.html

Key: Y = included, – = not included.

| Area | Feature | Free | Standard | Professional | Premium | Agency | Agency Plus |
|---|---|---|---|---|---|---|---|
| Inbox | Manage interactions, Filters, Custom views, Assignment rules, Activity tracking, Interaction history, Saved replies | – | – | – | Y | Y | Y |
| Inbox | WhatsApp messages, Telegram messages | – | – | – | Y | Y | Y |
| Messages tab | X, Facebook, Instagram, LinkedIn company page messages | – | – | Y | Y | Y | Y |
| Monitoring | Monitoring dashboard columns | – | – | 5 columns | 15 columns | 15 columns | 15 columns |
| Monitoring | X keyword search, X Lists, X timeline, X likes, X @mentions, X user search | – | – | Y | Y | Y | Y |
| Monitoring | Facebook page, Facebook notes, Facebook page @mentions | – | – | Y | Y | Y | Y |
| Monitoring | Instagram hashtag search; GBP questions; GBP reviews; LinkedIn @mentions | – | – | Y | Y | Y | Y |
| Monitoring | Potential leads/contacts interactions (CRM column) | – | – | – | Y | Y | Y |
| Monitoring | YouTube likes, dislikes, playlists, moderated comments | – | – | – | Y | Y | Y |
| Contacts | Contacts dashboard, Most engaged | – | – | – | Y | Y | Y |
| Contacts | Recently engaged, X followers/following, Mute/block accounts, Engagement interactions | – | – | Y | Y | Y | Y |
| Contacts | CRM leads, CRM contacts | – | – | – | Y | Y | Y |
| General | Notifications, Live stream | – | – | Y | Y | Y | Y |
| Collaboration | Internal discussion and team workspace, Approvals and workflows, Tagging discussions, Team voice/video call, Team chat | – | – | – | Y | Y | Y |
| Zia | Content creation with Zia | – | Y | Y | Y | Y | Y |
| Zia | Reply with Zia | – | – | – | Y | Y | Y |
| Zoho Desk | Create tickets from social updates, Chat with Desk owner, Desk reports, Desk contact information, Rule-based ticket creation, View ticket IDs | – | – | – | Y | Y | Y |
| Zoho CRM | Add leads, Chat with CRM owner, CRM reports, View CRM contact communications, View CRM status and information, Monitor leads and contacts, Rule-based lead capture | – | – | – | Y | Y | Y |

Other plan facts:
- Inbox: Premium, Agency, Agency Plus. Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/interact-using-inbox
- Private reply to comments: Professional, Premium, Agency, Agency Plus. Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/reply-privately-to-comments
- Ad comments in Inbox: Premium, Agency, Agency Plus. Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/view-and-engage-with-facebook-ad-comments-from-your-inbox
- WhatsApp and Telegram: Premium, Agency, Agency Plus.
- Monitor columns: Free and Standard get none. Source: https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/how-many-columns-can-i-add-under-the-monitor-tab-and-what-are-they
- Audit log, sentiment, and ad comments have no row in the plan comparison. Plan for these is **unconfirmed** (ad comments is stated in the KB, see above).

---

### 1. Inbox (unified interactions)

#### 1.1 Scope and supported networks

Sources: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/inbox-an-overview and https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/interact-using-inbox

- Networks: Facebook, Instagram, LinkedIn, X, Google Business Profile, YouTube, TikTok, WhatsApp, Telegram, Threads, Bluesky.
- TikTok is not available in Inbox in India, because of regulatory restrictions.
- Interaction types in one window: messages, comments, reviews, replies, mentions.
- Type filter values: **Comment/Reply, Message, Review, @Mention, Dark Comment, Question**. A dark comment is a comment on an ad post.

#### 1.2 List behaviour and threading rules

Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/guidelines-to-use-inbox

| Rule | Behaviour |
|---|---|
| Unread | Unread interactions show in bold. |
| Sort order | Sorted by the interaction's last activity time. |
| Own comments | Your own comments do not create interactions. |
| New message, previous interaction **Closed less than 24 h ago** | The closed interaction reopens. |
| New message after 24 h, status **Open** or **Under Review** | The message is added to the existing interaction, and its timestamp moves to the newest message. |
| New message after 24 h, status **Closed** | A new interaction is created. You cannot reply to the old one; you are redirected to the open interaction. |

"Reply and Close" setting (source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/set-up-workflows):
- When on, the interaction moves to **Closed** after you reply. A follow-up from the same user arrives as a new interaction.
- It is a brand-level setting, and there is also a checkbox at the bottom of each interaction.
- For **messages**, closure counts only after 24 hours. Until then, messages stay in the same interaction ID and window.
- For **other types**, it applies at once, and the next item opens in a new window.
- Replying from the Posts tab or the Messages tab marks the Inbox interaction as closed automatically.

#### 1.3 What becomes an interaction, by network

Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/guidelines-to-use-inbox

| Network | Becomes an interaction | Limitations |
|---|---|---|
| Facebook | Comments on your posts and ad posts (ad comments are treated as dark comments); mentions of your profile in posts; first messages; Page reviews | Inline comments update in real time. On a mention, the author shows as "Facebook user" (API limitation). Comments on a post where you are mentioned cannot be fetched unless they were posted from Inbox. You cannot like reviews from Social; like them on Facebook instead (https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/why-am-i-restricted-from-liking-the-reviews-given-to-my-facebook-page-on-zoho-social). |
| Instagram | Comments on your posts; mentions of your profile in posts and comments; first messages | A mention inside a comment counts as a Comment. A connection's post that mentions you counts as a Mention. Comments, and replies to comments, on posts where you are mentioned cannot be fetched; only comments made from Inbox show. Comment like counts are not shown (API). |
| X | Replies to your posts; mentions; first messages | None listed |
| Google Business Profile | All reviews and questions | One review per user. Only the profile configured in Social can reply. One reply per review. A question can be answered once. Questions cannot be edited through Social (API). |
| YouTube | Comments on your videos | Comments held for moderation show a warning and can be approved (posted to YouTube) or rejected (deleted). Only moderated comments become interactions; spam comments do not. |
| LinkedIn | Company page messages (see 2.3) | Only the last 60 days of messages show (API). |
| TikTok, Threads, Bluesky | Listed as supported | Which item types count, and their limits: **unconfirmed** |

#### 1.4 Interaction detail panel

Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/interact-using-inbox

| Element | Content |
|---|---|
| Reply box | Type a reply or prompt Zia, then click **Post** to publish it to the network. |
| Activity | Status changes, internal comments, team mentions. |
| User Info | Profile bio, follower count, and network-dependent details. Editable fields: **Email, Contact details, Website, Location, Description**. These can be edited or deleted. (The overview article lists Email, contact details, location, description.) |
| History | All past interactions with that user. |
| Copy link | Copies a shareable link to the interaction. |
| Follow | Subscribes you to updates on all activity for that interaction. |
| Sentiment | Positive, Neutral, Negative. Whether it is automatic or set by hand: **unconfirmed**. Automation can match on it (see 1.8). |
| Replies | Saved replies to insert. |
| Assignee | Dropdown to assign a member. For LinkedIn, the assignee is called the "DRI" (https://help.zoho.com/portal/en/kb/social/monitoring-conversations-on-social-media/articles/interact-with-your-audience-on-your-linkedin-page). |
| Priority | Low, Medium, High. Can be set during manual assignment (https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/inbox-an-overview). |

#### 1.5 Statuses, priority, organizing

Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/interact-using-inbox

- Status filter values: **Open, Under Review, Closed**.
- **Conflict:** the automation article lists "Open, On Hold, or Closed" as examples for Change Status (https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/inbox-automation). Whether "On Hold" exists is **unconfirmed**.
- Read/unread: there is a "View unread" checkbox filter, and bulk "mark as read".
- Priority: Low, Medium, High.

| Action | Effect |
|---|---|
| Archive | Removes the item from Inbox. It then shows in the **Archived Interactions** view. |
| Mute | Hides all future interactions from that user. Muted users create no notifications and no interactions. Unmute by removing the user from the Muted Users list (Inbox Preferences). |
| Mark as spam | Moves the item to the **Spam Interactions** view. |
| Delete | Permanently removes the interaction. Whether it also deletes on the network: **unconfirmed**. |
| Bulk actions | Select several items, then mark as read, mark as spam, or archive. |
| Like | Available on ad comments from Inbox (https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/view-and-engage-with-facebook-ad-comments-from-your-inbox). Like support per network: **unconfirmed**. |
| Hide comment (on network) | Not documented. **Unconfirmed**. |
| Block | Inbox block: **unconfirmed**. X mute/block lists exist in Connections (see 5). |

#### 1.6 Views and filters

Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/interact-using-inbox

- Default views: **All Interactions**, **Open Interactions**. System views: Archived Interactions, Spam Interactions.
- The view dropdown (top left) lists default, shared, and custom views. Views can be pinned.
- Filters: Channels (connected accounts), Type, Assignee, Priority, Status, Date (specific date or period), "View unread" checkbox.
- To create a custom view: open the view dropdown, click **Add custom view**, then set Name, Channels, Assignee, Type, Priority, Status, members to share with, and time period. Click **Submit**. A custom view can be pinned to the top and shared with portal members.

#### 1.7 Saved replies

Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/interact-using-inbox

- Work on every network except WhatsApp, which uses its own approved templates.
- Maximum **280 characters**.
- Organized in groups.
- To add one: Settings > Inbox Preferences > Saved Replies > **+ Add**. Enter a title, the message, and a group (existing or new), then **Save**. You can also click **Save as reply** while typing in Inbox.
- Telegram has "quick replies" (https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/integrate-telegram-with-inbox).
- Placeholders or variables in saved replies: **unconfirmed**.

#### 1.8 Inbox automation (assignment rules)

Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/inbox-automation
Location: Settings > Brand Settings > Inbox Preferences > Automation > **Create New Rule**.

Rule fields: Rule Name, Description, match mode **Match ANY / Match ALL**, conditions ("+ Add Condition"), one or more actions, **Save**.

| Condition | Operators / values |
|---|---|
| Channel | is / isn't |
| Interaction Type | is / isn't (comments, direct messages, replies, reviews, @mentions) |
| Content | Exactly matches with, Does not match with, Contains, Does not contain, Starts with, Ends with |
| Content Type | is / isn't / contains / doesn't contain (image, video, text) |
| Sentiment | is / isn't (Positive, Negative, Neutral) |
| Verified User | is from / is not from a verified account |
| Followers Count | greater than / less than / equal to / between |
| Creation Time | during / not during selected days and times |
| Sender | is / isn't |
| First-Time Interaction | Yes / No |
| Language | is / isn't (dropdown) |
| CRM Contacts | is / isn't / is a known contact / is an unknown contact (needs CRM) |
| CRM Lead | Yes / No |

| Action | Detail |
|---|---|
| Set Priority | High / Medium / Low |
| Change Status | Example values: Open, On Hold, Closed |
| Set Assignee | One member |
| Round Robin Assignment | All Members / Select Members / Role-based Members |
| Send a Reply | Saved template or custom message |
| Send a Private Reply | DM sent when a comment matches keywords; a public reply comment can also be posted |
| Move to Archive | |
| Mark as Spam | Removes the item from the active inbox |
| Close Interaction | |
| Send Alert | Email or in-app alert to chosen members, with an optional delay |

- Not stated in the docs: rule count limit, rule order or priority, whether the first match stops evaluation. All **unconfirmed**.
- **Conflict:** older FAQs say auto-replies to DMs are not possible (https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/can-i-set-up-an-auto-response-when-i-receive-a-direct-message) and that there is no auto-response to followers or page likes (https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/is-there-a-feature-to-send-responses-automatically-to-anyone-who-follows-me-or-likes-my-page). The current automation article includes "Send a Reply". Treat the FAQs as outdated. Auto-response to new follows or likes is still not documented.

#### 1.9 Inbox preferences ("Workflows")

Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/set-up-workflows
Location: Settings > Brand Settings > Inbox Preferences.

| Setting | Options |
|---|---|
| Reply and Close | On/off. See 1.2. |
| Muted Users | List of muted users; remove a user to unmute. |
| Mark as spam using keywords | Keyword list (examples: "exclusive deal", "free access"). Matching items go to Spam automatically. |
| Archive Interactions | Auto-archive interactions that had no action and were closed in the past **90 or 120 days**. |
| Clear Archived Interactions | Permanently delete items archived in the past **15 or 30 days**. |
| Ad comments tab | Link Facebook and Instagram ad accounts (see 1.10). |

#### 1.10 Ad comments

Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/view-and-engage-with-facebook-ad-comments-from-your-inbox

- Covers Facebook and Instagram ad comments. Premium and above.
- To set up: Settings > Inbox Preferences > **Ad comments** tab, then add a Facebook Ad Account and/or an Instagram Ad Account.
- Several ad accounts are allowed per channel.
- Only comments on ads run from a Page connected to Social appear.
- Actions: reply, like, and other follow-up actions.

#### 1.11 Private reply to comments

Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/reply-privately-to-comments

- Works on Facebook and Instagram Professional only. Professional plan and above.
- Available from Posts > Published Posts (hover a comment, then **Reply Privately**) and from the Inbox detail view.
- **One private reply per comment.**
- Must be sent within **7 days** of the comment.
- If the recipient does not answer within **24 h**, the conversation cannot continue.
- After sending, the button becomes the label "Replied privately". Hovering it shows the sent text and a link to the conversation. In Messages, the item is tagged as a private reply with a link to the original post.

#### 1.12 Zia (AI replies)

Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/interact-using-inbox

- Drafts a reply from a prompt, or rephrases a draft.
- Enable at Settings > General Settings > Preference > "Reply to an inbox interaction using Zia".
- Only users with the Zia permission can toggle it.

#### 1.13 WhatsApp

Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/integrate-whatsapp-with-inbox

- Premium and above. Needs a Facebook login (Meta business portfolio).
- To connect: Settings > Integrations > **Connect WhatsApp**, log in to Facebook, authorize, choose or create a business portfolio, add the profile and number, then choose the phone number.
- Enable/disable toggle (admins only). It affects only Social's Inbox; the WhatsApp account keeps receiving messages.
- Billing: you **buy credits**. A conversation is a 24-hour thread. Steps: Buy Credits, enter a count, Calculate Price, Make Payment. Price per conversation: **unconfirmed**.
- Templates: Show Details > **+ Create Template**. Fields:

| Field | Values |
|---|---|
| Category | utility / marketing |
| Name | text |
| Group | existing or new |
| Header (optional) | Text, or Media (image from Desktop or Media Library) |
| Body | text |
| Footer | text |
| Buttons (optional) | Call-to-action (type, name, phone with country code or URL); Quick reply (text, more via Add) |

- Template rules:
  - WhatsApp must approve every template ("typically within an hour"; review depends on category).
  - An approved template can be edited once every 24 h.
  - Each template has an on/off toggle; a disabled template does not show as a saved reply.
  - WhatsApp-only.
  - From 1 Apr 2025, marketing templates cannot be sent to US numbers.
- **24-hour window:** if the user's last message is more than 24 h old, only an approved template can be sent until the user writes again.
- Field length limits and media formats: **unconfirmed**.

**Bulk messaging (WhatsApp only).** Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/bulk-messaging
- Each recipient gets a 1:1 message, not a group message.
- Create a list: Settings > Integrations > WhatsApp > Show Details > **Bulk Messaging** tab > Add Bulk Messaging List. Enter a name, then add contacts by hand or import .CSV/.XLS/.XLSX. Up to **200 contacts per list**.
- Send: Compose, then the dropdown by New Post > **Create Bulk Message**. Pick the list, category, and template, preview, then **Post Now / Save as Draft / Schedule**.
- Needs an approved template.

#### 1.14 Telegram

Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/integrate-telegram-with-inbox

- Premium and above. Needs a bot token from BotFather.
- To connect: Settings > Integrations > Connect Telegram, then enter the Bot Token field and the bot username, then Connect. Edit Details changes the token.
- Enable/disable toggle; it affects Social's Inbox only.
- Users are reached by username; no phone number is needed.
- Quick replies are supported.
- Message types and limits: **unconfirmed**.

---

### 2. Messages tab (private messages)

#### 2.1 Scope and attachments

Source: https://help.zoho.com/portal/en/kb/social/monitoring-conversations-on-social-media/articles/messages

- Channels: Facebook Pages, X Profiles, Instagram Profiles, LinkedIn Company Pages, Bluesky. The same five are confirmed at https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/why-can-t-i-see-any-messages-from-some-of-my-social-channels-on-zoho-social. Other channels' DMs are not visible.
- A channel dropdown filter offers All or one channel.
- Content: text, images, emojis, audio/video (depends on the channel).
- Right panel: connection details and past interactions. For X it also shows recent posts.

| Channel | Audio | Video | Max size |
|---|---|---|---|
| Facebook | 1 per message, WAV/MP4 | 1 per message, QuickTime/MOV/MP4 | 25 MB |
| Instagram | 1 per message, WAV/MP4 | 1 per message, QuickTime/MOV/MP4 | 25 MB |
| X | not listed | 1 per message, QuickTime/MOV/MP4 | 512 MB |

- You can record audio in the tab for Facebook and Instagram, up to **2 min**.
- LinkedIn and Bluesky attachments: **unconfirmed**.

#### 2.2 Network rules

- Facebook: you can only reply to messages users send. You cannot start a conversation (API). Source: https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/why-am-i-unable-to-start-a-conversation-with-a-follower-from-the-connected-facebook-page
- X: you can start a DM only if the recipient has "Receive Direct Messages from anyone" on. Path: click the user in Live Stream, Monitor, or Connections > profile > Interactions > **Send Message**. Same source.
- Instagram: the professional account must turn on "Allow Access to Messages" (Settings and privacy > Messages and story replies > Message controls > Connected Tools), then Refresh. Source: https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/why-am-i-not-able-to-see-my-instagram-messages-on-zoho-social
- Facebook in Europe (from 16 Dec 2020): audio, video, and file attachments (not images) on new received messages are not visible. Source: https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/facebook-s-messenger-api-updates-for-europe-2020
- Messenger-specific 24 h / 7-day reply windows outside private reply: **unconfirmed** in the Social KB.

#### 2.3 LinkedIn Company Page messages

Source: https://help.zoho.com/portal/en/kb/social/monitoring-conversations-on-social-media/articles/interact-with-your-audience-on-your-linkedin-page

- The page admin must turn messages on in LinkedIn: Inbox > More > Inbox Settings > Message toggle.
- The member needs **Super Admin** or **Content Admin** on the LinkedIn page.
- Only the **last 60 days** of messages show.
- Reply from the Messages tab (**Reply**) or from Inbox (**Post**, Zia optional).
- Assignment: manual (Assignee dropdown), or a rule with "Channel is LinkedIn Company Page" and "Assign Interaction to".
- **Conflict:** an old FAQ says LinkedIn messaging is not possible (https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/can-i-receive-and-send-messages-to-linkedin-users). It is outdated.

---

### 3. Monitor (listening columns)

#### 3.1 Column types per network

Sources: https://help.zoho.com/portal/en/kb/social/monitoring-conversations-on-social-media/articles/social-media-monitoring and https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/monitoring-social-networks-on-zoho-social

| Network | Column types |
|---|---|
| Facebook Page | Reviews (Recommendations), Page Search, Page Mentions, Visitor Posts |
| X | Mentions, Timeline, Likes, Keyword Search, User Search, Lists |
| Google Business Profile | Reviews, Questions |
| Instagram Business (connected via Facebook only) | Hashtag Search, Tagged posts |
| LinkedIn Company Page | Mentions |
| YouTube | Likes, Dislikes, Playlists, Moderate Comments |
| Bluesky | Timeline, Likes, User search, Keyword search |
| Threads | Mentions, Keyword Search, Username Search (listed in the main article only) |
| Zoho CRM | CRM Interactions > Leads/Contacts (https://help.zoho.com/portal/en/kb/social/integrations/zoho-crm-integration/articles/adding-crm-leads-and-contacts-from-zoho-social) |

- Facebook Groups cannot be monitored (API).
- Instagram likes cannot be monitored (API change); hashtags still can. Source: https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/why-am-i-unable-to-monitor-posts-based-on-my-instagram-likes
- Competitor pages: tracking by user/page search is described generally ("competitor and influencer pages"). Which network supports a page-search column for another brand's page: Facebook Page Search and X User Search. Exact scope is **unconfirmed**.

#### 3.2 Limits

- Professional: **5** unique columns. Premium, Agency, Agency Plus: **15**. Free and Standard: none. Source: https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/how-many-columns-can-i-add-under-the-monitor-tab-and-what-are-they
- The main article says "5 keyword search columns per Brand" on Professional, so the limit is per Brand.
- Limits on keywords per column, on groups, and on columns per group: **unconfirmed**.

#### 3.3 Default columns at signup

- Facebook Visitor Posts (if a FB Page is connected), X Mentions (if X is connected), Leads/Contacts (if CRM is enabled). Source: https://help.zoho.com/portal/en/kb/social/monitoring-conversations-on-social-media/articles/social-media-monitoring

#### 3.4 Adding and managing columns

Sources: https://help.zoho.com/portal/en/kb/social/monitoring-conversations-on-social-media/articles/social-media-monitoring, https://help.zoho.com/portal/en/kb/social/monitoring-conversations-on-social-media/articles/removing-and-reordering-columns, https://help.zoho.com/portal/en/kb/social/monitoring-conversations-on-social-media/articles/grouping-monitor-columns

- Adding: **+ Add new column** (some articles say an orange + at bottom right) opens the Select Column Type panel.
  - Only channels you have connected can be used.
  - Columns already added are marked.
  - One-click columns: X Mentions/Likes/Timeline/Lists, FB Visitor Posts/Page Mentions, GBP Reviews/Questions, LinkedIn Mentions.
  - Search columns (keyword, user, page, hashtag): type the terms ("tags"), then **Save**.
- Refresh: an orange badge shows the count of new posts; click it to refresh. Manual refresh: hover the column top, then the circular arrow.
- Delete: column ellipsis (...) > **Delete column**, or the delete icon in the left list. Only **admins and the column owner** can delete, and deleting removes the column for **all users**. Restore after delete: **unconfirmed**.
- Reorder: drag and drop in the left list. This is **per user** and does not affect teammates.
- Columns are brand-level and shared. Columns created by a removed member are deleted with that member (https://help.zoho.com/portal/en/kb/social/faqs/manage-your-team/articles/team-members-and-roles-frequently-asked-questions).
- Groups:
  - Groups are **per user**; other users do not see your groups.
  - Create: **Add Group** > name > **Create**. Hover the group > **+** > choose columns > **Save**.
  - Ungrouped columns sit in "Default group".
  - Move a column by drag-and-drop or Move > group > Move.
  - Renaming or deleting groups: **unconfirmed**.

#### 3.5 Filters (X only)

Sources: https://help.zoho.com/portal/en/kb/social/monitoring-conversations-on-social-media/articles/tracking-conversations, https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/how-can-i-apply-multiple-filters-to-my-monitor-columns, https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/why-am-i-able-to-see-filters-for-only-my-twitter-columns-19-4-2018

- Filters work only on X columns; other networks lack API support. Multiple filters can be combined.
- Opened from the column ellipsis/dropdown (top right).

| Tab | Options |
|---|---|
| Content | Language; contains images / videos / links; exclude retweets; exclude a word or phrase |
| People | Tweets from a specific user |
| Places | Search an area and pick it from the dropdown |

- The CRM Leads/Contacts column also has a filter in its ellipsis menu. The options are **unconfirmed**.
- Boolean search operators: **unconfirmed**; not documented.

#### 3.6 Actions on monitored posts

- Like, comment, retweet/repost, reply. Source: https://help.zoho.com/portal/en/kb/social/monitoring-conversations-on-social-media/articles/social-media-monitoring
- Hashtag pop-up: click a hashtag to see posts using it. User pop-up (X only): profile, tweets, likes, followers, following. On other networks the click opens the network page. **View Conversation** shows the full X thread, where you can like, retweet, or reply. Source: https://help.zoho.com/portal/en/kb/social/monitoring-conversations-on-social-media/articles/tracking-conversations
- **+ Add to CRM** on hover. Source: https://help.zoho.com/portal/en/kb/social/integrations/zoho-crm-integration/articles/adding-crm-leads-and-contacts-from-zoho-social
- **Convert to Ticket** to Zoho Desk (FB and X). See 6.1.
- **Discuss**: starts a Collaborate thread. Source: https://help.zoho.com/portal/en/kb/social/collaboration/articles/team-collaboration
- X tweet ellipsis > **Add/Remove from a List**.
- Facebook Reviews column: view Recommendations and Ratings, reply with **Comment**. Likes are not possible. Source: https://help.zoho.com/portal/en/kb/social/monitoring-conversations-on-social-media/articles/managing-facebook-reviews-on-zoho-social
- YouTube moderation: approve or deny held comments from Monitor. Source: https://help.zoho.com/portal/en/kb/social/faqs/social-channels/youtube/articles/youtube-frequently-asked-questions
- Brand mentions in one place: X @Mentions plus FB Page Mentions plus keyword/hashtag columns for handle, hashtag, and plain name. Source: https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/is-it-possible-for-me-to-have-a-list-of-all-my-brand-mentions-in-one-place

#### 3.7 X Lists

Source: https://help.zoho.com/portal/en/kb/social/monitoring-conversations-on-social-media/articles/twitter-lists

- Add column > Lists shows **Your Lists** and **Subscribed Lists**. Click a list, then **Save**, to add it as a column.
- Create: **+ New Twitter List** with name, description, and privacy (private/public), then **Create**, then add members by name or @username.
- Edit: column (...) > **List Info** > pencil, or click the member count.
- Add users: List Info > **Add Users**. Or use "Add/Remove from a List" from a tweet, a Connections profile, an X message profile, or any X profile popup.
- Remove member: hover > Remove Member icon. Unsubscribe from subscribed lists. **Delete Twitter List** works on your own lists only.
- Limits: not stated. **Unconfirmed**.

#### 3.8 "Monitoring dashboards"

- No dashboard separate from the Monitor tab columns and groups is documented. **Unconfirmed**. Brand Health and Reports are outside this scope.

---

### 4. Live Stream

Sources: https://help.zoho.com/portal/en/kb/social/notifications-and-live-stream-1/articles/live-stream-9-6-2021, https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/how-does-notifications-differ-from-the-live-stream-on-the-home-page, https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/can-i-engage-with-my-audience-directly-from-the-livestream-tab-19-4-2018, https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/can-i-filter-my-live-stream-view-according-to-my-preferences, https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/why-is-the-know-more-option-missing-for-some-of-my-facebook-social-activities

- Location: the right panel of the Home tab. It is a real-time feed of brand engagement notifications.
- Each item shows the engagement with context, the count of this connection's engagements with the brand, followers/following counts, and a CRM Lead/Contact badge if CRM is integrated.
- Actions on an item:
  - Reply, Like, Comment, Tweet, Retweet, Direct Message.
  - Follow (X and Instagram).
  - **+Add to CRM**, **Discuss**, Convert to Ticket (Desk).
- Clicking an item opens a detail view with a snippet of the profile. **Know more** shows the person's recent interactions and recent posts. On Facebook, Know more appears only after the person has interacted **more than once**.
- Filtering or customizing Live Stream is **not possible**. What appears depends on the brand notification settings (see 7.1).
- Network coverage follows Brand Notifications: FB Page, X, Instagram. Coverage for other networks: **unconfirmed**.

---

### 5. Connections (contacts), mute and block

Sources: https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/what-all-can-i-view-from-the-connections-tab, https://help.zoho.com/portal/en/kb/social/integrations/zoho-crm-integration/articles/adding-crm-leads-and-contacts-from-zoho-social, https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/can-i-add-new-contacts-to-my-connections-list

| View | Content |
|---|---|
| All Connections | Everyone who interacted |
| Recently Engaged | Engaged recently |
| Most Engaged | Engages more than most |
| X Followers / X Following | X follow graph |
| Restricted Accounts (X) | Sub-views **Muted Accounts** and **Blocked Accounts** |
| CRM Leads / CRM Contacts | Only with CRM integration |

- The engagement views include only your followers, not accounts the brand follows.
- Filters: frequency or recency of interaction, CRM Lead vs Contact, social channel.
- Profile panel: contact details, social profiles, interaction history, CRM Info (including Owner; the **Ping** icon chats with the CRM owner), Desk Info, and **Add a Note** (comments and files for the team; CRM notes also show).
- Connections are created automatically from interactions.
- **Conflict:** one FAQ says you cannot add connections manually; the CRM article says you can add non-connections (users found in Monitor, influencers, brands). Treat this as **unconfirmed**.
- Mute/block accounts is a Professional+ feature (plan comparison). The steps to mute or block are not documented in the KB. **Unconfirmed**.

---

### 6. Integrations from interactions

#### 6.1 Zoho Desk ticket creation

Source: https://help.zoho.com/portal/en/kb/social/integrations/zoho-desk-integration/articles/creating-tickets-from-zoho-social

- Works only for Facebook and X (Twitter) posts.
- Manual creation from three places:
  - **Monitor** (Visitor Posts, keywords, @Mentions, Leads/Contacts posts, hashtags).
  - **Live Stream**.
  - **Posts tab / Recent Posts** (comments, @mentions).
- Manual steps: click **Convert to Ticket**, choose a **Department**, click **Convert**. A ticket ID is assigned, and clicking the ID opens the ticket in Desk. You can still reply in Social.
- Automatic creation (Social Admins only): Settings > **Ticket Creation**, configured per FB and X.
  - Choose the post/message types.
  - **Append Interval** under All Messages, for example 12 h: replies after the interval open a new ticket.
  - Trigger keywords mapped to a Desk Department.
- Connection profile **Desk Info**: contact details, ticket owner, all tickets, Average Response Time, Average Resolution Time, Happiness Rating.
- Brands can be created in Desk or imported from Social.
- Ticket creation from the Inbox interaction view itself is **unconfirmed** (the docs name only Monitor, Live Stream, and Posts).

#### 6.2 Zoho CRM lead/contact

Sources: https://help.zoho.com/portal/en/kb/social/integrations/zoho-crm-integration/articles/adding-crm-leads-and-contacts-from-zoho-social, https://help.zoho.com/portal/en/kb/social/integrations/zoho-crm-integration/articles/lead-generations, https://help.zoho.com/portal/en/kb/social/integrations/zoho-crm-integration/articles/zoho-crm-integration, https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/how-can-i-add-someone-as-a-crm-lead-1-6-2018

- Only Facebook Page and X are supported. LinkedIn and Instagram are not (API). The same FB Page and X profile must be connected in both Social and CRM.
- Manual **+Add to CRM** appears in Live Stream, Monitor (hover), Messages (FB/X private messages), Connections, and the user popup.
  - **Associate to Existing**: search and choose the Lead/Contact, then **Associate Lead/Contact**.
  - **Add New**: tab "Add as a lead" or "Add as a contact", choose the CRM **Layout**, enter the fields, then **Add**.
  - Field mapping: **unconfirmed**.
- Automatic: Settings > Brand Settings > **Lead Generation** tab, per-channel tabs. Each rule row has:
  - **Social Action** (likes, comments, tweets, mentions, +1s, direct messages).
  - **Criteria** (+Add Keyword).
  - **Add as** (Contacts/Leads).
  - **Status** toggle.
  - Only Brand and Portal Admins can configure it.
- Facebook Page likes cannot create leads. Source: https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/is-it-possible-to-create-a-lead-when-someone-likes-a-facebook-page-not-just-a-post-or-paid-ad
- Inbox automation conditions "CRM Contacts" and "CRM Lead" (see 1.8).
- Lead Forms are deprecated for signups on or after 19 Apr 2024 (use LeadChain).
- Leads Data permission: Brand Admin and User have it by default, and it can be restricted under Settings > Roles & Permissions. Source: https://help.zoho.com/portal/en/kb/social/faqs/manage-your-team/articles/team-members-and-roles-frequently-asked-questions

---

### 7. Notifications

#### 7.1 Social (brand) notifications: bell icon

Sources: https://help.zoho.com/portal/en/kb/social/notifications-and-live-stream-1/articles/social-notifications, https://help.zoho.com/portal/en/kb/social/faqs/modules/articles/can-i-filter-my-live-stream-view-according-to-my-preferences

- Supported: Facebook Page, X, Instagram. Not supported (API): Facebook Groups, LinkedIn, Google Business Profile, YouTube.
- Shown under the bell icon (top right). Only social actions show (likes, tweets, comments, DMs), with no context or actions. Context and actions are in Live Stream.

| Channel | Categories (social-notifications article) | Categories (FAQ) |
|---|---|---|
| Facebook Page | Visitor Posts, Comments, Messages, Likes | Posts by others, Comments, Messages, Likes |
| X | Mentions, Messages, Retweets, Likes, Replies | same |
| Instagram | Comments | Comments, Likes |

- Setup: Settings > Brand Settings > Notifications > social channels > choose a channel > **Add Member** next to each category. Remove a member by hovering, then the X icon. Added members are notified immediately.
- Only Portal and Brand Admins can edit this. **Conflict:** the article says added members get an email, while the FAQ says the bell icon. The delivery channel is **unconfirmed**.

#### 7.2 Email notifications

Source: https://help.zoho.com/portal/en/kb/social/notifications-and-live-stream-1/articles/email-notifications-9-6-2021

- Four events:
  1. Scheduled post goes live.
  2. Scheduled post fails.
  3. Channel disconnected (token expired); admins are prompted to re-authenticate.
  4. @mentioned or tagged in a discussion.
- Configured per brand on the same page as Brand Notifications, by choosing recipient members.
- Digest vs instant, and per-user opt-out: **unconfirmed**.
- Approvals: all approvers get an email when a post is sent for approval. The publisher gets an email on each status change. Source: https://help.zoho.com/portal/en/kb/social/collaboration/articles/content-approvals-on-zoho-social

#### 7.3 Team notifications

Source: https://help.zoho.com/portal/en/kb/social/notifications-and-live-stream-1/articles/team-notifications

- Team Notifications icon at top right, next to the bell.
- Each item shows date/time, tagged members, and a type icon.
- Triggers:
  - A new user joins the brand.
  - A new discussion starts.
  - Discussions, comments, or shares are updated.
  - Connections, posts, or reports are shared.
  - Scheduled posts are paused or resumed.
- Settings for this feed: **unconfirmed**.

#### 7.4 Inbox notifications

- An automation action "Send Alert" (email or in-app, optional delay) and **Follow** on an interaction. Sources: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/inbox-automation, https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/interact-using-inbox
- Muted users create no notifications.

#### 7.5 Mobile app

Source: https://help.zoho.com/portal/en/kb/social/zoho-social-mobile-app/articles/notifications-8-4-2019

- Settings > Notification Settings, per brand. Toggles:
  - Posts going live, Post failures, Engagement.
  - Engagement can be customized for FB and X: Posts by others, Comments, Likes.
- A brand mute toggle stops all social updates for that brand, but Instagram Publishing notifications still show.
- **Do Not Disturb** is in App Preferences. The doc's wording is unclear, and Instagram Publishing notifications are not delivered while it is on.
- Push for approvals: real-time push when a post arrives for approval. Source: https://help.zoho.com/portal/en/kb/social/zoho-social-mobile-app/articles/content-approvals-on-mobile (search snippet only; page not fetched, so **unconfirmed** detail).

---

### 8. Collaboration

#### 8.1 Collaborate tab and discussions

Sources: https://help.zoho.com/portal/en/kb/social/collaboration/articles/team-collaboration, https://help.zoho.com/portal/en/kb/social/collaboration/articles/starting-a-discussion, https://help.zoho.com/portal/en/kb/social/collaboration/articles/modify-discussions-and-manage-visibility

- What can be discussed (via a **Discuss** icon or ellipsis > Discuss):
  - Drafts, scheduled, published, calendar, and unpublished (failed) posts.
  - Brand mentions from Monitor, Live Stream, or Notifications.
  - Reports: Stats and Analytics (Reports > dataset > ... > Discuss).
  - Connections (from Monitor, Live Stream, Messages, Connections).
  - Posts in Monitor.
- A direct discussion starts from the blank text box in Collaborate. There is no title field documented.
- Visibility: **Everyone / Team Members (default) / Custom Share** (specific members). The owner can widen visibility later.
- Up to **10 images per discussion**. Documents can be attached in comments; types and sizes are **unconfirmed**.
- @tagging notifies the person, who can respond from Collaborate or the Home screen. Clients can be tagged too.
- The owner can edit the discussion at any time. Members can add, edit, or delete their own responses. Deleting a whole discussion: **unconfirmed**.
- Left filter: All Feeds, Discussions, Drafts, Posts, Scheduled Posts, Unpublished Posts, Connections, Reports.
- Clicking a member's avatar shows threads they created or joined.
- Character limits: **unconfirmed**.

#### 8.2 Chat and audio/video calls

Source: https://help.zoho.com/portal/en/kb/social/collaboration/articles/chat-audio-and-video-calls

- Started from a team member's avatar or a username hover pop-up via the chat icon or the audio/video call icon. Available in:
  - Collaborate (any filter category).
  - Posts: Published (PUBLISHED BY), Scheduled and Unpublished (SCHEDULED BY), Drafts (CREATED BY).
  - Reports > Scheduled Reports (RECIPIENTS).
- Also: chat with the CRM record owner (Ping) and with the Desk owner (plan comparison).
- Who can call, participant limits, and duration: **unconfirmed**. The underlying chat service is not named (likely Zoho Cliq; **unconfirmed**).

#### 8.3 Approvals (as collaboration)

Source: https://help.zoho.com/portal/en/kb/social/collaboration/articles/content-approvals-on-zoho-social

- Roles:
  - Portal Admin is an approver by default.
  - Approvers are set at Brand Settings > Publishing > Publishing Preferences > **Add Approver**. Only users with publishing rights on all of the brand's channels qualify.
  - Remove an approver by unticking Approver in Brand Members.
  - Clients can be approvers.
  - Limited Publishers can only draft or send for approval.
- Sending: compose > **Send for Approval**, and all approvers get an email.
  - Admins can toggle "Send for approval" for their own posts.
  - If there is no approver, you can add one from compose.
  - **Single-brand posts only.**
- Statuses:

| Status | Meaning |
|---|---|
| Yet to Review | Default |
| Under Review | Manually toggled from Yet to Review |
| Approved | Final |
| Rejected | Reason required, sent to the publisher; final |
| Time Elapsed | Automatic when the scheduled time passes unapproved; can be rescheduled once approved |

- Only Yet to Review and Under Review can switch between each other.
- Approve dropdown: **Approve and Publish Now**, **Approve and Add to Queue**.
- **One approver suffices.** Multi-level approval is not documented (**unconfirmed**).
- Bulk **Approve All / Reject All**, up to **200** posts.
- The Post Activity column records submissions, comments, and status updates. Publishers are notified in the dashboard and by email.

#### 8.4 Activity log and audit

- Per-interaction **Activity** shows status changes, internal comments, and team mentions. Internal comments and @mentions inside an Inbox interaction are confirmed, but the composer UI is **unconfirmed**. Source: https://help.zoho.com/portal/en/kb/social/managing-interactions/articles/interact-using-inbox
- **Audit Log**: Settings > Brand Settings > Audit log, **Portal Admins only**. Source: https://help.zoho.com/portal/en/kb/social/collaboration/articles/audit-log
  - Events logged:
    - Roles created and users invited.
    - Role and permission updates.
    - Custom role permission changes.
    - Brands added or deleted.
    - Members added or removed (Brand/Portal).
    - Timezone changes.
    - Posts paused or resumed.
    - Channels authenticated or re-authenticated.
  - The UI shows **1 month**; archives are kept up to **1 year**.
  - Inbox actions (assign, reply, close) are not listed as audited events.
  - Fields, filters, and export: **unconfirmed**.

---

### 9. Permissions relevant to engagement

Sources: https://help.zoho.com/portal/en/community/topic/social-media-simplified-with-zoho-social-the-need-for-a-social-media-approval-process (Zoho community post by Zoho; may be dated) and https://help.zoho.com/portal/en/kb/social/faqs/manage-your-team/articles/team-members-and-roles-frequently-asked-questions

| Role | Default permissions |
|---|---|
| Portal Admin | Publishing, messages, comment/reply, advanced reports, leads data, Zia, inbox; approver by default; audit log |
| Brand Admin | Same set as Portal Admin, including inbox; can edit notification and lead-generation settings |
| User | Publishing, messages, comment/reply, advanced reports, leads data, Zia; **no inbox** |
| Limited Publisher | Messages, comment/reply, advanced reports, Zia; no direct publishing; can access Collaborate |
| Client | Limited; can be an approver and be tagged; details **unconfirmed** |
| Custom role | Settings > Brand Settings > Roles and Permissions > Create New Role, then tick permissions. The full permission list is **unconfirmed** |

---

### 10. Gaps (not found in official docs)

- Hide or unhide a comment on the network, and whether Inbox Delete also deletes on the network.
- Block from Inbox; the steps to mute or block on Connections.
- The status set: is "On Hold" real alongside Open / Under Review / Closed?
- Sentiment: automatic (Zia) or manual?
- Automation rule limits, ordering, and stop-on-match.
- Like or react support per network in Inbox.
- TikTok, Threads, and Bluesky interaction rules.
- Placeholders in saved replies; the number of saved replies allowed.
- Desk ticket creation from Inbox (docs only cover Monitor, Live Stream, Posts); networks beyond FB and X.
- CRM field mapping.
- Live Stream coverage per network.
- Email digest options.
- Call or chat provider and limits.
- Monitor keyword limits and search operators.
- Audit log fields and export.
- The "Engagements" feature by that name is not documented. Closest: the Contacts "Engagement interactions" plan row and the Connections engagement views.

---

# Part D. Zoho Social: Analytics, Integrations, Mobile, zShare, Toolkit, Linkthread, MCP, API

Research date: 25 Nov 2026. Sources: official Zoho pages only (help.zoho.com, zoho.com, zohoflow.com). "Unconfirmed" means no official page found that states it.

---

### 1. Reports and analytics

#### 1.1 Reports tab: structure
Source: https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/reports-tab

- Reports are generated automatically for connected channels: Facebook Page, X (Twitter) profile, Instagram Business profile, LinkedIn Company Page, Google Business Profile (GMB), YouTube channel, and Pinterest profile. Other articles also cover LinkedIn Profile, Threads, Bluesky, TikTok and Mastodon.
- Pre-made report groups (which ones appear depends on the network):

| Report group | Content |
|---|---|
| Summary | Basic stats per channel |
| Audience | Followers and demographics |
| Posts & Engagement | Posts and the engagement they received |
| Performance | Page/profile views and clicks |
| Reach & Impressions | Reach and impression data |
| Reviews & Questions | GMB only |
| Messenger | Facebook Messenger connections gained and lost |
| Video Performance | YouTube views, watch time, search keywords |
| Cards & End Screen | YouTube cards, end screens, card teasers |
| Reels & Engagement | Instagram Reels |
| Story | Instagram Stories |

- Interactions on a card (https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/discuss-reports): hover the pop-up icon to see a detailed graph. Clicking a metric under a graph hides that series so the others can be compared. The card's ellipsis menu has Discuss, Export as PDF/PNG, Send as Email and Schedule.

#### 1.2 Two data types (Facebook, LinkedIn Page, Threads, Bluesky)
Sources: the Facebook, LinkedIn, Threads and Bluesky report articles (URLs in 1.3).
- **Lifetime:** all engagement a post has received from publication until today, counted against the period the post was published in.
- **Time-series:** engagement received inside the selected range, whatever the post's publish date.
- **Bluesky:** "Estimated time-series". Daily values are estimated from day-to-day changes in lifetime totals and need lifetime snapshots taken on consecutive days.

#### 1.3 Per-network report metrics

**Facebook Page** (https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/reports-for-facebook)
- Summary
  - Audience summary: total followers; new followers (with daily average); followers lost (with daily average).
  - Post & engagement summary: engagement on published posts; total posts; engagement over time; engagement by type (image/video/text/link); top post.
  - Performance summary: page profile views (total and daily average).
  - Views summary: Total Views; Unique Views; Organic vs Paid Views.
  - Messenger summary: connections gained, connections lost, daily average.
- Audience: follower growth (new, lost, net).
- Posts & Engagement
  - Posts vs engagement (time-series); published posts and their engagement (lifetime).
  - Posts by type (image/link/text/video).
  - Top posts by reactions, comments, shares, engagement or engagement rate.
  - Top connections: most liked, commented, mentioned, messaged, engaged.
  - Posts by publishing app.
  - Best time to post: heat chart, where denser colour means more engagement.
  - Engagement actions over time; engagement breakdown (reactions vs comments).
  - Reactions breakdown: Like, Love, Surprise, Laugh, Sad, Angry.
- Performance: page profile views, logged-in vs logged-out viewers.
- Views: Views vs Unique Views; Organic vs Paid; Viral vs Non-viral.
- Messenger: connection growth; connections lost (blocked or reported).
- Changes:
  - The Reach metrics end 15 Jun 2026 and are replaced by Views (Page Reach becomes Views vs Unique Views, and so on).
  - Removed 15 Nov 2025: Page Likes Growth, and Page Likes by Language, City and Country.

**Instagram** (https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/reports-for-instagram)
- Summary
  - Audience: total followers; new followers (with daily average).
  - Posts: total posts; total engagement; top post; engagement by post type.
  - Performance: profile views.
  - Reach summary.
- Audience: follower growth; likes by country (map, top 5), language, city, gender and age group.
- Posts & Engagement
  - Posts vs engagement.
  - Posts by type (carousel/image/video).
  - Top posts by likes, comments, engagement or engagement rate.
  - Best time to post; post engagement; engagement by type; engagement actions.
- Performance: profile views; profile clicks; CTA clicks by type (for example Email, Get directions).
- Reach: reach over a period.
- Reels: Reels vs engagement (likes/comments/shares/saves); plays vs reach; top Reels by engagement, likes, comments, shares, reach or plays; engagement actions; engagement by type (%).
- Stories (**not available when Instagram is connected directly rather than through Facebook**)
  - Stories vs engagement (replies, exits, taps forward, taps back); engagement by type; top stories by engagement, replies or impressions.
  - Number of stories; story reach; followers vs story reach; average exits vs number of stories.
  - Completion rate = views on the first story ÷ views on the last story (%).

**X / Twitter** (https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/reports-for-twitter)
- Summary: followers; new followers (with daily average); total tweets; engagement (likes + retweets + replies); top tweet; engagement by tweet type (video/image/link/text/GIF/poll).
- Audience: follower growth (gained or lost).
- Posts & Engagement
  - Tweets vs engagement; tweets by type.
  - Top tweets by likes, replies, retweets, engagement or engagement rate.
  - Top connections; tweets by publishing app; best time to tweet.
  - Tweet engagement; engagement by type; engagement actions; messages and mentions received.

**LinkedIn Company Page** (https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/reports-for-linkedin)
- Summary: total followers, new followers, organic vs sponsored; posts; lifetime engagement; top post; engagement over time; engagement by type; page views; unique views; career page clicks.
- Audience: follower growth; organic vs sponsored; followers by country (map, top 5), industry, job function, seniority and company size.
- Posts & Engagement
  - Time-series: posts vs engagement; engagement actions (reactions/shares/clicks/comments); engagement breakdown; clicks vs unique clicks.
  - Lifetime: published posts and their engagement; engagement by type.
  - Other: posts by type; top posts by likes, comments, shares, engagement or engagement rate; posts by app; post impressions vs reach.
- Performance
  - Page views vs unique views; views by tab (Jobs/About/People).
  - Views by country, industry, job function, seniority and company size.
  - Career page clicks on web vs mobile; career page click distribution.

**LinkedIn Profile** (https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/reports-for-linkedin-profile)
- Summary: followers (growth % and daily average); new followers; posts; engagement; top post; engagement by type.
- Audience: follower growth.
- Posts & Engagement
  - Posts vs engagement; posts by type.
  - Top posts by likes, comments, reshares, engagement, reach or impressions.
  - Posts by app; engagement; engagement by type; actions (reactions/comments/reshares); post impressions.
- Rule: a profile connected with older permissions shows no reports. Reconnect it under Settings > Social Channels.

**YouTube** (https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/reports-for-youtube)
- Summary
  - Subscribers: count, gained, lost (with daily averages).
  - Videos: total videos; engagement (likes/dislikes/comments); top video; top country.
  - Watching: views; estimated minutes watched; top search keywords.
  - Cards & end screens: end screen, card teaser and card impressions and clicks.
- Audience: subscriber growth; subscribers by country (map, top 5).
- Posts & Engagement
  - Videos vs engagement.
  - Top videos by likes, dislikes, comments, engagement or engagement rate.
  - Engagement actions (likes/dislikes/shares/comments); engagement by country.
  - Sharing service (where videos were shared); engagement by subscribed status.
- Video Performance
  - Views and estimated minutes (also by country); top videos.
  - Playback location type (for example Shorts, search); traffic source type; embedded playback locations; traffic from external URLs.
  - Search keywords; views by device (desktop/mobile/tablet/TV); views and minutes by subscribed status.
- Cards & End Screen: impressions vs clicks for end screen elements, card teasers and cards, each also broken down by type (video/channel/playlist).

**Google Business Profile** (https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/reports-for-google-my-business)
- Summary
  - Reviews: review count, added/removed with daily average, average rating.
  - Performance: Search Impressions, Map Impressions (daily average and growth rate); Visitor Actions (% website/directions/call); Conversations (message requests).
- Reviews & Questions: review growth.
- Performance: search impressions; map impressions (desktop/mobile; one user counts once per day); visitor actions (totals).
- Deprecated (also removed from custom reports)
  - Question count and growth.
  - Listing Search Trend, Listing Views, Photo Views, Photo Views by Search, Post CTA Clicks.
  - Follower Growth, Audience Summary.

**Pinterest** (https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/reports-for-pinterest)
- Summary only: Performance, Engagement and Impression summaries.
- Metrics:
  - Pin click and pin click rate.
  - Save and save rate.
  - Outbound click and outbound click rate.
  - Engagement = saves + pin clicks + outbound clicks + carousel swipes + idea pin swipes + collection clicks.
  - Engagement rate.
  - Impression.
  - Every rate = metric ÷ impressions.

**Threads** (https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/reports-for-threads)
- Summary: followers, new followers, posts, lifetime engagement, top post, engagement over time, engagement by type, profile views.
- Audience: follower growth; followers by country and city.
- Posts & Engagement
  - Time-series: posts vs engagement; actions (likes/replies/reposts/quotes); breakdown.
  - Lifetime: published posts and their engagement; engagement by type.
  - Other: posts by type (text/image/video/poll/carousel/audio); top posts by likes, replies, reposts, quotes, engagement or engagement rate; posts by app.
- Performance: profile views.

**Bluesky** (https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/reports-for-bluesky)
- Summary: followers, new followers, posts, lifetime engagement, top post, engagement by type.
- Audience: follower growth.
- Posts & Engagement
  - Estimated time-series: posts vs engagement; actions (likes/replies/reposts/quotes); breakdown.
  - Lifetime: published posts and their engagement; engagement by type (image/video/text/link/quoted).
  - Other: posts by type (text/image/video); top posts by likes, replies, reposts, quotes, engagement or engagement rate; posts by app (likes/views/replies/reposts/quotes); messages and mentions.

**TikTok, Mastodon:** both appear in Brand Health, bulk CSV and post statistics. The full report article content was not fetched (unconfirmed). Mastodon and Bluesky post-analytics articles exist under the post-statistics category.

#### 1.4 Brand Health
Source: https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/brand-health
- Stats bar metrics: Total Followers, New Followers, No. of Posts, Reach, Engagements.
- Engagements = likes + comments + shares on posts created in the last 30 days.
- Fixed window: the past 30 days. Green means growth and red means decline. A "?" tooltip explains each metric.
- Supported networks: Facebook Page, X, LinkedIn Profile, LinkedIn Page, Instagram Business, YouTube, TikTok, Mastodon, Threads, Bluesky.
- API limits:
  - X and TikTok show no Reach.
  - GMB shows no followers, new followers or post count.
- Clicking a metric opens a 30-day detail view. From there you can Discuss, export (PDF/PNG/CSV), email or schedule it.
- No score or index is described.

#### 1.5 Hashtag reports
Source: https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/hashtag-reports
- Path: Reports > All Reports > Hashtag Reports. Covers only hashtags used in the brand's own posts on connected channels.
- Controls: channel filter; sort by likes, engagement, comments, shares or total posts; date range (day/week/month/quarter/custom); word cloud of top hashtags.
- Overview metrics: posts, likes, comments, shares, engagement.
- Per-hashtag page:
  - Posts by channel; top posts (by likes or comments).
  - Engagement actions (likes/shares/comments/clicks); engagement by channel.
  - Post clicks; quotes by channel; impressions.
  - Video views; video watch duration.
- Compare: hover a hashtag > Compare > select hashtags > Compare Hashtags.
  - **Maximum 4 hashtags** per comparison.
  - Compared metrics: posts, engagement, clicks, impressions, video views.
  - Saved comparisons appear in a dropdown.
- Hashtag reports can be exported, shared and scheduled.

#### 1.6 Custom reports (dashboards)
Source: https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/creating-custom-reports
- Steps: Reports > Custom Reports > Create Dashboard (+) > enter a name > Add Cards.
- Cards are picked from the standard network report cards. Deprecated GMB cards are not available.
- Card catalogue, layout rules and card limits: unconfirmed.
- Plan: Premium and above (pricing page "Custom reports" sits under Premium, https://www.zoho.com/social/pricing.html).

#### 1.7 Date ranges, grouping and data history
Source: https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/filter-data-based-on-date-in-reports
- Select a channel, set a custom date range, then click Update.
- **View By**: Day / Week / Month / Quarter. It applies to all cards, and each card can be regrouped on its own. The same date filter applies to hashtag reports.
- Maximum range by plan:

| Plan | Maximum range |
|---|---|
| Standard | 15 days |
| Professional | 3 months |
| Premium, Agency, Agency Plus | 1 year |

- Data exists only from the date the channel was connected to Zoho Social. There is no backfill before connection.
- Named presets for social reports: unconfirmed. CRM reports use: Current Week, Last Week, Current Month, Last Month, Last 7, 15 or 30 Days.
- Period-over-period comparison: not documented (unconfirmed).

#### 1.8 Export, email, schedule
Source: https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/sharing-and-scheduling-reports

| Action | Where | Formats |
|---|---|---|
| Export card | Card ellipsis > Export as PDF / PNG | PDF, PNG |
| Export section | Channel report > Export (top right) | PDF, PNG |
| Bulk export | Reports > Export > Bulk Export as CSV > pick channels > pick period | CSV, **max 90 days** |
| Email | Card > Send as Email, or section > Email > Send as Mail | PDF or PNG |
| Schedule | Card > Schedule, or section > Email > Schedule | PDF or PNG, weekly or monthly |

- Bulk CSV files by network:

| Network | CSV files |
|---|---|
| Facebook | Fans and Impressions, Page Actions, Page Engagements, Post Analytics |
| X | Page Analytics, Post Analytics |
| LinkedIn Page | Career Page Analytics, Page Analytics, Page Views, Post Analytics |
| Instagram | Page Analytics, Post Analytics |
| GBP | Brand Analytics |
| YouTube | Channel Analytics, Post Analytics, Subscribers Status Analytics |
| TikTok | Page Analytics, Post Analytics |

- Email form fields: recipient emails (external addresses allowed), subject, message, format, "Password Protect" (minimum 6 characters, can differ for each send), and "Send Me a Copy".
- Schedule form fields: team members, date range, time, format.
- Scheduled report list: Reports > Scheduled Reports icon. It shows the date range, frequency, file type and recipients of reports you created or that were shared with you.
- Plans: export and scheduling require Premium, Agency or Agency Plus. The pricing page lists "scheduled/emailed reports" and "agency-branded reports" under Agency, so the two sources disagree.
- PPT export: not documented (unconfirmed). It appears not to exist.

#### 1.9 Discuss (share a card with the team)
Source: https://help.zoho.com/portal/en/kb/social/analytics/social-media-reports/articles/discuss-reports
- Card ellipsis > Discuss > "Share with Team members" or "Custom Share" (pick members) > optional message > send.
- The recipient gets a notification.

#### 1.10 Branded or white-label reports, competitor reports
- "Agency-branded reports" is listed on the Agency plan (https://www.zoho.com/social/pricing.html). The branding options (logo, colours, cover) are unconfirmed. No help article was found.
- Competitor reports: no help article exists under Analytics. Competitor tracking is a Monitor-tab feature, covered by the engagement part. A dedicated competitor analytics report is unconfirmed.

#### 1.11 Post statistics (per post)
Overview source: https://help.zoho.com/portal/en/kb/social/analytics/post-statistics/articles/analyzing-social-media-post-statistics-an-overview
- Path: Posts tab > channel > post > **Post Stats** tab.
- Networks: Facebook (Pages only), X, LinkedIn (Pages only per the overview; a separate LinkedIn Profile article also exists), Instagram, GBP, YouTube, Pinterest, TikTok Business, Mastodon, Threads.
- Available on Standard, Professional, Premium and Agency.

| Network | Metrics | Source |
|---|---|---|
| Facebook | Like/Love/Wow/Haha/Angry/Sorry, total reactions; comments; shares; clicks (and click distribution: link/photo/other); negative feedback (and its distribution); total engagement; engagement rate (= engagements ÷ impressions); engaged fans; engaged users; impressions (total, unique, fan, unique fan, viral, unique viral, by story type). Video: 3 s views (total, unique, autoplay, click-to-play, sound-on); unique 10 s/30 s; 10/15/30/60 s views; retention graphs; duration; total and average view time; age/gender; view time by top 45 regions and countries | https://help.zoho.com/portal/en/kb/social/analytics/post-statistics/articles/analytics-for-facebook |
| Instagram | Likes, comments, saved, engagement (likes + comments + saves, without shares), reach, views, total interactions (including shares, for Reels), video plays (≥1 ms, Reels) | https://help.zoho.com/portal/en/kb/social/analytics/post-statistics/articles/analytics-for-instagram |
| X | Likes, replies, retweets (without quotes), quote tweets, URL link clicks, profile clicks, impressions; video duration, views, quartiles (25/50/75/100%). **Only tweets from the past month; not for retweets** | https://help.zoho.com/portal/en/kb/social/analytics/post-statistics/articles/analytics-for-twitter |
| LinkedIn Page | Likes, comments, shares, total clicks (signed-in users only), engagement rate, impressions, engagement chart; video views, viewers, time watched, time watched for ≥3 s views | https://help.zoho.com/portal/en/kb/social/analytics/post-statistics/articles/analytics-for-linkedin |
| YouTube | Likes, dislikes, comments, shares, subscribers gained and lost; annotation CTR and close rate; end screen clicks and impressions; card clicks, card click rate, card teaser clicks and rate, card and teaser impressions; views, average view duration, estimated minutes; age/gender; country; search keywords; retention (audience watch ratio, relative retention) | https://help.zoho.com/portal/en/kb/social/analytics/post-statistics/articles/analytics-for-youtube |
| URL (short link) | Clicks, unique clicks, click impressions; breakdown by referrer (direct vs referred), browser, device, country, platform (OS) | https://help.zoho.com/portal/en/kb/social/analytics/post-statistics/articles/analytics-for-url |

- Not fetched: the LinkedIn Profile, Bluesky, Mastodon, Threads, Pinterest and GBP post-stat articles (they are listed at https://help.zoho.com/portal/en/kb/social/analytics/post-statistics).

#### 1.12 Data retention
- No retention policy is published. History starts at channel connection (1.7). Bulk CSV covers 90 days. X post metrics cover the past month only. Anything else is unconfirmed.

---

### 2. Integrations

#### 2.1 Zoho CRM
Sources:
- https://help.zoho.com/portal/en/kb/social/integrations/zoho-crm-integration/articles/zoho-crm-integration
- https://help.zoho.com/portal/en/kb/social/integrations/zoho-crm-integration/articles/adding-crm-leads-and-contacts-from-zoho-social
- https://help.zoho.com/portal/en/kb/social/integrations/zoho-crm-integration/articles/lead-generations
- https://help.zoho.com/portal/en/kb/social/integrations/zoho-crm-integration/articles/crm-reports

- **Brand link:**
  - Channels in Zoho Social appear as a Brand in the CRM Social tab.
  - Import path in CRM: Settings > Channels > Social > Brand Settings > import Brands from Zoho Social. If the brand is missing, click + and connect the same channels.
  - Channels set up in CRM appear in Zoho Social on first open.
  - The same FB Page and X profile must be connected in both products.
- **Scope:** CRM integration (lead generation, CRM reports) works only for **Facebook Page and X profile**. LinkedIn and Instagram are excluded because of API limits.
- **Manual add to CRM:**
  - Available from Live Stream (Home), Monitor (posts and a "CRM Leads/Contacts" column under CRM Interactions), Messages (FB and X private messages), Connections, and any user found in Monitor.
  - Flow: **+Add to CRM**, then either **Associate to Existing** (link to a current lead or contact) or **Add New**. Add New offers the "Add as a lead" or "Add as a contact" tab, a **Layout in CRM** dropdown, the fields, and Add.
- **Auto lead generation rules** (Settings > Brand Settings > Lead Generation > channel tab):

| Column | Content |
|---|---|
| Social Action | The trigger (like, comment, mention, DM, and so on) |
| Criteria | Conditions, including keywords added with +Add Keyword |
| Add as | Leads or Contacts |
| Status | Toggle on or off |

  - Only Brand Admins and Portal Admins can configure these rules.
- **CRM info on a connection profile:**
  - Contact details, linked channels, interaction history and a Lead/Contact label.
  - **CRM Info** tab with the CRM fields.
  - Owner name, with a Ping icon that chats with the owner.
  - Notes: add a note or file, and see existing CRM notes.
  - Connections can be filtered by interaction frequency or recency, Lead/Contact status and channel.
- **Duplicate handling:** no automatic dedupe is documented. Matching to an existing record is done manually (Associate to Existing). Field mapping for manual adds follows the chosen CRM layout. The exact mapped social fields are unconfirmed.
- **CRM Reports** (Reports > CRM > Standard Reports):

| Tab | Content |
|---|---|
| Leads Created | Day, Lead Name, Owner, Lead Source |
| Contacts Created | Details of CRM Contacts |
| Potentials | Owner, Lead Source, Contact, Closing Date, Probability, Stage, Amount; status Open/Won/Lost |
| Revenue ($) | Won potentials and their revenue |

  - Filters: Lead Source (channel attribution) and Stage (Potentials).
  - Calendar: Current Week, Last Week, Current Month, Last Month, Last 7, 15 or 30 Days.
  - Email or export the report as CSV. Clicking a record opens it in CRM.
- **Plan:** Zoho CRM integration and CRM leads/contacts are on Premium and above (https://www.zoho.com/social/pricing.html).

#### 2.2 Zoho Social Lite (free with CRM or Desk)
Source: https://help.zoho.com/portal/en/kb/social/integrations/zoho-crm-integration/articles/zoho-social-lite-edition
- Free for customers on a paid Zoho CRM or Zoho Desk edition. Brands from the CRM or Desk Social tab sync automatically.
- Limits: 1 Brand, 2 team members. Extra Brands cost $5 each as add-ons.
- Channels: FB Page and Group, X, Instagram, LinkedIn Page and Profile, GBP.
- Includes: unlimited publishing, the built-in URL shortener, CRM and Desk integration, zShare, and the mobile apps.
- Trials: Settings > Try Other Editions. When the trial ends, upgrade or fall back to Lite.

#### 2.3 Zoho Desk
Sources:
- https://help.zoho.com/portal/en/kb/social/integrations/zoho-desk-integration/articles/creating-tickets-from-zoho-social
- https://help.zoho.com/portal/en/kb/social/integrations/zoho-desk-integration/articles/viewing-all-your-tickets-from-the-reports-tab

- **Brand sync:** brands created or imported in the Desk Social module appear in Zoho Social. Zoho Social brands can also be imported into Desk.
- **Platform limit:** ticket conversion works for **Facebook and X posts only**.
- **Manual conversion:**
  - Available from Monitor (visitor posts, keywords, @mentions, lead/contact posts, hashtags), Live Stream, and the Posts tab (comments and @mentions).
  - Flow: Convert to Ticket icon > pick a **Department** > Convert. A ticket ID is assigned; clicking it opens the ticket in Desk.
  - No priority or assignee fields are documented.
- **Automatic conversion** (Social Admins only; Settings > Ticket Creation):
  - Facebook: choose post types, set the append interval for message replies, add keyword > department routing.
  - X: choose post and message types, set the append interval, add trigger keywords > department.
  - **Append interval:** replies inside the window join the existing ticket; later replies create a new ticket.
- **Desk Info** on a connection: contact details, ticket owner, all tickets, average response time, average resolution time, happiness rating.
- **Reports > Desk Tickets:** every ticket created from Social, with created time, assignee and department. Clicking the ticket ID opens Desk.
- **Status sync back to Social:** not documented (unconfirmed).
- **Plan:** Premium and above (pricing page).
- Zoho One also offers the Desk–Social link under Zoho One > Integrations (https://help.zoho.com/portal/en/kb/one/admin-guide/integrations/zoho-desk/articles/integrate-zoho-desk-with-zoho-social; title from search, page not fetched).

#### 2.4 Facebook Lead Ads (Lead Forms module)
Sources:
- https://help.zoho.com/portal/en/kb/social/integrations/facebook-lead-ads-integration/articles/getting-started-with-facebook-lead-ads
- https://help.zoho.com/portal/en/kb/social/integrations/facebook-lead-ads-integration/articles/facebook-lead-gen-reports

- **Deprecated** for portals that signed up on or after **19 Apr 2024**. Those portals use the LeadChain extension from the CRM or Bigin Marketplace instead.
- **Plans:** Premium, Agency, Agency Plus.
- **Permissions:**
  - Zoho Social admin and Zoho CRM admin.
  - Facebook admin on the account, the Page and the ad account.
  - In Business Manager > Leads Access, grant CRM & People access to Zoho Social.
- **Setup:**
  1. In CRM, go to Setup > Channels > Social and import the brand.
  2. In Social, open Lead Forms > "Set Up Facebook Lead Ads Now" and log in to Facebook.
  3. Pick the ad account (**1 per brand**).
  4. Choose **Proceed** (auto mapping) or **Edit Mapping** (manual), and add extra fields.
- **Mapping and sync rules:**
  - Only **1 CRM portal** per integration.
  - Mandatory CRM fields (*) must be mapped.
  - The mapped CRM layout must be visible to the connecting admin, or the sync fails.
  - A lead form must belong to one ad account.
  - Test leads must not contain special characters.
- **Assignment rule:** create it in the CRM Leads module, then select it in Lead Forms (verify the rule ID) > Apply. It applies to all forms and brands. Only portal admins can apply it.
- **Initial sync:** leads from active forms in the last 90 days are shown. "Add all Leads into CRM" pushes them; new leads sync automatically after that.
- **Reports** (Reports > CRM):

| Section | Content |
|---|---|
| Performance | Leads per ad, average cost per lead, reach, clicks, amount spent |
| Demographics | Reach, impressions, gender/age |
| Placement | Leads vs reach and impressions, spend |
| CRM tab | Leads and fields synced |
| Leads from Lead Ads | Use Add Fields to show all form fields |
| Leads from Social Actions | Leads created from likes and comments on the ad |

  - Filters: Ad/ID, Ad Set/ID, Campaign/ID, Lead Form/ID, Ad Account/ID, Ad Objective, Page/ID, Consent info, Lead Type, Brand.
  - Lead pages show 10–100 rows per page.
  - Export as PDF, PNG or CSV. Email with an optional password of at least 6 characters.

#### 2.5 LinkedIn Lead Ads
Source: https://help.zoho.com/portal/en/kb/social/integrations/linkedin-lead-ads-integration/articles/linkedin-lead-ads-integration
- Deprecated on the same terms (signup on or after 19 Apr 2024; use LeadChain).
- Requires the Admin or Advertiser role on the LinkedIn ad account.
- Setup: Lead Forms > Set Up LinkedIn Lead Ads Now > Connect. Settings > Lead Generation > LinkedIn has an auto-sync toggle; when it is off, no leads are pushed.
- Mapping:
  - **Edit Mapping**, **Reset Mapping** and **Create Custom Field** are available, or **Proceed** for auto mapping.
  - Mapping can be set for all forms or per form (pencil icon).
  - The CRM **Last Name** field must be mapped, or the push fails.
  - Campaign fields (ad account, campaign ID) can be added to CRM.
- Per-form sync toggle under Posts > Lead Generation > LinkedIn.
- Form Status filter: Active, Inactive, Deleted, In Review, Not approved, Not delivering, Archived.
- Initial pull covers the past 90 days. Data refreshes **every 60 minutes**.
- Disconnect: Manage Ad Account > Disconnect.

#### 2.6 Canva
Source: https://help.zoho.com/portal/en/kb/social/publishing-and-scheduling/tools-for-publishing-posts/articles/design-with-canva-button
- **Connect:** Settings > Integrations > Connect to Canva (or from the Compose media button). Log in to Canva, enter the emailed code and grant permissions.
- **Entry points:**
  - Compose > Media attachment > **Design on Canva**.
  - Social Library > Upload Media.
  - Attach Media when replying in Posts or Monitor.
- **Return flow:** Canva opens in a new tab. **Return to Zoho Social** attaches the image to the post. **Edit in Canva** on an attached image reopens it for editing.
- Images only.
- **Plans:** Professional, Premium, Agency, Agency Plus.
- **Disconnect:** Settings > Integrations > Disconnect from Canva.

#### 2.7 Cloud storage (Google Drive, Dropbox, WorkDrive, and others)
Source: https://help.zoho.com/portal/en/kb/social/faqs/publishing-and-scheduling/publishing-and-scheduling-posts/articles/can-i-upload-media-directly-from-the-file-hosting-apps-i-use
- **Cloud Picker** in Compose and Social Library: Zoho WorkDrive, Google Drive, Box, OneDrive, Dropbox, Evernote, Zoho Notebook. Each service is authenticated from the publishing window.
- An image cannot be hotlinked by URL in a single post. The Bulk Scheduler accepts public direct image URLs. Videos cannot be added by URL.

#### 2.8 Bitly and URL shortening
- The pricing page lists the Bit.ly shortener on Professional and above, plus the free built-in "zurl" shortener (https://www.zoho.com/social/pricing.html).
- Setup location: Brand Settings > Publishing > Default Link Shortener > bit.ly. This comes from Bitly's own support page, not a Zoho page (unconfirmed by Zoho).
- Short-link click analytics: see 1.11 (URL row).

#### 2.9 Zoho MCP toggle
- Settings > Integrations > Zoho MCP toggle. See section 6.

#### 2.10 Integrations not found in official docs
| Integration | Status |
|---|---|
| Slack | No official Zoho Social doc (unconfirmed) |
| Zoho Cliq | Only a community feature request for a Social bot (unconfirmed; likely absent) |
| Shopify, WordPress | No official doc (unconfirmed) |
| Zoho Survey | No official doc (unconfirmed) |
| Zoho Campaigns / Marketing Plus | Marketing Plus and CRM Plus bundle "Social" (community posts); no Social-side integration article (unconfirmed) |
| Google Workspace | A Zoho Social listing exists on the Google Workspace Marketplace (zoho.com/googleworkspace/social; not fetched) |
| Zoho Tables | Has a "Drafting a post in Zoho Social" automation action (https://help.zoho.com/portal/en/kb/tables/automation/actions/articles/drafting-a-post-in-zoho-social; title from search only) |

#### 2.11 Zoho Flow, Zapier, Deluge
- **Zoho Flow** (https://www.zohoflow.com/apps/zoho-social/):
  - Actions: **Draft post** (draft for one or more channels), **Schedule post**, **Publish post** (immediately to one or more channels).
  - **No triggers are listed.**
- **Deluge:** Zoho Social is **not** among the Deluge integration-task services (https://www.zoho.com/deluge/help/integration-tasks.html). Scripts would call the REST API through invokeUrl or a connection (inference).
- **Zapier:** not checked, per the official-only rule (unconfirmed).

---

### 3. Mobile apps (iOS and Android)

#### 3.1 Connecting channels (Android)
Source: https://help.zoho.com/portal/en/kb/social/zoho-social-mobile-app/articles/connect-your-social-media-channels-directly-via-the-zoho-social-app-for-android
- Path: Brand icon > Brand settings > Social accounts > + next to the network > sign in and grant permissions > select > Okay.
- Networks: FB Pages, X, Instagram Professional, LinkedIn Profile, LinkedIn Page, YouTube, GBP, Pinterest, TikTok, Threads, Bluesky, Mastodon.
- Network rules:
  - TikTok cannot be connected from India.
  - Bluesky needs the username and an **app password**.
  - Mastodon needs the server (or Others + server name) and an app password.
  - Threads signs in through Instagram.
- Permission rules:
  - Portal or Brand Admin is required to add, reconnect or remove channels.
  - Facebook needs Page admin; LinkedIn needs super admin.
  - Instagram must be Business or Creator. When connected through Facebook, it must be linked to a Page you administer.
- Brand rules:
  - A brand is created only once its first channel is connected.
  - **One channel per network type per brand.**
  - Reconnect when the token expires. Delete through Brand settings > channel > Delete Channel.

#### 3.2 Publishing on mobile
Source: https://help.zoho.com/portal/en/kb/social/zoho-social-mobile-app/articles/publishing-from-zoho-social-mobile-application
1. Compose > select channels.
2. Add media from the camera or gallery.
3. Write the caption. Mentions use @ plus the exact username. Hashtag groups can be inserted or created.
4. Next > network options:

| Option | Networks |
|---|---|
| Alt text | FB, X, LinkedIn, Pinterest, Mastodon, Bluesky |
| Location | FB, IG |
| First Comment | IG, FB, LinkedIn (both OSes); YouTube **iOS only** |
| GMB button | GBP |
| Tag users / Collaborators | IG |
| YouTube options | Title, description, visibility (private/public/unlisted), category, tags |

5. Optional "Send for approval" toggle.
6. Next > **Publish Now**, **Custom Schedule**, **SmartQ**, **CustomQ** or **Save as Draft**.

- Post targets: FB, IG, X, LinkedIn, Pinterest, Mastodon, GBP, YouTube, Threads, Bluesky. **Stories: FB and IG only.**

#### 3.3 Approvals on mobile
Source: https://help.zoho.com/portal/en/kb/social/zoho-social-mobile-app/articles/content-approvals-on-mobile
- **Senders:**
  - Any role can send a post for approval.
  - Limited publishers and users without publish permission must send for approval.
  - Admins and publishers may publish directly.
- Admins with no approvers in the brand can add approvers with the + icon.
- **Approver flow:** Posts > Approvals > open the post > status Yet to Review > Under Review, then:
  - **Approve**: keep the sender's schedule, publish now, or add to the queue > Confirm.
  - **Reject**: feedback text is required > Done.
- Approvers get a push notification and a Home-tab reminder.

#### 3.4 Notifications
Source: https://help.zoho.com/portal/en/kb/social/zoho-social-mobile-app/articles/notifications-8-4-2019
- Settings > Notification Settings has toggles for: posts going live, post failures, engagement (extra options for FB and X), posts by others, comments, likes.
- **Mute Notifications** per brand. Instagram publishing notifications still arrive.
- Settings > App Preferences > **Do Not Disturb** stops everything, including IG publishing notifications.

#### 3.5 X threads on mobile
Source: https://help.zoho.com/portal/en/kb/social/zoho-social-mobile-app/articles/creating-a-twitter-thread-mobile-app
- Build a thread by replying to your own tweet in Posts (text, image or GIF, and a DM link). "View Conversation" shows the whole thread.
- **Threads cannot be scheduled.**

#### 3.6 Web vs mobile matrix
- Source: https://help.zoho.com/portal/en/kb/social/zoho-social-mobile-app/articles/web-vs-mobile-feature-comparison
- The matrix is only an image; its content is not extractable (unconfirmed).
- Mobile apps are included in every plan, including Lite.

---

### 4. zShare browser extension
Source: https://help.zoho.com/portal/en/kb/social/publishing-and-scheduling/tools-for-publishing-posts/articles/zshare-extension
- **Browsers:** Chrome, Firefox, Safari, Opera, Ulaa. Included on **all plans** (pricing page).
- **Opening it:** the toolbar icon opens the publishing window. When nothing is selected, the page title becomes the text.
- **Content:**
  - Highlighted text goes into the post. More selections can be appended while the window is minimised.
  - Each image gets a zShare hover button. Other page images appear as "Suggested Images".
  - Link preview, with "Switch to Link preview" to go back to it.
  - Videos can be shared.
- **Brand and channels:**
  - Brand dropdown.
  - Channels: FB, X, IG, GBP, LinkedIn.
  - The default tab copies content to every channel. Per-channel edits carry an "Edited" label and can be reverted.
- **Actions:**
  - Publish.
  - Schedule by date and time, with optional weekly or monthly repeat.
  - Add to CustomQ or SmartQ.
  - **One schedule applies to all selected channels.**
- **Limits:**
  - X: 280 characters.
  - Hashtags and mentions only on X, FB Page, FB Group and LinkedIn Page.
  - Multiple images on FB, X and IG; LinkedIn allows 1.
- **Link preview rules:**
  - FB thumbnail can be edited only with a verified domain.
  - X previews are generated at publish time.
  - LinkedIn: arrows cycle through thumbnails.
  - No preview on IG or GBP.
- **Options:** hide the image hover button.
- **Feedback:** feedback icon on the top bar.
- Drafts from zShare: unconfirmed.

---

### 5. Social Toolkit (free, no account needed)
Source: https://help.zoho.com/portal/en/kb/social/social-toolkit/articles/social-toolkit
Hub: https://socialtoolkit.zoho.com/

| Tool | Behaviour | Source |
|---|---|---|
| File Converter | Choose the target format (JPG, JPEG, PNG, GIF, TIFF, BMP, WEBP), upload several files (drag-drop), Convert, Preview, download one or **Download All as a ZIP** | https://help.zoho.com/portal/en/kb/social/social-toolkit/articles/file-converter |
| QR Code Generator | Types: Link, Media (upload), Text (bold/italic/strike/bullets/emoji), App link (App Store or Play Store; needs an alternate link). Templates by use case; frame colour; text font, size and colour. Optional expiry date (not for app QR) with an alternate link shown after expiry or on other devices. Analytics: total visits, unique visits, browser/device, country/platform. Download (format unconfirmed) | https://help.zoho.com/portal/en/kb/social/social-toolkit/articles/qr-code-generator |
| Campaign URL Builder | Paste the URL > Proceed > Name, Medium, Source, Content, Term, Campaign ID > Create Campaign URL > copy or publish through Zoho Social. Required fields, shortening and saving: unconfirmed | https://help.zoho.com/portal/en/kb/social/social-toolkit/articles/campaign-url-builder |
| Postify | Paste a URL > Create Post > Light or Dark mode, background (built-in, own image or none), show/hide the page image > download, or share through Zoho Social (needs an account) | https://help.zoho.com/portal/en/kb/social/social-toolkit/articles/postify-turn-your-links-into-eye-catching-posts |
| InstaScript | Caption editor: Unicode font styles, bold, italic, underline, strikethrough, bullets, numbered lists, emoji, live preview, Copy Caption | https://help.zoho.com/portal/en/kb/social/social-toolkit/articles/instascript-style-and-structure-your-instagram-captions |
| Instagram Regram | Paste an IG post link (video gives the thumbnail, carousel gives the first image). Credit badge position: bottom-left, bottom-right, top-left or top-right; colour black or white. Download with file name, format and quality; Share (optionally use or edit the original caption); "Share via Zoho Social" opens Compose | https://help.zoho.com/portal/en/kb/social/social-toolkit/articles/instagram-regram |
| Instagram Grid Builder | Upload, drag to position, layout 3x1, 3x2, 3x3 or 3x4, optional frame and colour, download a ZIP (name, format, quality) | https://help.zoho.com/portal/en/kb/social/social-toolkit/articles/instagram-grid-builder |

No size or quota limits are documented for any tool.

---

### 6. Zoho MCP (AI assistants)
Sources:
- https://help.zoho.com/portal/en/kb/social/mcp/articles/configure-zoho-mcp-for-zoho-social
- https://www.zoho.com/social/mcp.html
- https://www.zoho.com/blog/social/meet-zoho-social-mcp.html (10 Aug 2026)

- **Regional servers:** mcp.zoho.com (US), .eu, .in, .com.au, .jp, .sa, .ae, .ca.
- **Setup:**
  1. In Zoho Social: Settings > Integrations > Zoho MCP toggle on.
  2. In the MCP console (mcp.zoho.com): Create MCP Server > name > Add Tools > Zoho Social > tick the tools > Add Now. Copy the server URL from Connect.
  3. Add the URL to the AI client:
     - ChatGPT: Plugins > + > Add custom MCP server.
     - Claude individual: Customize > Connectors > Add custom connector.
     - Claude Team/Enterprise: an org admin adds it under Organization settings > Connectors.
- **Clients:** Claude Desktop, ChatGPT, Cursor, Windsurf, VS Code, and any remote-MCP client.
- **Tools:** "**31 tools**" in five groups: Publish, Read & fetch, Manage, Validate, Media.
- **Capabilities:**
  - Publish now or schedule, across networks; save drafts.
  - Per-network content, mentions, location, hashtags, first comment.
  - Query the calendar and change post times.
  - Upload images from a URL or a local file; browse the media library; attach media.
  - Validate character and media limits.
  - Fetch post stats (likes, comments, shares, reach).
  - Create Pinterest boards.
- **Permissions:** the assistant can only use the tools you add and can only do what the user's Zoho Social role allows.
- **Auth:** OAuth-style account authorisation at connect time. Scopes are not named.
- **Tool names and parameters:** not listed on the fetched pages (unconfirmed). They are probably in the Zoho MCP Tool Guide (https://help.zoho.com/portal/en/kb/mcp/mcp-tool-manual), which could not be fetched. The 31 tools appear to mirror the REST API v2 endpoints in section 8 (inference).
- **Rate limits and plan availability:** not stated.

---

### 7. Linkthread (link-in-bio)
KB root: https://help.zoho.com/portal/en/kb/linkthread (the Social KB "linkthread" category page is empty). App: linkthread.zoho.com. Support: support@zoholinkthread.com (EU: support@eu.zoholinkthread.com).

#### 7.1 Basics and plans
Sources:
- https://help.zoho.com/portal/en/kb/linkthread/frequently-asked-questions/articles/linkthread
- https://help.zoho.com/portal/en/kb/linkthread/getting-started/articles/linkthread-an-overview
- https://help.zoho.com/portal/en/kb/linkthread/manage-your-account/articles/manage-linkthread-subscription

- A standalone product. No Zoho Social account is needed; existing Zoho users map their portal.
- Plans: **Free** and **Basic**. Prices are not on these pages.
- Billing: monthly or yearly. Add-ons: extra Bios and extra Users. Payment by card or PayPal.
- Cancel: the plan stays active until the cycle ends.
- Downgrade Immediately: paid features are removed at once (for example, a custom theme reverts to the default).
- Re-upgrading restores the settings and the analytics data.

#### 7.2 Page setup and components
Source: https://help.zoho.com/portal/en/kb/linkthread/create-a-link-in-bio/articles/setting-up-your-link-in-bio
- First run: domain name (page handle), bio name, description, profile image.
- Components:

| Component | Fields |
|---|---|
| Button | Name, URL, note, image, schedule from/to. Can be cloned |
| Featured Media | URL, title, thumbnail, schedule |
| Featured Text | **Max 300 characters**, emoji, schedule (date and time) |
| Social Links | Network and URL, position top or bottom, drag to reorder |
| Heading Text | Text, emoji, "Add separator", schedule |

- Publish now (no page-level scheduling).
- Share: QR code download, "Add link in bio" (opens the network's profile edit page), copy link.
- Settings > Delete page (permanent).
- Slug rules: unconfirmed.

#### 7.3 Appearance
Source: https://help.zoho.com/portal/en/kb/linkthread/create-a-link-in-bio/articles/customize-the-appearance
- 50+ themes and 20+ fonts.
- Custom Theme: background as solid colour, gradient or image; element colours (background, description, heading).
- Styles: header position, featured-text background, button shape, button type.
- Appearance > publish now.
- Removing Linkthread branding: unconfirmed.

#### 7.4 vBusiness Card
Source: https://help.zoho.com/portal/en/kb/linkthread/create-a-link-in-bio/articles/vbusiness-card
- Settings > VBusiness Card toggle.
- Fields: name, description, business name, profile image, and contacts (email or phone typed Primary, Work, Home or Others). Several contacts are allowed; only one primary email and one primary phone.
- Shared by QR, link or a Contact button on the bio page that saves the details to the visitor's device (file format unconfirmed).

#### 7.5 Analytics and tracking
Sources:
- https://help.zoho.com/portal/en/kb/linkthread/create-a-link-in-bio/articles/analyze-the-link-in-bio-page
- https://help.zoho.com/portal/en/kb/linkthread/tracking-and-analytics/articles/heat-map
- https://help.zoho.com/portal/en/kb/linkthread/tracking-and-analytics/articles/pixel-tracking
- https://help.zoho.com/portal/en/kb/linkthread/tracking-and-analytics/articles/linkthread-utm-tracking

- **Report sections:**

| Section | Metrics |
|---|---|
| Summary | Total visits, unique visitors, engaged visitors, engagement rate, total clicks, clicks per visit |
| Audience | Visitor distribution (weekly), new visitors (weekly), weekday distribution, country/city, hourly distribution, new vs returning, browser, OS, source, device |
| Engagement | Average time on page, page views (weekly), visitor engagement rate by level |
| Heat Map | Element, Clicks, Contribution %; warm colour = high engagement. **Basic plan only** |

- **History:** Free plan shows the last 30 days. Basic shows everything since the page was created. A calendar picker is available.
- **Pixels:** Facebook, LinkedIn, Snapchat. Settings > Pixel Tracking > +Add New Pixel ID. **One active pixel per channel.** A toggle pauses a pixel without deleting it.
- **UTM:**
  - Default parameters: Source, Medium, Campaign, Content. Each can be toggled and edited.
  - Custom parameter/value pairs can be added (deletable, not toggleable). A preview shows the final URL.
  - Global settings live in Settings > UTM Tracking.
  - Per-button override: Page Setup > UTM Parameters toggle > Edit.
- **Export:** unconfirmed.

#### 7.6 Roles
Source: https://help.zoho.com/portal/en/kb/linkthread/manage-your-account/articles/roles-permissions

| Role | Rights |
|---|---|
| Portal Admin | Everything: all bios, users, roles, domain |
| Bio Admin | One bio: edit, publish, manage that bio's users, edit the domain |
| User | One bio: view, edit components, view analytics; **cannot publish** |

- Invite paths: Settings > Bio users > + Add User to Bio (Portal Admin), or the bio's Settings > Bio Users (Bio Admin).

---

### 8. Public REST API (exists: v2)

Sources:
- https://www.zoho.com/social/api/introduction.html
- https://www.zoho.com/social/api/oauth-authentication.html
- https://www.zoho.com/social/api/status-code.html
- https://www.zoho.com/social/api/glossary-network.html
- Menu: https://www.zoho.com/social/lhs-menu/api-en/index.html
- Each endpoint has its own page at `https://www.zoho.com/social/api/<page>.html`.

#### 8.1 Basics
- **Base URL:** `https://{api_domain}/social/v2`. DCs: social.zoho.com, .eu, .in, .com.au, .jp, social.zohocloud.ca, .sa, .ae. Each DC holds only its own users' data.
- **Auth:** Zoho OAuth 2.0 (Zoho Accounts, multi-DC). Send `Authorization: Zoho-oauthtoken <token>`.
- **Required headers:** `portal_id` and (usually) `brand_id`.
- **Access is off by default.** Calls return `API_NOT_ALLOWED` (403) until you email support@zohosocial.com to enable it for the portal.
- **Rate limits:** not published (unconfirmed).
- **Scopes:**
  - Documented on the OAuth page: `ZohoSocial.Organization.READ`, `ZohoSocial.Integration.READ`, `ZohoSocial.Publish.ALL`, `ZohoSocial.Media.ALL`.
  - Also accepted per the endpoint pages: `ZohoSocial.Publish.READ`, `ZohoSocial.Publish.CREATE`, `ZohoSocial.Media.READ`, `ZohoSocial.Media.CREATE`.
- **Time format:** times are Unix milliseconds.
- **Pagination:** offset/limit; published posts use a cursor. A `fields=` projection is supported.

#### 8.2 Endpoints

| Group | Method + path | Page | Scope |
|---|---|---|---|
| Portals | GET /socialportals | portals | Organization.READ |
| Brands | GET /socialbrands | brands | Organization.READ |
| Channels | GET /channels | channels | Integration.READ |
| Users | GET /users | users | Organization.READ |
| Published posts | GET /posts/published?network=&cursor=&limit=&board_id= | published-posts | Publish.READ/ALL |
| Publish now | POST /posts/publish | publish-post | Publish.CREATE/ALL |
| Publish status | GET /posts/publish/{post_id} | publish-status | Publish.ALL |
| Schedules | GET /posts/schedules (is_failed, is_approval, networks); GET, PUT, DELETE /posts/schedules/{post_id}; POST /posts/schedules | schedules-list, get-schedules-by-id, update-schedules, delete-schedules-by-id, create-schedules | Publish.* |
| Drafts | GET /posts/drafts; GET, PUT, DELETE /posts/drafts/{id}; POST /posts/drafts | drafts-list, get-drafts-by-id, update-drafts, delete-drafts-by-id, create-drafts | Publish.* |
| Media | GET /medialibrary (library_type, type, format, created_by, sort); POST /medias/upload (multipart; JPEG/JPG/PNG/GIF); POST /attachments/upload (from URL) | media-library, image-upload-direct, image-upload-url | Media.* |
| Validation | GET /networkproperties?type=newpost; POST /posts/validate | network-properties, post-validation | Publish.* |
| Posts count | GET /posts/count → draft_posts, approval_posts, scheduled_posts, failed_posts | posts-count | Publish.READ/ALL |
| Approval | GET /posts/activities?post_id=; POST /posts/activities (comment); POST /posts/activities/status (status_type yet_to_review, in_review, approved or rejected, plus message) | get-post-activities, add-approval-comment, modify-approval-status | Publish.ALL |
| Attributes | GET /posts/mentions?network=&query=; GET /posts/geolocations?network=&query=; GET and POST /pinterest/boards (name, privacy, description); GET /arattai/channels | search-mentions, search-geolocations, pinterest-boards, create-pinterest-boards, arattai-channels | Publish.* |

#### 8.3 Post payload (create schedule / draft / publish)
Source: https://www.zoho.com/social/api/create-schedules.html
- `post.messages[]`: each message has `channels[]`, `message`, an optional `link_preview` {url, title, description, thumbnail_url}, `has_media`, and `medias[]`.
- `medias[]` items: {file_path, name, size, type, format, width, height, alt_text}.
- `channels[]` items: {network, brand_id (all channels in one message share a brand), board_id (Pinterest), arattai_group_id/name, mentions[{id, name, start_index, length, end_index}], geo_location{id, name, latitude, longitude, address}, first_comment{message}, poll{question, options, duration}, has_dm, call_to_action{action_type, link}}.
- Network rules for the optional fields:

| Field | Rule |
|---|---|
| first_comment | Not available for GBP, X, Threads or Bluesky |
| poll | X, LinkedIn Page, LinkedIn Profile, Threads only. Duration 1, 3 or 7 days; Threads 1 day only |
| has_dm | X only |
| call_to_action | GBP only: LEARN_MORE, SIGN_UP, GET_OFFER, ORDER, BOOK, SHOP, CALL |

- Schedule fields:
  - `schedule_time` (ms).
  - `type`: `schedule` or `repeat`.
  - `repetition`: {repetition_type weekly or monthly, repetition_start_time, repetition_end_time, repetition_day_week (sunday…saturday), repetition_day_month (1–31), is_skip_month}.
- Response: data[] per brand with {success, post_id, message, networks, brand_id, is_approval_needed}.
- Network identifiers: facebookpage, twitter, linkedinprofile, linkedinpage, instagram, googlemybusiness, youtube, pinterest, tiktok, mastodon, threadsbyig, bluesky, arattai.

#### 8.4 Published-post fields (analytics through the API)
Source: https://www.zoho.com/social/api/published-posts.html
- Content: id, update_key, message, attachments/media (image, video, thumbnail, alt_text), created_time, updated_time, perma_link, from{name, profile_name, is_verified, picture}.
- Counters: like_count, dislike_count, view_count, comment_count, share_count, retweet_count, quote_count, impression_count.
- Other: post_type (timeline/reel/story/pin), board_id/name, title, description, is_retweet, shared_post, is_hidden, can_comment, Bluesky hash_id/root_hash_id, collaborators.
- **No report-level or audience analytics endpoint exists.** Only per-post counters are exposed.

#### 8.5 Network limits (sample response of GET /networkproperties)
Source: https://www.zoho.com/social/api/network-properties.html (sample data; treat as indicative)

| Network | Text max | Images per post | Image max size | Video |
|---|---|---|---|---|
| Facebook Page | 63,206 | 10 (+1 GIF) | 15 MB | 1–1800 s, ≤1 GB; Reels 3–90 s, 9:16, ≥540×960 |
| X | 280 (extended 25,000) | 4 (+1 GIF) | 5 MB | 0.5–140 s, ≤512 MB (pro media up to 600 s); up to 10 URLs (23 chars each); max 10 hashtags |
| Instagram | 2,200 | 10 (mixed carousel 10) | 8 MB, aspect ratio 0.8–1.91 | 3–60 s, ≤100 MB; Reels 3–900 s; max 30 hashtags |
| LinkedIn Page / Profile | 3,000 | 9; 1 document (PDF/PPT/DOC, ≤300 pages, ≤100 MB) | — | 3–600 s, ≤1 GB |
| Pinterest | 500 (title 100) | 1 | 20 MB | 4–900 s |
| GBP | 1,500 | 1, 250–3000 px | 10 KB–5 MB | none |
| Bluesky | 300 | 4 | 1 MB | 1–60 s, ≤50 MB |

- First-comment max: FB 8,000; LinkedIn 1,250; IG 2,200.
- Poll limits: question ≤140 characters; 2–4 options of ≤25 characters each.

#### 8.6 Errors
Source: https://www.zoho.com/social/api/status-code.html
- HTTP codes used: 200, 400, 401, 403, 500. Error body: `{"code","message"}`.

| HTTP | Error codes |
|---|---|
| 400 | INVALID_PARAM, REQUIRED_PARAM_MISSING |
| 401 | PORTAL_NOT_FOUND, USER_INACTIVE_IN_PORTAL, USER_NOT_FOUND, INSUFFICIENT_PERMISSION, CHANNEL_NOT_ALLOWED |
| 401 (token) | INVALID_OAUTHTOKEN, INVALID_OAUTHSCOPE |
| 403 | PLAN_NOT_SUPPORTED, BRAND_NOT_FOUND, BRAND_NOT_ALLOWED, API_NOT_ALLOWED |
| 500 | INTERNAL_ERROR |

- No webhooks or event subscriptions are documented (unconfirmed; probably absent).

---

### 9. Plan matrix for this scope
Source: https://www.zoho.com/social/pricing.html (served in Arabic; plan-to-feature placement inferred from the list order) plus the help articles cited above.

| Feature | Plan |
|---|---|
| Summary reports, post stats | Standard+ (post stats Standard, Professional, Premium, Agency) |
| Report date range | Standard 15 days / Professional 3 months / Premium+ 1 year |
| Bitly shortener, Canva | Professional+ |
| Report dashboard, custom reports, report sharing, post export | Premium+ |
| Export and schedule reports | Premium, Agency, Agency Plus (help article); pricing page lists scheduled/emailed reports under Agency |
| Agency-branded reports | Agency+ |
| CRM, Desk, lead generation | Premium+ |
| FB Lead Ads | Premium, Agency, Agency Plus (legacy portals only) |
| zShare, mobile apps | All plans, including Free and Lite |
| API / MCP | Not tied to a plan in the docs. The API returns PLAN_NOT_SUPPORTED for some plans, and access must be enabled by support |

