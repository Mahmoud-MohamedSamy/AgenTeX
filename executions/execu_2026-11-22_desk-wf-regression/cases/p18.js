const r = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF P18', isActive: false, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: guard('QA WF P18 '), actions: [{ order: 0, type: 'SendPortalAccess', portalId: '11111111-1111-1111-1111-111111111111', resend: false }], departmentIds: [DEPT2] });
const id = r.j?.data?.id; if (id) await api('DELETE', '/workflow/rules/' + id);
const r2 = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF P18b', isActive: false, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: guard('QA WF P18 '), actions: [{ order: 0, type: 'ScheduleCall', activitySubject: 'x', callPurpose: 'x', activityStartOffsetMinutes: 0 }], departmentIds: [DEPT2] });
const id2 = r2.j?.data?.id; if (id2) await api('DELETE', '/workflow/rules/' + id2);
return { portal: r.s + ' ' + (errOf(r) || ''), call: r2.s + ' ' + (errOf(r2) || '') };
