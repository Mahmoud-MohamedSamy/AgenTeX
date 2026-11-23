// AC-10 via the UI, step 1: assignment rule + inactive workflow rule (Field Update only). Owner action is added in the UI.
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b';
const ar = await api('POST', '/desk/assignment-rules', { type: 'direct', name: 'QA WF UIAC10 direct', description: 'QA', is_active: true, execute_on: ['create'], targets: [{ criteria: { conditions: [{ field_key: 'subject', operator: 'starts_with', value: 'QA WF UIAC10' }], pattern: '1' }, coming_to_department_id: DEPT2, move_to_department_id: null, assign: { kind: 'agent', user_id: TU1, team_id: null } }] });
const AR = ar.j?.data?.id || ar.j?.data?.rule?.id; if (AR) ledger(`assignment rule "QA WF UIAC10 direct" ${AR}`);
const r = await mkRule('UIAC10', { kind: 'RecordCreated' }, [FU({ qa_ndc_agency_code: 'WF' })], { active: false, departmentIds: [DEPT2] });
const out = { ar: ar.s, AR, rule: r.s, RID: r.id, err: r.err };
fs.writeFileSync(RUN + '/out/ui10.json', JSON.stringify(out)); return out;
