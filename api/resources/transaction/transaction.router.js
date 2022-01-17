const express = require('express');
const transactionController = require('./transaction.controller');
const upload = require('../../../config/multer');
const { protect, authorize } = require('../user/auth');

const transactionRouter = express.Router();
module.exports = transactionRouter;

transactionRouter
  .route('/')
  .post(upload.single('image'), transactionController.createTransaction)
  .get(transactionController.getAllTransation);

transactionRouter
  .route('/:id')
  .put(protect, upload.single('image'), transactionController.updateTransaction)
  .get(transactionController.getSingleTransaction)
  .delete(transactionController.deleteTransaction);

transactionRouter
  .route('/mine/:owner')
  .get(transactionController.getAllMyTransation);

transactionRouter
  .route('/paginate/all')
  .get(transactionController.findAllTransactionsPaginate);
