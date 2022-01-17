const express = require('express');
const coinController = require('./mycoin.controller');
const upload = require('../../../config/multer');
const { protect, authorize } = require('../user/auth');

const myCoinRouter = express.Router();
module.exports = myCoinRouter;

myCoinRouter
  .route('/')
  .post(upload.single('image'), coinController.createMyCoin)
  .get(coinController.getAllMyCoins);

myCoinRouter
  .route('/:id')
  .put(protect, upload.single('image'), coinController.updateMyCoin)
  .get(coinController.getSingleMyCoin)
  .delete(coinController.deleteMyCoin);

myCoinRouter
  .route('/profit/:id')
  .put(
    protect,
    authorize('admin', 'agent'),
    upload.single('image'),
    coinController.updateProfit
  );

myCoinRouter
  .route('/mine/:owner')
  .get(protect, coinController.getAllMyPersonalCoins);

myCoinRouter
  .route('/mine/:owner/:coin')
  .get(protect, coinController.getCoinWithOnwerAndCoin);

myCoinRouter.route('/exchange/all').get(protect, coinController.getMarketcap);
