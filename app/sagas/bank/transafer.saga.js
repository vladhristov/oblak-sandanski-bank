'use strict';

const { events } = require('oblak-data');

const { only } = require('oblak').tools.saga;

const identity = {
	[events.domain.bank.account.withdrawn]: ({ id }) => id,
	[events.domain.bank.account.deposited]: ({ metadata }) => metadata.transferId,
	[events.domain.bank.account.commandRejected]: ({ metadata }) => metadata.transferId,
};

const reactions = {
	[events.domain.bank.account.withdrawn]: [
		only.ifNotExists(),
		only.if((evt) => {
			const { metadata } = evt;
			return !!metadata.transferTo;
		}),
		(evt, saga, app) => {
			const { payload, aggregate, metadata } = evt;
			const { amount } = payload;
			const { transferTo } = metadata;

			saga.set('amount', amount);

			app.getDomain().bank.account(transferTo).internalDeposit(
				{ amount, reference: `transfer from ${aggregate.id}.` },
				{ transferFrom: aggregate.id, transferId: saga.id },
			);
		},
	],
	[events.domain.bank.account.deposited]: [
		only.if(({ metadata }) => !!metadata.transferId),
		only.ifExists(),
		(evt, saga) => saga.destroy(),
	],
	[events.domain.bank.account.commandRejected]: [
		only.if(({ metadata }) => !!metadata.transferId),
		only.ifExists(),
		(evt, saga, app) => {
			const { aggregate, metadata } = evt;
			const amount = saga.get('amount');
			const { transferFrom } = metadata;
			app.getDomain().bank.account(transferFrom).internalDeposit(
				{ amount, reference: `failed transfer to ${aggregate.id}.` },
				{ transferFrom: aggregate.id, transferId: saga.id },
			);
		},
	],
};

module.exports = {
	reactions,
	identity,
};
