const TransactionModel = require('./transaction.model');
const UserModel = require('../user/user.model');
const CoinModel = require('../mycoin/mycoin.model');

module.exports = {
  async createTransaction(req, res) {
    try {
      let data = req.body;

      if (!data.owner)
        return res.status(400).send({ error: 'owner is required' });
      if (!data.coinAddress)
        return res.status(400).send({ error: 'coinAddress is required' });
      if (!data.transactionType)
        return res.status(400).send({ error: 'transactionType is required' });
      if (!data.amount)
        return res.status(400).send({ error: 'amount is required' });

      const owner = await UserModel.findOne({ _id: data.owner });
      if (!owner) return res.status(404).send({ error: 'User not found' });

      if (data.transactionType !== 'deposit' && !owner.idCard)
        return res.status(400).send({ error: 'Upload your valid id card' });

      const coin = await CoinModel.findOne({ _id: data.coinAddress });
      if (!coin) return res.status(404).send({ error: 'Coin not found' });

      let order = coin.order;

      coin.order = data.amount;
      // console.log('order' + order);
      // console.log('amount' + data.amount);
      // console.log('total' + coin.order);

      let transaction = new TransactionModel();
      transaction.owner = data.owner;
      if (data.walletAddress) transaction.walletAddress = data.walletAddress;
      transaction.coinAddress = data.coinAddress;
      transaction.transactionType = data.transactionType;
      transaction.amount = data.amount;

      await coin.save({ validateBeforeSave: false });

      await transaction.save((err, doc) => {
        if (!err) {
          return res
            .status(200)
            .send({ success: 'Transaction awaiting comfirmation' });
        } else {
          return res.status(400).send({ error: err });
        }
      });
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async updateTransaction(req, res) {
    try {
      let data = req.body;

      const transaction = await TransactionModel.findOne({
        _id: req.params.id
      });
      if (!transaction)
        return res.status(404).send({ error: 'User not found' });

      transaction.transactionStatus = data.transactionStatus;

      await transaction.save((err, doc) => {
        if (!err) {
          return res
            .status(200)
            .send({ success: 'Transaction status updated' });
        } else {
          return res.status(400).send({ error: err });
        }
      });
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async getSingleTransaction(req, res) {
    try {
      TransactionModel.findOne({ _id: req.params.id }, (err, doc) => {
        if (!err) {
          if (!doc)
            return res.status(404).send({ error: 'Transaction not found' });

          return res.status(200).send(doc);
        } else {
          return res.status(400).send({ error: err });
        }
      })
        .populate('owner', '_id name photo phonenumber email')
        .populate('coinAddress', '_id balance owner coin');
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async getAllTransation(req, res) {
    try {
      TransactionModel.find((err, docs) => {
        if (!err) {
          return res.status(200).send(docs);
        } else {
          return res.status(400).send({ error: err });
        }
      })
        .populate('owner', '_id name photo phonenumber email')
        .populate('coinAddress', '_id balance owner coin');
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async getAllMyTransation(req, res) {
    try {
      TransactionModel.find({ owner: req.params.owner }, (err, docs) => {
        if (!err) {
          return res.status(200).send(docs);
        } else {
          return res.status(400).send({ error: err });
        }
      })
        .populate('owner', '_id name photo phonenumber email')
        .populate('coinAddress', '_id balance owner coin');
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async findAllTransactionsPaginate(req, res) {
    try {
      const { page, perPage } = req.query;
      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(perPage, 10) || 10,
        sort: { createdAt: -1 },
        populate: [
          {
            path: 'coinAddress',
            select: '_id balance owner coin'
          },
          {
            path: 'owner',
            select: '_id name photo phonenumber email'
          }
        ]
      };

      await TransactionModel.paginate({}, options, (err, docs) => {
        if (!err) {
          if (docs) return res.status(200).send(docs);
        } else {
          return res.status(400).send({ error: err });
        }
      });
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async deleteTransaction(req, res) {
    try {
      const coin = await TransactionModel.findOne({ _id: req.params.id });
      if (!coin)
        return res.status(200).send({ error: 'transaction not found' });
      try {
        coin.remove((err, doc) => {
          if (!err) {
            if (doc.image) {
              destroy(nameFromUri(doc.image)).catch((result) => {
                console.log(result);
              });
            }

            return res.status(200).send({ success: 'transaction deleted' });
          } else {
            return res.status(400).send({ error: err });
          }
        });
      } catch (err) {
        return res.status(400).send({ error: err });
      }
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  }
};
