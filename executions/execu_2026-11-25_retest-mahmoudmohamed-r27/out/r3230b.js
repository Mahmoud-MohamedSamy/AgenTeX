const d = (await api.O('GET', '/workflow/rules/' + ST.R3230)).j?.data;
return { isActive: d?.isActive, criteria: JSON.stringify(d?.criteria)?.slice(0, 120), action: d?.actions?.[0]?.fieldUpdates?.qa_ndc_agency_code?.stringValue, updatedAt: d?.updatedAt };
