const X='<svg onload="window.__xss=2"></svg><a href="javascript:window.__xss=3">QA link</a><iframe src="javascript:window.__xss=4"></iframe><p onmouseover="window.__xss=5">QA hover</p><script>window.__xss=6</script>';
const r=await mkRule('2963b',{kind:'RecordCreated'},[{type:'AddTicketComment',commentBody:'QA RT18 2963b '+X,commentPublic:false}]);return {res:r.res,id:r.id};
