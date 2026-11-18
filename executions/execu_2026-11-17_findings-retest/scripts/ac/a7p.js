const me=JSON.stringify(D((await api('GET','/iam/me')).j)||{}); const mine=me.includes(US.D)?'D':'E'; const other=mine==='D'?IDS.T7:IDS.T6; const ph=process.env.PH||'x';
const o={me:mine,ph}; o.own=(await api('GET','/modules/'+TM+'/records/'+(mine==='D'?IDS.T6:IDS.T7))).s;
o.viewOther=(await api('GET','/modules/'+TM+'/records/'+other)).s+'/'+(await api('GET','/desk/tickets/'+other)).s;
o.editOther=await pr('PATCH','/modules/'+TM+'/records/'+other,{data:[{field:'priority',value:sv('low')}]});
o.commentOther=await pr('POST','/desk/tickets/'+other+'/comments',{body_html:'<p>QA RT21 AC A7 '+mine+' comment ('+ph+')</p>',is_private:true});
o.at=new Date().toISOString(); return o;
