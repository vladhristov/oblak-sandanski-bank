'use strict';

const { async, command } = require('oblak').tools.rest;

const routes = {
	'/': {
		post: [
			async(async (req, res) => {
				const app = req.getApp();
				const { pin, holder } = req.body;
				const { payload } = await app.getDomain().bank.account().create({ pin, holder }).await('readmodel.bank.account.*');
				res.json(payload);
			}),
		],
	},
	'/:id/deposit': {
		post: command(domain => ({ command: domain.bank.account.deposit, event: 'readmodel.bank.account.*' })),
	},
};

module.exports = {
	routes,
};
