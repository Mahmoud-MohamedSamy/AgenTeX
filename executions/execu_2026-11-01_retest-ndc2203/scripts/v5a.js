const r = await mkRule('V1', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'Team', ownerValue: '1adfefb7-0c25-4484-ae92-782964695054' }]);
return fin({ r });
