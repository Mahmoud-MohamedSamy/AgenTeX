const t = 'e21c1bda-2a5e-470e-8bbf-26b407cb6c4e'; log('state', JSON.stringify((await bstate(t))?.activeStates)); log('hist', (await hist(t)).filter(h => /blueprint|status/.test(h)));
