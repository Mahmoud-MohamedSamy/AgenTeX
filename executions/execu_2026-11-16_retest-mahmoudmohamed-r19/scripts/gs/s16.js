const o={}; o.srcBadVal=await recVal(L,I.R.SRCBAD,'qa_rt19_gs_src'); const y=await mkRec(L,'Src nope',{qa_rt19_gs_src:'NotAValue'}); o.nope=y[0]+' '+y[2]; if(y[1]){I.R.SRCNOPE=y[1];SAVE();}
const z=await mkRec(L,'Tier nope',{qa_rt19_gs_tier:'NotAValue'}); o.tierNope=z[0]+' '+z[2]; if(z[1]){I.R.TNOPE=z[1];SAVE();}
return o;
