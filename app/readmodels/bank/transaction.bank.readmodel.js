'use strict';

const { events } = require('oblak-data');

const initialState = {
	amount: 0,
	account: '',
	operation: '', // DEPOSIT / WITHDRAW
	reference: '',
	timestamp: 0,
};

const identity = {
	[events.domain.bank.account.deposited]: ({ id }) => id,
	[events.domain.bank.account.withdrawn]: ({ id }) => id,
};

const reactions = {
	[events.domain.bank.account.deposited]: [
		async (evt, vm) => {
			const { payload, aggregate, metadata } = evt;
			const { amount, reference = '' } = payload;
			// account id is the same as aggregate id
			vm.set({
				account: aggregate.id, // aggregate id is the account id
				amount, // the amount deposited
				operation: 'DEPOSIT', // the operation type
				reference, // reference if given
				timestamp: new Date(metadata.timestamp), // timestamp of the operation inlcuded in each events metadata
			});
		},
	],
	[events.domain.bank.account.withdrawn]: [
		async (evt, vm) => {
			const { payload, aggregate, metadata } = evt;
			const { amount, reference = '' } = payload;
			// account id is the same as aggregate id
			vm.set({
				account: aggregate.id, // aggregate id is the account id
				amount, // the amount deposited
				operation: 'WITHDRAW', // the operation type
				reference, // reference if given
				timestamp: new Date(metadata.timestamp), // timestamp of the operation inlcuded in each events metadata
			});
		},
	],
};

module.exports = {
	initialState,
	identity,
	reactions,
};
