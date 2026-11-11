const M='88e8ea44-1658-4df3-9930-d0902b91073d',C='43004ce2-577f-4eda-b00a-0750fe40c3d4';const R={};
for(const id of ['44d68da1-79ef-4e95-9fd2-8ed7773b1889','24a59b96-ce99-4997-b702-404693a4b42a','523fd570-208c-4f47-9a10-ab0da19e6ef3'])R['t'+id.slice(0,4)]=(await api('DELETE','/modules/'+M+'/records/'+id)).s;
for(const id of ['bde72b35-452b-461d-be79-322bdb3e60b3','bff63579-ea3d-420d-bd39-4d322ce0a511','9a381223-604f-4b60-a359-cf529c104cff'])R['c'+id.slice(0,4)]=(await api('DELETE','/modules/'+C+'/records/'+id)).s;
return R;
