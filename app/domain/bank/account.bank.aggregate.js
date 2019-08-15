'use strict';

const { domain: { command: { only } } } = require('oblak/lib/tools');

const initialState = {
	balance: 0, // current balance in stotinki
	pin: '', // pin code of the account
	holder: '', // account beneficiary
};

const commands = {
	create: [
		only.ifNotExists(),
		only.ifValidatedBy({
			$async: true,
			type: 'object',
			properties: {
				pin: {
					type: 'string',
					pattern: '^\\d{4}$',
				},
				holder: {
					type: 'string',
					minLength: 1,
				},
			},
			required: ['pin', 'holder'],
		}),
		async (cmd, agg, app) => {
			const { payload, metadata } = cmd;
			const { holder, pin } = payload;
			agg.apply.created({ holder, pin });
		},
	],
	deposit: [
		only.ifExists(),
		only.ifValidatedBy('/accountOperation'),
		only.ifState(({ payload }, agg) => {
			if (payload.pin !== agg.get('pin'))
				throw new Error('Wrong Pin.');
		}),
		async ({ payload }, agg) => {
			const { amount } = payload;
			const currentBalance = agg.get('balance');
			const balance = currentBalance + amount;
			agg.apply.deposited({ amount, balance });
		},
	],
	withdraw: [
		() => {},
	],
};

const events = {
	created: [
		(evt, aggregate) => {
			const { payload } = evt;
			const { pin, holder } = payload;
			aggregate.set('pin', pin);
			aggregate.set('holder', holder);
		},
	],
	deposited: [
		({ payload }, agg) => {
			const { balance } = payload;
			agg.set('balance', balance);
		},
	],
	withdrawn: [
		() => {},
	],
};

module.exports = {
	initialState,
	commands,
	events,
};
