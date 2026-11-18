const dep={field:'department',value:{kind:'string',value:C.D}};const st={field:'status',value:{kind:'string',value:'Open'}};
const S=s=>({field:'subject',value:{kind:'string',value:'QA RT21 TK F10 '+s}});
const cases=[
['A missing kind (reference)',[{field:'subject',value:{value:'QA RT21 TK F10 A'}},st,dep]],
['D unknown kind "bogus"',[{field:'subject',value:{kind:'bogus',value:'QA RT21 TK F10 D'}},st,dep]],
['I kind null',[{field:'subject',value:{kind:null,value:'QA RT21 TK F10 I'}},st,dep]],
['J kind number, text value',[{field:'subject',value:{kind:'number',value:'QA RT21 TK F10 J'}},st,dep]],
['D2 unknown kind on 2nd item (priority)',[S('D2'),{field:'priority',value:{kind:'bogus',value:'High'}},st,dep]],
['J2 kind boolean on priority',[S('J2'),{field:'priority',value:{kind:'boolean',value:'High'}},st,dep]],
];
const out=[];
for(let rep=0;rep<2;rep++)for(const [n,d] of cases){const t=new Date().toISOString().slice(11,19);const r=await api('POST','/modules/'+TK+'/records',{data:d});const e=r.j?.error;const id=r.j?.data?.id;if(id){LED('ticket created '+id+' via F10 case '+n);(C.f10=C.f10||[]).push(id);saveC();}
const paths=JSON.stringify(e?.details||'').match(/"(path|field|loc)":("[^"]*"|\[[^\]]*\])/g);out.push([rep,t,n,r.s,e?.code||'',(e?.message||'').slice(0,90),(paths||[]).join(' ').slice(0,200)||JSON.stringify(e?.details||'').slice(0,200),id?'CREATED':'']);}
const z=await api('POST','/modules/'+TK+'/records',{data:[S('Z control'),st,dep]});const zid=z.j?.data?.id;out.push(['-',new Date().toISOString().slice(11,19),'Z valid control',z.s,'','','',zid?'CREATED':'']);if(zid){LED('ticket created '+zid+' "QA RT21 TK F10 Z control"');(C.f10=C.f10||[]).push(zid);saveC();}
fs.writeFileSync(RUN+'/scripts/tk/f10.out.json',JSON.stringify(out,null,1));for(const o of out)log(o.join(' | '));
