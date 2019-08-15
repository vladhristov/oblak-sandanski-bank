'use strict';

const { async, command } = require('oblak').tools.rest;

const routes = {
	'/': {
		post: [
			async(async (req, res) => {
				const app = req.getApp();
				const { pin, holder } = req.body;
				const commandRes = await app.getDomain().bank.account().create({ pin, holder }).await();
				res.json(commandRes);
			}),
		],
	},
};

module.exports = {
	routes,
};
