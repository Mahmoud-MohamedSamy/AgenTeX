# Zoho CRM Hierarchy Preferences: reference inventory (from Zoho docs)

Compiled 21 Oct 2026 from public Zoho help, developer and edition pages only (no login). Each bullet has its source. **(inferred)** marks a conclusion drawn from the docs rather than stated in them. **(not documented)** marks a question the docs leave open; settle these against live Zoho before treating them as requirements.

Source key (full URLs are written out in every bullet):
- HP: Hierarchy Preference article
- RH: Creating Reporting Hierarchy article
- ROLES / NG-ROLES: Managing Roles (current and NextGen)
- FAQ-RP: FAQs on Roles and Profiles
- DSR: Data Sharing Rules article

---

## 1. Hierarchy Preferences settings page

- Location: **Setup > General > Company Settings > Hierarchy Preference**. Older UI: Setup > General > Company Details > Hierarchy Preference. https://help.zoho.com/portal/en/kb/crm/organization-settings/company-details/articles/crm-setup-hierarchy-preference ; https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Purpose: "a hierarchy ranks members by their designations". In Zoho CRM it decides which records each user can access. https://help.zoho.com/portal/en/kb/crm/organization-settings/company-details/articles/crm-setup-hierarchy-preference
- Two mutually exclusive options: **Role Hierarchy** and **Reporting Hierarchy**. The org picks one. https://help.zoho.com/portal/en/kb/crm/organization-settings/company-details/articles/crm-setup-hierarchy-preference
- Both options require roles to be defined and assigned to users. A user holds only one role at a time. https://help.zoho.com/portal/en/kb/crm/organization-settings/company-details/articles/crm-setup-hierarchy-preference
- Default is **Role Hierarchy**, which can be changed to Reporting Hierarchy. This comes from Zoho's SME implementation guide; the help article does not state a default. https://www.zoho.com/sites/zweb/images/crm/ebooks-implementation-guide-sme.pdf
- Choosing Reporting Hierarchy shows a sub-setting: **how non-reporting users are managed**. The two choices are "Any user higher up in the hierarchy" and "Super admin and Administrators". https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- The non-reporting-users setting also decides the approval fallback when a reporting manager is unavailable: first eligible higher-role user, or the CEO or an administrator. https://help.zoho.com/portal/en/kb/crm/process-management/approval-process/articles/add-approval-process
- Who can change it: only users with **administrative permission** in their profile. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Switching warning (Reporting to Role): a popup lists every place the "Reporting To" field is used (reports, criteria, filters, merge fields). The admin can keep or remove the field in each place. Kept usages retain the manager names. https://help.zoho.com/portal/en/community/topic/enhancements-in-user-field-and-reporting-hierarchy?page=1 ; https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- When the preference changes or is disabled, the Reporting Hierarchy panel on the user detail page disappears. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Switching affects forecasts: changing the forecast configuration (including its hierarchy) deletes current and future forecasts. Completed forecasts are archived. https://help.zoho.com/portal/en/kb/crm/sales-force-automation/forecasts/articles/creating-and-working-with-forecasts
- Switching affects roles: "Share Data with Peers" is hidden under Reporting Hierarchy. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles
- **(not documented)** When the switch takes effect (immediately or via a background recalculation job). Sharing-rule recalculation is a background process, flagged as `rule_computation_running` in the API, so a visibility recalculation is plausible **(inferred)**. https://www.zoho.com/crm/developer/docs/api/v8/retrieve-data-sharing-settings.html
- **(not documented)** Whether the switch writes an audit-log entry. The audit log is described as a chronological list of user actions; no page lists hierarchy-preference changes among its tracked events. https://www.zoho.com/crm/developer/docs/api/v8/api-references.html
- **(not documented)** Any confirmation dialog for switching Role to Reporting. Only the Reporting to Role "Reporting To usage" popup is documented. https://help.zoho.com/portal/en/community/topic/enhancements-in-user-field-and-reporting-hierarchy?page=1

## 2. Role Hierarchy

- Roles form the organization-wide hierarchy. Higher roles see the records of lower roles. Example: a Sales Manager sees the Sales Reps' records, and reps see only their own. https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- The **CEO** role (tree root) has access to the entire database. https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- **CEO and Manager** roles exist by default on paid accounts. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles
- Permission needed: **Manage Roles** in the profile. https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- A separate FAQ says renaming roles, changing a superior or turning off peer sharing needs **User Management** access, which only the Administrator profile can enable. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles
- Roles can be created only when the account has **more than one user**. With one user, "New Role" is not shown. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles
- Path: Setup > Security Control > **Roles and Sharing** > Roles > New Role. https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- Create-role fields: Role Name (required, unique, no duplicates), Reports To (lookup of the immediate superior role), Share Data with Peers (checkbox), Description. https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- If Reports To is left blank, the role is placed **under CEO**. https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- Every role must report to another role (mandatory). Only the root has no parent **(inferred)**. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles
- Role names must not contain some special characters (for example `#`); the API returns INVALID_DATA. https://www.zoho.com/crm/developer/docs/api/v8/create-role.html
- Edit role: name, Superior Role (Reports To) and Share Data with Peers can be changed. https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- Renaming a role updates its data sharing rules automatically, with no recalculation or user update needed. https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- Delete role: not allowed until its users and child roles are transferred. The Delete Role page asks for a "Transfer to Role"; then click **Transfer & Delete**. https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- On delete, child roles move under the selected role, which creates a new hierarchy structure. https://help.zoho.com/portal/en/kb/crm-nextgen/security-control/role-management/articles/nextgen-role-management-introduction
- Deleting a role is the documented way to **bulk-move all its users** to another role. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles
- Under Reporting Hierarchy, deleting a role also means picking new roles and managers for the affected users and subordinates. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- **Share Data with Peers**: lets users in the same role see each other's data. Off by default; peers cannot see each other's data unless it is enabled. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles
- Share Data with Peers **takes precedence over data sharing rules**, so peers can see each other's data even when the org default is Private. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles
- Share Data with Peers is hidden when the account has only one user or when Reporting Hierarchy is selected. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles ; https://help.zoho.com/portal/en/kb/crm-nextgen/security-control/role-management/articles/nextgen-role-management-introduction
- Assign a role: Setup > General > Users > user > Edit > Role dropdown > Save. Role is **mandatory** for a user, including when adding one through the API. https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles ; https://www.zoho.com/crm/developer/docs/api/v8/add-user.html
- A user cannot hold multiple roles. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles
- Role detail page shows **Associated Users**. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles
- Visibility rule: superiors see **all** subordinate levels' data (the whole subtree), not only immediate subordinates. "Users at a higher hierarchy can always access all the records of those at a lower hierarchy." https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- Superiors still need the profile's Read or Edit module permission to view or edit subordinate records. The hierarchy does not override profile permissions. https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- Superiors do **not** automatically see data shared to their subordinates through custom sharing rules, unless the rule has **Superiors Allowed** enabled. https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- Users with the **Administrator profile** see all data regardless of role. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles
- Hierarchy access applies to org modules. Team modules use team-module profiles. https://help.zoho.com/portal/en/kb/crm-nextgen/security-control/role-management/articles/nextgen-role-management-introduction
- Adding notes, attachments or emails to a record needs Read or Read/Write access to that record. https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- Each role can have one **forecast manager**, a user in that role, set under Setup > Security Control > Roles and Sharing > Roles. This applies only in role-hierarchy forecasts. The forecast manager can be replaced but not removed. https://help.zoho.com/portal/en/kb/crm/sales-force-automation/forecasts/articles/creating-and-working-with-forecasts
- **(not documented)** Maximum depth. The role count per edition is limited (section 7); no depth limit is stated. https://www.zoho.com/crm/complete-feature-list.html
- **(not documented)** Prevention of loops when re-parenting a role, for example making a role report to its own descendant. The API documents only an invalid `reporting_to` error. https://www.zoho.com/crm/developer/docs/api/v8/update-role.html

## 3. Reporting Hierarchy

- Model: each user can be assigned **one reporting manager**, who can view that user's data. https://help.zoho.com/portal/en/kb/crm/organization-settings/company-details/articles/crm-setup-hierarchy-preference
- Constraint: the reporting manager must hold a **higher role** than the user. Only users in superior roles are listed in the picker. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Roles stay mandatory under Reporting Hierarchy: the user keeps a role, and the role constrains who can be the manager. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Self-reporting and loops are impossible by construction, because the manager must be in a strictly higher role **(inferred)**. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Set on a new user: Setup > Users and Control > Users > Add New User > details > Role > **Reporting Manager** > Save. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Change on an existing user: Setup > Users > select user > **Reporting Hierarchy** section > Edit > select new manager > Save. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- User detail page, right panel: the Reporting Hierarchy section shows the user's manager and subordinates. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- **Non-reporting users**: users who need no manager can stay without one. Their data is not shown in the hierarchy view. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Who manages non-reporting users is set org-wide: "Any user higher up in the hierarchy" or "Super admin and Administrators". https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Peers: under Reporting Hierarchy users **cannot share data with peers**; there is no equivalent setting. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Default visibility: records are visible only to the owner and the superiors in the same branch. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Cross-branch sharing: Record > More > Share > "Share to" users > Read Only or Read/Write > Save. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- **"Reporting To" user field**: appears automatically, when Reporting Hierarchy is on, wherever user-module fields are listed (reports, criteria, filters, merge fields). https://help.zoho.com/portal/en/community/topic/enhancements-in-user-field-and-reporting-hierarchy?page=1
- Role change, demotion of a manager: the former manager's subordinates must be reassigned to a new manager. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Role change, promotion: the user's own manager may need to change, because the new role may sit above the current manager. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Role change, user with no subordinates: others are unaffected, but the user may need a new manager or become non-reporting. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Transfer to another branch or department: managers must come from the new branch. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Role-change flow: Users > Edit > Role List icon > select role > Save. The "**Change of Reporting manager**" popup then asks for a higher-level role and a user under it. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Deleting a user with no subordinates: delete directly. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Deleting a user with subordinates: transfer them to a user at an **equal or higher role**, or leave them non-reporting. The flow is "Delete this User" > "Transfer Subordinates and Delete User" > New Reporting Manager. https://help.zoho.com/portal/en/kb/crm/organization-settings/user-management/articles/crm-delete-transfer-users
- **(not documented)** Deactivating a manager. The deactivation article says nothing about subordinates or reporting lines. A community answer says no transfer prompt appears on deactivation, only on delete. https://help.zoho.com/portal/en/kb/crm/organization-settings/user-management/articles/activate-deactivate-users ; https://help.zoho.com/portal/en/community/topic/reassign-leads-contacts-accounts-and-deals-from-a-deactivated-user
- **(not documented)** Bulk setting or import of reporting managers. Only the per-user UI is documented, and the Add User API has no Reporting_To key. https://www.zoho.com/crm/developer/docs/api/v8/add-user.html
- **(not documented)** Maximum depth of the reporting chain. It is bounded by role depth, since each manager must be in a higher role **(inferred)**. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy

## 4. Features that change with the hierarchy (what switching affects)

- **Record visibility**: under Role, superior roles see subordinate roles' data. Under Reporting, the manager chain (same branch) sees the user's data. https://help.zoho.com/portal/en/kb/crm/organization-settings/company-details/articles/crm-setup-hierarchy-preference
- **Peers**: under Role, Share Data with Peers is available per role. Under Reporting it is not available. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles
- **Approval: "Levels" approver**: the levels offered follow the number of levels in the org hierarchy. The approver is picked by the record owner's position. Under Role, each level is the nearest superior role; under Reporting, it is the reporting-manager chain. https://help.zoho.com/portal/en/kb/crm/process-management/approval-process/articles/add-approval-process
- Approval level options: 1st, 2nd or 3rd level, or "all members up to the 2nd or 3rd level" (Reporting Manager approver). https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Approval "Levels" under Role picks **one user per level**: if a level has several users, the first listed is chosen. https://help.zoho.com/portal/en/kb/crm/faqs/approval-process/articles/faqs-on-approval-process
- Approval: **"Record Owner's Manager (Reporting)"** approver is available only when Reporting Hierarchy is enabled. https://help.zoho.com/portal/en/kb/crm/process-management/approval-process/articles/add-approval-process
- Approval, Role mode: "requester's manager" is the person immediately above in the role hierarchy, and receives rejection emails. https://help.zoho.com/portal/en/kb/crm/faqs/approval-process/articles/faqs-on-approval-process
- Approval fallback when no reporting manager exists: first eligible higher-role user, or the CEO or an admin, depending on the hierarchy preference. Under "Everyone" approvals, the choice is anyone or everyone higher, or the CEO and admins. https://help.zoho.com/portal/en/kb/crm/process-management/approval-process/articles/add-approval-process
- Approval auto-approves when a selected role has no users, the approver is deactivated, there are no users on the 1st or 2nd level, or the owner is inactive or deleted. https://help.zoho.com/portal/en/kb/crm/faqs/approval-process/articles/faqs-on-approval-process ; https://help.zoho.com/portal/en/kb/crm/process-management/approval-process/articles/add-approval-process
- Approval limits: up to 10 approver entries or stages, and 15 rule admins. https://help.zoho.com/portal/en/kb/crm/process-management/approval-process/articles/add-approval-process
- **Workflow email alert**: the "Record Owner's Manager" recipient, labelled "Owner's Manager" in the UI. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy ; https://help.zoho.com/portal/en-gb/community/topic/automated-workflow-emails-to-meeting-participants
- Workflow email notification recipients also include Roles, Groups, Territories and **Sub-ordinates**. Roles, groups and territories are not allowed when the email is sent as a single mass email. https://help.zoho.com/portal/en/kb/crm/automate-business-processes/actions/articles/set-email-notifications
- Email notification API: the owner's-manager recipient uses the merge field `${!<Module>.Owner.Reporting_To}`, for example `${!Deals.Owner.Reporting_To}`. https://www.zoho.com/crm/developer/docs/api/v8/create-email-notification.html
- **Blueprint**: Transition owners > Roles can include "Record Owner" and "**Reporting Manager**". https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- **Reports, criteria, filters, merge fields**: the "Reporting To" field becomes available under Reporting Hierarchy. https://help.zoho.com/portal/en/community/topic/enhancements-in-user-field-and-reporting-hierarchy?page=1
- Reports: rows a user sees follow their record access (hierarchy plus sharing). "You can see all data for which you have Read/Write access." https://help.zoho.com/portal/en/kb/crm/faqs/reports/articles/faqs-reports
- Report and folder sharing can target users, roles, or roles and subordinates. Sharing controls who can open the report, not which rows it shows. https://help.zoho.com/portal/en/kb/crm/faqs/reports/articles/faqs-reports
- **(not documented)** A "My team" or "Me and my subordinates" report or list-view filter. A community thread says it is missing and needs two reports. https://help.zoho.com/portal/en/community/topic/reports-for-me-and-my-team
- **Data sharing rules**: "Role and subordinates" is a share-from and share-to target. The subtree it covers follows the role tree **(inferred** for Reporting mode). https://help.zoho.com/portal/en/kb/crm/security-control/manage-data-sharing/articles/data-sharing-rules
- **Forecasts**: three hierarchy types (Role, Reporting, Territory); one is active at a time, chosen in the forecast configuration. https://help.zoho.com/portal/en/kb/crm/sales-force-automation/forecasts/articles/creating-and-working-with-forecasts
- Forecasts: when Reporting Hierarchy is enabled, it replaces the default Role hierarchy in the forecast configuration. https://help.zoho.com/portal/en/kb/crm/sales-force-automation/forecasts/articles/creating-and-working-with-forecasts
- Forecasts, Role mode: forecast managers are assigned manually, one per role. Reporting mode: reporting managers are automatically forecast managers. Territory mode: territory managers are. https://help.zoho.com/portal/en/kb/crm/sales-force-automation/forecasts/articles/creating-and-working-with-forecasts
- Forecasts, Reporting mode: non-reporting users sit under a root node, and a target is optional for them. Exclusion is per user only; Role mode can also exclude whole roles. https://help.zoho.com/portal/en/kb/crm/sales-force-automation/forecasts/articles/creating-and-working-with-forecasts
- Forecasts: non-reporting users default to the CEO or Administrator as forecast manager. With multiple CEOs, each sees and edits the whole org forecast. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- Forecasts: changing the configuration or hierarchy deletes current and future forecasts and archives completed ones. Changing the fiscal year deletes all forecasts. https://help.zoho.com/portal/en/kb/crm/sales-force-automation/forecasts/articles/creating-and-working-with-forecasts
- Forecasts are always private (visible to the owner and their manager) regardless of the org default. https://help.zoho.com/portal/en/kb/crm/security-control/manage-data-sharing/articles/data-sharing-rules ; https://help.zoho.com/portal/en/kb/crm/faqs/sales-force-automation/sales-forecasting/articles/faqs-sales-forecasting
- **Territory management**: adds access for other users in the record's territory and in superior territories, on top of role-hierarchy access. A user has one role but can be in many territories. https://help.zoho.com/portal/en/kb/crm/security-control/territory-management/articles/territory-decision-management
- Territory setup option: build from scratch or **extend the role hierarchy into territories**, and the choice is irreversible. This is documented for Recruit and likely the same in CRM **(inferred)**. https://help.zoho.com/portal/en/kb/recruit/getting-started/territory-management/decision-guide/articles/decision-guide-for-territory-management
- **Import History** always shows your records and your subordinates'. https://help.zoho.com/portal/en/kb/crm/security-control/manage-data-sharing/articles/data-sharing-rules
- **Email sharing**: Private means only the sender and higher roles can view and reply. Public Read Only limits reply, forward and edit to the owner and higher roles. https://help.zoho.com/portal/en/kb/crm/security-control/manage-data-sharing/articles/data-sharing-rules
- **(not documented)** Hierarchy effects on assignment rules, review process, Zia, or case escalation to a manager. No help page found ties these to the preference.

## 5. Data sharing settings and their interplay with the hierarchy

- Path: Setup > Security Control > Roles and Sharing > **Data Sharing Settings** > Default Organization Permissions, set per module. https://help.zoho.com/portal/en/kb/crm/security-control/manage-data-sharing/articles/data-sharing-rules
- Levels: **Private** (owner and superiors), **Public Read Only**, **Public Read/Write** (no delete), **Public Read/Write/Delete**. https://help.zoho.com/portal/en/kb/crm/security-control/manage-data-sharing/articles/data-sharing-rules
- The default is Private: only the record owner and their manager can view and access. https://www.zoho.com/crm/developer/docs/api/v8/retrieve-data-sharing-settings.html
- Hierarchy and sharing rules apply **only when the module is Private**. Public settings make them irrelevant. https://help.zoho.com/portal/en/kb/crm/security-control/manage-data-sharing/articles/data-sharing-rules
- Sharing rules can only **widen** access, never restrict below the org default. https://help.zoho.com/portal/en/kb/crm/security-control/manage-data-sharing/articles/data-sharing-rules
- Rule types: **Record Owner based** (share from roles, roles and subordinates, or groups) and **Criteria based**. https://help.zoho.com/portal/en/kb/crm/security-control/manage-data-sharing/articles/data-sharing-rules
- Share To: roles, roles and subordinates, groups, or all users. Access: Read Only, Read/Write, or Read/Write/Delete. https://help.zoho.com/portal/en/kb/crm/security-control/manage-data-sharing/articles/data-sharing-rules
- **Superiors Allowed** checkbox per rule: superiors of the target role or group also get access. This is Zoho's per-rule control over hierarchy reach. https://help.zoho.com/portal/en/kb/crm/security-control/manage-data-sharing/articles/data-sharing-rules
- **"Grant access using hierarchy" per module does not exist in Zoho.** It is a Salesforce concept. Zoho's nearest controls are the per-rule Superiors Allowed and the per-role Share Data with Peers **(inferred** from its absence in DSR and the API). https://help.zoho.com/portal/en/kb/crm/security-control/manage-data-sharing/articles/data-sharing-rules
- Rule list: Shared From and To, permission, last modified, a status toggle (activate or deactivate), clone, search, and a filter that includes **Superiors Inclusion**. https://help.zoho.com/portal/en/community/topic/a-fresh-interface-and-functionality-improvements-for-zoho-crms-data-sharing-settings
- A rule cannot be edited while its execution runs (background computation). https://help.zoho.com/portal/en/kb/crm/security-control/manage-data-sharing/articles/data-sharing-rules
- If a module has 4M or more records and 60% or more match the criteria, existing records are not shared on save; Zoho support must be contacted. https://help.zoho.com/portal/en/kb/crm/security-control/manage-data-sharing/articles/data-sharing-rules
- The org-level sharing model does not apply to Notes, Reports or Dashboards. Attachments, notes and competitors follow the parent record. https://help.zoho.com/portal/en/kb/crm/security-control/manage-data-sharing/articles/data-sharing-rules
- Permission needed: **Manage Data Sharing**. https://help.zoho.com/portal/en/kb/crm/security-control/manage-data-sharing/articles/data-sharing-rules
- Share Data with Peers overrides data sharing rules. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles

## 6. API

- `GET /crm/{version}/settings/roles` and `GET /crm/{version}/settings/roles/{role_ID}`. Scope `ZohoCRM.settings.roles.READ` or `.ALL`. https://www.zoho.com/crm/developer/docs/api/v8/get-roles.html
- Role fields: `id`, `name`, `display_label`, `reporting_to` ({name,id} parent role), `share_with_peers` (bool), `description`, `forecast_manager`, `created_by__s`, `modified_by__s`, `created_time__s`, `modified_time__s`. https://www.zoho.com/crm/developer/docs/api/v8/get-roles.html
- `POST /crm/{version}/settings/roles`: `name` is required; `reporting_to`, `description` and `share_with_peers` (default false) are optional. https://www.zoho.com/crm/developer/docs/api/v8/create-role.html
- Create-role errors: DUPLICATE_DATA (same name), MANDATORY_NOT_FOUND (name), INVALID_DATA (special character or deleted ID), **LICENSE_LIMIT_EXCEEDED** (edition role cap), NO_PERMISSION 403. https://www.zoho.com/crm/developer/docs/api/v8/create-role.html
- `PUT /crm/{version}/settings/roles[/{role_ID}]`: id, name, `reporting_to` (role ID), description, share_with_peers, and `forecast_manager` (user ID; only when forecasts are role-hierarchy based). One role per call. https://www.zoho.com/crm/developer/docs/api/v8/update-role.html
- Update-role errors: INVALID_DATA (invalid reporting_to, more than one role, deleted ID), DUPLICATE_DATA, MANDATORY_NOT_FOUND (ID). No documented loop or CEO-edit error. https://www.zoho.com/crm/developer/docs/api/v8/update-role.html
- `DELETE /crm/{version}/settings/roles/{role_ID}?transfer_to_id=` (mandatory). Errors: REQUIRED_PARAM_MISSING, UNABLE_TO_PARSE_DATA_TYPE, INVALID_DATA. Success response is "Role Deleted". https://www.zoho.com/crm/developer/docs/api/v8/transfer-users-and-delete-role.html
- Users: `GET /crm/{version}/users` returns `Reporting_To` ({name,id}), `role` and `profile`. Its `type` filter takes AllUsers, ActiveUsers, DeactiveUsers, AdminUsers, CurrentUser and others. https://www.zoho.com/crm/developer/docs/api/v8/get-users.html
- Add user: `role` and `profile` are mandatory; no `Reporting_To` key is documented. https://www.zoho.com/crm/developer/docs/api/v8/add-user.html
- Update user: `role` is updatable (needs privileges, else AUTHORIZATION_FAILED); `Reporting_To` is not documented as writable. https://www.zoho.com/crm/developer/docs/api/v8/update-user.html
- Delete user: the body takes `move_subordinate.id` (new manager) and/or `transfer`. The target must be active (INVALID_DATA otherwise) and cannot be a subordinate (NOT_ALLOWED). Super admin only; runs as a job that returns a `jobId`. https://www.zoho.com/crm/developer/docs/api/v8/transfer_records-delete_user.html
- Data sharing: `GET /crm/{version}/settings/data_sharing` returns per module `share_type` (private, public_read_only, public_read_write, public), `public_in_portals` and `rule_computation_running`. https://www.zoho.com/crm/developer/docs/api/v8/retrieve-data-sharing-settings.html
- Sharing rules: `GET /crm/{version}/settings/data_sharing/rules[/{id}]` returns `superiors_allowed`, `type` (Record_Owner_Based or Criteria_Based), `shared_from` and `shared_to` {resource, type roles/groups/all_users, `subordinates` bool}, `permission_type`, `status` and `match_limit_exceeded`. https://www.zoho.com/crm/developer/docs/api/v8/data-sharing-rules.html
- Record sharing API (share a record with users): https://www.zoho.com/crm/developer/docs/api/v8/share-record.html
- **(not documented)** No public API endpoint was found for reading or setting the Hierarchy Preference. The API reference index lists none. https://www.zoho.com/crm/developer/docs/api/v8/api-references.html

## 7. Edition availability and limits

- Roles per edition: Free 2, Standard 5, Professional 25, Enterprise 250, Ultimate 500. https://www.zoho.com/crm/complete-feature-list.html
- Profiles per edition: 2, 5, 15, 25, 200. Groups: none in Free, then 20, 30, 50 and 250 for Standard to Ultimate. https://www.zoho.com/crm/complete-feature-list.html
- The roles FAQ says roles and profiles can be created only in **Professional, Enterprise and Ultimate**. Free has only the Administrator profile and CEO role. This conflicts with the feature list's Standard figure of 5 roles. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles
- **Reporting hierarchy** is listed as an **Enterprise** (and Ultimate) feature: "every manager a real-time view of only their team's pipeline". https://www.zoho.com/crm/zohocrm-pricing.html ; https://www.zoho.com/crm/complete-feature-list.html
- Data sharing rules: Enterprise 25 per module (max 10 criteria-based); Ultimate 100 per module (max 15 criteria-based). Lower editions have none. https://www.zoho.com/crm/complete-feature-list.html
- Default data sharing settings are read-only for everyone in Standard. https://www.zoho.com/crm/complete-feature-list.html
- Territory management: Enterprise 150, Ultimate 250 territories. https://www.zoho.com/crm/complete-feature-list.html
- Forecasts per edition: Standard 5, Professional 10, Enterprise 15, Ultimate 20. Performance pages by user or role are Enterprise and above. https://help.zoho.com/portal/en/kb/crm/sales-force-automation/forecasts/articles/creating-and-working-with-forecasts
- Approval process and Blueprint owners are listed under Enterprise in pricing. https://www.zoho.com/crm/zohocrm-pricing.html
- **(not documented)** Maximum hierarchy depth, and a maximum number of subordinates per manager.

## 8. Documented edge cases

- **Circular reporting**: prevented structurally, because the manager must be in a higher role **(inferred)**. No explicit error is documented. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- **Deleting a role with users**: blocked until users and child roles are transferred via "Transfer to Role". https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- **Deleting a manager (Reporting)**: transfer subordinates to an equal or higher role, or leave them non-reporting. Only the super admin can delete users. https://help.zoho.com/portal/en/kb/crm/organization-settings/user-management/articles/crm-delete-transfer-users
- On user delete, **roles, territories and groups are retained**, and pending approvals or blueprint transitions in My Jobs are not transferred. https://help.zoho.com/portal/en/kb/crm/organization-settings/user-management/articles/crm-delete-transfer-users
- **Deactivating a manager**: not documented for the hierarchy. Deactivated approvers cause auto-approval. https://help.zoho.com/portal/en/kb/crm/organization-settings/user-management/articles/activate-deactivate-users ; https://help.zoho.com/portal/en/kb/crm/faqs/approval-process/articles/faqs-on-approval-process
- Super admin cannot be deactivated or deleted directly; the privilege must be transferred first. You cannot deactivate yourself. https://help.zoho.com/portal/en/kb/crm/organization-settings/user-management/articles/activate-deactivate-users
- **Changing a user's role (Reporting)**: demotion forces the subordinates to be reassigned. Promotion may force a new manager. A "Change of Reporting manager" popup appears. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- **Admin and CEO always see all**: the Administrator profile sees all data regardless of role, and the CEO role sees the whole database. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles
- **Superior read vs edit/delete**: hierarchy access is still capped by the superior's profile permissions (Read or Edit per module). https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- Hierarchy access is full owner-equivalent access, capped only by profile permissions **(inferred)**. https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- Superiors **do not** inherit what is shared to subordinates by sharing rules unless Superiors Allowed is checked. https://help.zoho.com/portal/en/kb/crm/articles/create-edit-delete-roles
- Users with the **same role** cannot see each other's data unless Share Data with Peers is on; when on, it overrides Private. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles
- **Single-user account**: the New Role and Share Data with Peers options are hidden. https://help.zoho.com/portal/en/kb/crm/faqs/roles-and-profiles/articles/faqs-roles-and-profiles
- **Switching Reporting to Role**: "Reporting To" usages are listed and can be kept or removed per place. https://help.zoho.com/portal/en/community/topic/enhancements-in-user-field-and-reporting-hierarchy?page=1
- **Switching the hierarchy used by forecasts**: existing current and future forecasts are deleted. https://help.zoho.com/portal/en/kb/crm/sales-force-automation/forecasts/articles/creating-and-working-with-forecasts
- **Multiple CEOs**: each can view and edit the whole org forecast. https://help.zoho.com/portal/en/kb/crm-v2-1/security-control/reporting-hierarchy/articles/crm-v2-create-reporting-hierarchy
- **Approval with an empty hierarchy level, or a role with no users**: the record is auto-approved at that level. https://help.zoho.com/portal/en/kb/crm/faqs/approval-process/articles/faqs-on-approval-process
- **Moving subordinates through the API to an inactive user or to a subordinate**: rejected with INVALID_DATA or NOT_ALLOWED. https://www.zoho.com/crm/developer/docs/api/v8/transfer_records-delete_user.html
- **Role name duplicate, or containing `#`**: rejected. https://www.zoho.com/crm/developer/docs/api/v8/create-role.html
- **Role cap reached**: LICENSE_LIMIT_EXCEEDED. https://www.zoho.com/crm/developer/docs/api/v8/create-role.html

---

### Open questions to settle against live Zoho
1. Whether the switch is immediate or a background job, and whether it writes an audit-log entry.
2. Whether a confirmation dialog appears for Role to Reporting.
3. Bulk or import setting of reporting managers, and whether the API can write `Reporting_To`.
4. Deactivating a manager who has subordinates.
5. Effect on assignment rules, review process, Zia and escalations.
6. Whether a list-view or report filter for subordinates exists.
7. Maximum hierarchy depth.
8. Whether Standard can create roles (the feature list and the FAQ disagree).
