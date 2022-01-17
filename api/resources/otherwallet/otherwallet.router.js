const express = require('express');
const coinController = require('./otherwallet.controller');
const upload = require('../../../config/multer');
const { protect, authorize } = require('../user/auth');

const otherRouter = express.Router();
module.exports = otherRouter;

otherRouter.route('/')
    .post(upload.single('image'),coinController.importWallet)
    .get(coinController.getAllWallets);

    otherRouter.route('/:id')
    .get(coinController.getSingleWallet);