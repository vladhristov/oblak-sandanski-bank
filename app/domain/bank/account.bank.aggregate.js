'use strict';

const { domain: { command: { only } } } = require('oblak/lib/tools');

const initialState = {
	balance: 0, // current balance in stotinki
	pin: '', // pin code of the account
	holder: '', // account beneficiary
};

const commands = {
	create: [
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
		() => {},
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
		() => {},
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
