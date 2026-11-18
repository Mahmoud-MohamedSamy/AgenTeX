const cm=[{type:'AddTicketComment',commentBody:'QA RT18',commentPublic:false}];const R={};
R.d1=(await mkRule('2961 due 1 day before',{kind:'DateFieldRelative',dateFieldName:'due_date',offsetSeconds:-86400,offsetMode:'wall_clock'},cm)).res;
R.d2=(await mkRule('2961 due 2 days after',{kind:'DateFieldRelative',dateFieldName:'due_date',offsetSeconds:172800,offsetMode:'wall_clock'},cm)).res;
R.fo=(await mkRule('2961 owner changed',{kind:'SpecificFieldChanged',fieldName:'owner',fieldNames:['owner'],fieldMatch:'any',alsoOnCreate:false},cm)).res;
R.fs=(await mkRule('2961 status priority changed',{kind:'SpecificFieldChanged',fieldName:'status',fieldNames:['status','priority'],fieldMatch:'any',alsoOnCreate:false},cm)).res;
return R;
