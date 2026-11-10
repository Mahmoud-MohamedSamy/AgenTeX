const D1='6a7a38a8-aaf5-4a9b-aa99-b5eaa676e7e7';
const vis=async id=>{const g=await api('GET','/desk/departments/'+id);const d=g.j&&(g.j.data||g.j);return {visibility:d&&d.visibility,rv:d&&d.row_version,keys:d&&Object.keys(d).filter(k=>/visib|help|display/.test(k))};};
// API create with the field Lane G used
const a=await api('POST','/desk/departments',{name:'QA RC 1865 Dept API vis',visibility:'public'});const A=a.j&&a.j.data&&a.j.data.id;out.apiVisibilityPublic={s:a.s,id:A,after:A&&await vis(A)};if(A)log(`CREATED department ${A} (QA RC 1865 Dept API vis) via API with visibility:'public' → ${a.s}`);
const b=await api('POST','/desk/departments',{name:'QA RC 1865 Dept API dihc',display_in_help_center:true});const B2=b.j&&b.j.data&&b.j.data.id;out.apiDisplayTrue={s:b.s,id:B2,after:B2&&await vis(B2)};if(B2)log(`CREATED department ${B2} (QA RC 1865 Dept API dihc) via API with display_in_help_center:true → ${b.s}`);
// no field at all
const c=await api('POST','/desk/departments',{name:'QA RC 1865 Dept API none'});const C3=c.j&&c.j.data&&c.j.data.id;out.apiNoField={s:c.s,id:C3,after:C3&&await vis(C3)};if(C3)log(`CREATED department ${C3} (QA RC 1865 Dept API none) via API with no visibility field → ${c.s}`);
// edit D1 public -> private -> public via API (UI already shown for create)
let v=await vis(D1);const p1=await api('PATCH','/desk/departments/'+D1,{display_in_help_center:false,row_version:v.rv});out.patchOff={s:p1.s,t:p1.s>=300?p1.t.slice(0,200):'',after:(await vis(D1)).visibility};log(`UPDATED department ${D1} display_in_help_center false → ${p1.s}`);
v=await vis(D1);const p2=await api('PATCH','/desk/departments/'+D1,{display_in_help_center:true,row_version:v.rv});out.patchOn={s:p2.s,t:p2.s>=300?p2.t.slice(0,200):'',after:(await vis(D1)).visibility};log(`UPDATED department ${D1} display_in_help_center true → ${p2.s}`);
v=await vis(D1);const p3=await api('PATCH','/desk/departments/'+D1,{visibility:'private',row_version:v.rv});out.patchVisibilityField={s:p3.s,after:(await vis(D1)).visibility};log(`UPDATED department ${D1} visibility:'private' (field test) → ${p3.s}`);
return out;
