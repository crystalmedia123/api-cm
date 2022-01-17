const express = require('express');
const walletController = require('./wallet.controller');
const upload = require('../../../config/multer');
const { protect, authorize } = require('../user/auth');

const walletRouter = express.Router();
module.exports = walletRouter;

walletRouter.route('/')
    .get(walletController.getAllWallets);

walletRouter.route('/:id')
    .get(walletController.getSingleWallet);
    
walletRouter.route('/mine/:owner')
    .get(walletController.getMyWallet);