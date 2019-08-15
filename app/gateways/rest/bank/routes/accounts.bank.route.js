'use strict';

const { async, command, readmodels } = require('oblak').tools.rest;

const routes = {
	'/': {
		get: readmodels.list(r => r.bank.account),
		post: [
			async(async (req, res) => {
				const app = req.getApp();
				const { pin, holder } = req.body;
				const { payload } = await app.getDomain().bank.account().create({ pin, holder }).await('readmodel.bank.account.*');
				res.json(payload);
			}),
		],
	},
	'/:account': {
		get: [
			async(async (req, res) => {
				const app = req.getApp();
				const { account } = req.params;
				const [accountResult] = await app.getReadmodels().bank.account(account);
				if (!accountResult)
					throw new app.errors.NotFoundError();
				res.json(accountResult);
			}),
		],
	},
	'/:account/transactions': {
		get: [
			async(async (req, res) => {
				const app = req.getApp();
				const { account } = req.params;
				res.json(await app.getReadmodels().bank.transaction()
					.filter({ account })
					.sort([{ timestamp: 'asc' }]));
			}),
		],
	},
	'/:id/deposit': {
		post: command(domain => ({ command: domain.bank.account.deposit, event: 'readmodel.bank.account.*' })),
	},
	'/:id/transfer': command(domain => ({ command: domain.bank.account.transfer, event: 'readmodel.bank.account.*' })),
	'/:id/withdraw': {
		post: command(domain => ({ command: domain.bank.account.withdraw, event: 'readmodel.bank.account.*' })),
	},
};

module.exports = {
	routes,
};
