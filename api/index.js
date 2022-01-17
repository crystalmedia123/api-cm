const express = require('express');
const userRouter = require('./resources/user');
const imageRouter = require('./resources/image');
const authRouter = require('./resources/auth');
const coinRouter = require('./resources/coin');
const myCoinRouter = require('./resources/mycoin');
const walletRouter = require('./resources/wallet');
const transactionRouter = require('./resources/transaction');
const otherRouter = require('./resources/otherwallet');

const restRouter = express.Router();

module.exports = restRouter;

console.log('mycoin router');
restRouter.use('/users', userRouter);
restRouter.use('/authenticate', authRouter);
restRouter.use('/images', imageRouter);
restRouter.use('/coins', coinRouter);
restRouter.use('/mycoins', myCoinRouter);
restRouter.use('/wallets', walletRouter);
restRouter.use('/transactions', transactionRouter);
restRouter.use('/otherwallets', otherRouter);
