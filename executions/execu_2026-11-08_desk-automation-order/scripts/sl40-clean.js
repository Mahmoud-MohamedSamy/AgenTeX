const R={};
R.contract=(await api('DELETE','/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/897f7bab-9ab9-422f-9ef9-fcb48bdd1ce0')).s;
R.plan=(await api('DELETE','/desk/sla/support-plans/0d818d96-9d34-48dc-b031-83858a52ce57')).s;
R.policy=(await api('DELETE','/desk/sla/policies/a67512ff-07ad-4699-ba0e-ed468a9ba660')).s;
R.account=(await api('DELETE','/modules/784400e1-4a2a-42c2-b4f3-7ca56e79828a/records/e5cce304-2aae-4c26-b145-13c46f183603')).s;
return R;
