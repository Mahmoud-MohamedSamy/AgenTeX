# Zoho Zia inventory (CRM + Desk) — reference for TIA parity

Research of public Zoho help, developer and pricing pages, 23 Nov 2026. No sign-in anywhere.
**INFERRED** marks things concluded rather than read. Zoho's pages disagree on editions, data centres and language counts; where they conflict, both are listed.

## Shape
- **CRM:** Zia is a chat assistant ("Ask Zia").
- **Desk:** there is no general agent chat. Zia is buttons and panels in the ticket screen, plus Answer Bot (for customers), Zia Agents and Zia Actions (AI steps in workflow rules).

---

## CRM

### Ask Zia (chat)
Source: https://help.zoho.com/portal/en/kb/crm/zia-artificial-intelligence/conversational-ai/articles/ask-zia

- **Where it opens:** an icon under search, with a history list.
- **From global search:** press "/" twice. Actions cannot run from search. Needs Enterprise with 20+ licences, or Ultimate.
- **Three message types:** Insights (data questions), Help (how-to), Action (does tasks).
- **Insights:**
  - A question becomes a chart, which can be added to a dashboard.
  - A code viewer explains how the answer was worked out.
  - Zia can build a report together with the user in the chat.
- **Actions:**
  - Summarise a record or a note.
  - Create workflow rules (actions: assign owner, field update, task, meeting, call, tag, email notification, convert lead, function, webhook).
  - Create records.
- **Other features:**
  - Recurring (scheduled) questions.
  - Suggested and recent questions.
  - Several sessions, a history list, delete a session.
  - Like/dislike on each answer.
  - Voice input on the web.
  - Custom Zia Agents in an agent switcher, with access per profile.
- **Limits:**
  - English only, no spell check.
  - One module and one aggregate per question.
  - No related lists.
  - A week runs Sunday to Saturday.
  - Business hours are ignored.
- **Mobile:** Android voice; iOS chat or voice toggle.
- **Editions (conflicting):** Professional+ (help page) vs Enterprise/Ultimate on the Next Gen UI (community post and feature page).

### Generative AI
Source: https://help.zoho.com/portal/en/kb/crm/zia-artificial-intelligence/generative-ai/articles/zia-models

- **Models** (Setup > Zia > Models):
  - Zoho Hosted LLM.
  - Your own key: OpenAI, Gemini, Anthropic, Cohere, DeepSeek, SiliconFlow.
  - Zoho Key Service (no key needed).
  - Several models can be active, and you can compare their answers.
- **Record Assistant** (button at the top of a record):
  - Record summary.
  - Conversation summary (last 10 of each type).
  - Note summary.
  - Emails summary (last 50).
- **Writing:**
  - Draft a note or an email: tone, length, vocabulary.
  - Template Assistant.
  - Prompt Builder: custom buttons with merge fields, on records and list views.
- **Builders:**
  - Create a module, workflow or report from a prompt.
  - Native "Customize with Agent" setup agents.
- **Email AI:** sentiment, intent, emotion, activity extraction, summary, competitor alert, autocomplete, subject suggestion, translation, writing assistant.
- **Call AI:** transcription and summary.
- **Data and images:**
  - Data enrichment.
  - Image validation, duplicate image detection, text from images.

### Predictions
Sources: https://www.zoho.com/crm/ai-features-in-zoho-crm.html and https://www.zoho.com/crm/comparison.html

- **Scores and predictions:**
  - Zia Score.
  - Prediction builder.
  - Churn prediction.
- **Recommendations:**
  - Recommendation builder.
  - Similarity recommender (5 most similar records).
  - Next best experience.
  - Best time and best way to contact.
  - Owner suggestion.
- **Forecasting and anomalies:**
  - AI forecasting.
  - Anomaly detector.
  - Trend and workflow anomalies.
- **Suggestions:**
  - Workflow suggestions and macro suggestions.
  - Dashboard component suggestions.
- **Other:**
  - Monthly Zia presentation.
  - Strategy influencer.
  - Voice of the Customer.
- **Limits:** counts per edition; some features need 10, 15, 20 or 50 users.

### Admin, permissions, data
- **Feature switches:** every Zia feature is ON by default. Each has an org-wide on/off toggle in Setup > Zia > Admin Panel; notifications are turned off in their own tab.
  - Source: https://help.zoho.com/portal/en/kb/crm/zia-artificial-intelligence/zia/articles/enabling-and-disabling-zia-features
- **Profile permissions:** there are 14 Zia permissions per profile. On the Standard profile, Ask Zia has full access and Smart Prompt is not available.
  - Source: https://help.zoho.com/portal/en/kb/crm/users-and-control/profile-management/articles/manage-profile-permissions
- **Who manages models:** only admins. There is one key per org, and portal users get no Zia.
- **Data sent to the AI:**
  - Fields are sent one at a time, never whole records.
  - Personal and sensitive fields are excluded.
  - Health data (HIPAA) is never processed.
  - From email, only the composer text is sent.
- **Credits:** one-time free credits from Zoho Key Service: Ultimate 6,000, Enterprise 4,000, Professional 2,000.
- **Audit:** past prompts and responses cannot be looked up.
- **Data access:** answers follow the user's own access ("data the user is authorised to access"). Whether field-level permissions are applied in Ask Zia is not documented (INFERRED that they are).
- **API:**
  - `POST /crm/v8/zia/smart_prompt/assistant`
  - Zia Enrichment APIs
  - Workflow rules can call Zia agents.

---

## Desk

### Conversational
- **No general Ask Zia chat for agents is documented.** The closest features are:
  - **Answer Bot inside a ticket:** opened from the Zia icon in the side bar.
  - **IM Reply Assistance:** the agent asks a question in the IM inbox panel and gets an answer with sources (Enterprise).
  - **Zia Agents:** Support Specialist and Resolution Expert. Early access only, for some US and IN accounts.
  - **Deluge Assistant bot.**
- Sources: https://help.zoho.com/portal/en/kb/desk/zia/articles/ai-based-self-service-with-answer-bot and https://help.zoho.com/portal/en/kb/desk/agentic-ai/articles/zia-agents-in-zoho-desk

### Generative AI in the ticket
Source: https://help.zoho.com/portal/en/kb/desk/zia/articles/ai-powered-services-for-tickets-insights-summary-reply-generator-writing-assistance-using-zia

- **Insights:** sentiment, tone, key topics.
- **Ticket summary:**
  - Bullet points, with filters by thread type.
  - Regenerate and translate.
  - Uses the last 30 conversations; each needs at least 50 words.
- **Thread summary:** for one message.
- **Reply Assistance:**
  - Uses the subject and the latest thread, grounded in the knowledge base.
  - Change tone, length or language.
- **Generate Content:** answers a free-text prompt.
- **In the reply editor:**
  - Writing Assistance.
  - Content Analysis: spelling, grammar, readability.
- **Ticket to Article:** 1 to 10 conversations become a KB draft, with personal details stripped.
- **Tags and keywords:**
  - Auto Tags (needs more than 3,000 tickets).
  - Thread keywords.
- **Rule-based sentiment.**
- **Guided Conversations:** a generative AI block.
- **Mobile:** summary, reply assistance and content generation.

### Predictions and Answer Bot
- **Field Prediction:**
  - Picklists and the ticket owner.
  - Needs 500+ tickets per department.
  - Recommended accuracy: 70.
  - Includes a Playground for testing.
  - Up to 20 predictions per department.
- **Anomaly detection:** per department, trained on the last 30 days.
- **Answer Bot:**
  - One bot per department, or one for all departments.
  - Match level: Exact, Confident or Possible.
  - Answers from the knowledge base only.
  - Retrains every 30 minutes.
  - 29 languages.

### Admin and data
Source: https://help.zoho.com/portal/en/kb/desk/zia/articles/setting-up-the-generative-ai-services-zia-open-source-model-chatgpt-deepseek

- **AI service:** one active at a time.
  - Zia (Qwen 30B, free, the default).
  - ChatGPT with your own key (several models).
  - Azure OpenAI.
  - DeepSeek (China data centre only).
- **Feature preferences per department:** Insights, Summary, Writing, Reply, Article, Zia Actions, Deluge bot.
  - Generation mode: on click, automatic, or dynamic.
  - Agents can turn off auto-suggestions for themselves.
- **Permissions:** the "Zia" profile permission. Zia Actions need Support Administrator.
- **PII anonymisation:** per department, by category. English only. It masks only what is sent to the AI.
- **Languages:** 33 for generative AI (35 in another source).

### Automation and API
Source: https://help.zoho.com/portal/en/kb/desk/automation/workflows/articles/ai-powered-workflow-automation-with-zia-actions

- **Zia Actions in workflow rules:**
  - Field extraction (up to 5 fields).
  - Field prediction.
  - Generate content (to a comment or a field).
  - Auto email reply.
  - Limit: 1,000 runs per day.
- **Public Desk API:** has no Zia endpoints (INFERRED).
- **Zoho MCP.**

### Editions (from 7 Jul 2026)
| Edition | What it adds |
|---|---|
| Express | Bring your own key, AI agents |
| Standard | Sentiment, tags, Answer Bot |
| Professional | Anomaly, Field Prediction, Zia model |
| Enterprise | Zia Actions, IM Reply Assistance, PII anonymisation |

---

## Not answered by Zoho's docs (test on TAVI)
1. Field-level permissions in chat answers.
2. Department and ticket scope of Desk AI.
3. Message length and rate limits.
4. A credits usage screen in CRM.
5. A per-profile way to hide AI features in Desk.
