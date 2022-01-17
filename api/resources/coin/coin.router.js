const express = require('express');
const coinController = require('./coin.controller');
const upload = require('../../../config/multer');
const { protect, authorize } = require('../user/auth');

const coinRouter = express.Router();
module.exports = coinRouter;

coinRouter.route('/')
    .post(upload.single('image'),coinController.createCoin)
    .get(coinController.getAllCoins);

coinRouter.route('/:id')
    .put(protect, upload.single('image'),coinController.updateCoin)
    .get(coinController.getSingleCoin)
    .delete(coinController.deleteCoin);