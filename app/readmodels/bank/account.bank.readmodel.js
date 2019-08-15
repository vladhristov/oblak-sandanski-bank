'use strict';

const { events } = require('oblak-data');

const initialState = {
	holder: '',
	balance: 0,
};

const identity = {
	[events.domain.bank.account.created]: ({ aggregate }) => aggregate.id,
	[events.domain.bank.account.deposited]: ({ aggregate }) => aggregate.id,
};

const reactions = {
	[events.domain.bank.account.created]: [
		async ({ payload }, vm) => {
			const { holder } = payload;
			vm.set('holder', holder);
		},
	],
	[events.domain.bank.account.deposited]: [
		async ({ payload }, vm) => {
			const { balance } = payload;
			vm.set('balance', balance);
		},
	],
};

module.exports = {
	initialState,
	identity,
	reactions,
};
