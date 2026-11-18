const X='<img src=x onerror="window.__xss=1">';
const r=await mkRule('2963',{kind:'RecordCreated'},[{type:'AddTicketComment',commentBody:'QA RT18 2963 comment '+X,commentPublic:false}]);
const g=(await api('GET','/workflow/rules/'+r.id)).j?.data;return {res:r.res,id:r.id,stored:g?.actions?.[0]?.commentBody};
