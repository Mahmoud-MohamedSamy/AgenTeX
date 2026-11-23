const w = (await api('GET', '/ai/credits/wallet')).j?.data;
return { avail: w.available_credits, held: w.held_credits, debited: w.lifetime_debited_credits };
