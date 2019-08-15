'use strict';

const { events } = require('oblak-data');

const initialState = {
	holder: '',
	balance: 0,
};

const identity = {
	[events.domain.bank.account.created]: ({ aggregate }) => aggregate.id,
};

const reactions = {
	[events.domain.bank.account.created]: [
		async ({ payload }, vm) => {
			const { holder } = payload;
			vm.set('holder', holder);
		},
	],
};

module.exports = {
	initialState,
	identity,
	reactions,
};
