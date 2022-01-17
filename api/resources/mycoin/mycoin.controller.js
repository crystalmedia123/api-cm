const MyCoinModel = require('./mycoin.model');
const WalletModel = require('../wallet/wallet.model');
// const { request } = require('express');
// const request = require('request');
const axios = require('axios');

module.exports = {
  async createMyCoin(req, res) {
    try {
      let data = req.body;

      if (!data.coin)
        return res.status(400).send({ error: 'Coin Id is required' });
      if (!data.owner)
        return res.status(400).send({ error: 'Owner Id is required' });

      const coin = await MyCoinModel.findOne({
        owner: data.owner,
        coin: data.coin
      });

      if (coin)
        return res.status(400).send({ error: 'You already own this coin' });

      let thisCoin = new MyCoinModel();
      thisCoin.owner = data.owner;
      thisCoin.coin = data.coin;

      let wallet = await WalletModel.findOne({ owner: data.owner });
      if (!wallet) {
        wallet = new WalletModel();
        wallet.owner = data.owner;
        wallet.coin = [];
      }

      wallet.coin.push = data.coin;

      await thisCoin.save((err, docs) => {
        if (!err) {
          wallet.save((err, doc) => {
            return res.status(201).send({ success: 'Coin added to wallet' });
          });
        } else {
          return res.status(400).send({ error: `${err}` });
        }
      });
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async updateMyCoin(req, res) {
    try {
      const { subtract } = req.query;
      const coin = await MyCoinModel.findOne({ _id: req.params.id });

      if (!coin) return res.status(404).send({ error: 'Coin not found' });

      var data = req.body;

      if (!data.amount)
        return res.status(400).send({ error: 'Please enter amount to add' });

      let wallet = await WalletModel.findOne({ owner: coin.owner });

      coin.order = 0;

      if (!subtract || subtract == false) {
        coin.balance = coin.balance + data.amount;
        if (wallet)
          wallet.balance = parseFloat(wallet.balance) + parseFloat(data.amount);
      } else {
        coin.balance = coin.balance - data.amount;
        if (wallet)
          wallet.balance = parseFloat(wallet.balance) - parseFloat(data.amount);
      }

      await coin.save({ _id: req.params.id }, (err, docs) => {
        if (!err) {
          if (wallet)
            wallet.save((err, doc) => {
              return res.status(200).send({ success: 'Balance updated' });
            });
          else {
            return res.status(200).send({ success: 'Balance updated' });
          }
        } else {
          return res.status(400).send({ error: err });
        }
      });
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async updateProfit(req, res) {
    try {
      const coin = await MyCoinModel.findOne({ _id: req.params.id });

      if (!coin) return res.status(404).send({ error: 'Coin not found' });

      var data = req.body;

      if (!data.amount)
        return res.status(400).send({ error: 'Please enter amount to add' });

      coin.balance = parseFloat(coin.balance) + parseFloat(data.amount);

      coin.profit = 0;
      coin.profit = coin.profit + parseFloat(data.amount);

      let wallet = await WalletModel.findOne({ owner: coin.owner });
      if (wallet) {
        if (wallet.profit)
          wallet.profit = parseFloat(wallet.profit) + parseFloat(data.amount);
        else {
          wallet.profit = parseFloat(data.amount);
        }
        wallet.balance = parseFloat(wallet.balance) + parseFloat(data.amount);
      }

      await coin.save({ _id: req.params.id }, (err, docs) => {
        if (!err) {
          if (wallet)
            wallet.save((err, doc) => {
              return res.status(200).send({ success: 'Profit Added' });
            });
          else {
            return res.status(200).send({ success: 'Profit Added' });
          }
        } else {
          return res.status(400).send({ error: err });
        }
      });
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async getSingleMyCoin(req, res) {
    try {
      MyCoinModel.findOne({ _id: req.params.id }, (err, doc) => {
        if (!err) {
          if (!doc) return res.status(404).send({ error: 'MyCoin not found' });

          return res.status(200).send(doc);
        } else {
          return res.status(400).send({ error: err });
        }
      })
        .populate('owner', '_id name photo phonenumber email')
        .populate('coin', '_id name abbr icon');
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async getCoinWithOnwerAndCoin(req, res) {
    try {
      MyCoinModel.findOne(
        { owner: req.params.owner, coin: req.params.coin },
        (err, doc) => {
          if (!err) {
            if (!doc)
              return res.status(404).send({ error: 'MyCoin not found' });

            return res.status(200).send(doc);
          } else {
            return res.status(400).send({ error: err });
          }
        }
      )
        .populate('owner', '_id name photo phonenumber email')
        .populate('coin', '_id name abbr icon');
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async getAllMyCoins(req, res) {
    try {
      MyCoinModel.find((err, docs) => {
        if (!err) {
          return res.status(200).send(docs);
        } else {
          return res.status(400).send({ error: err });
        }
      })
        .populate('owner', '_id name photo phonenumber email')
        .populate('coin', '_id name abbr icon');
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async getAllMyPersonalCoins(req, res) {
    try {
      MyCoinModel.find({ owner: req.params.owner }, (err, docs) => {
        if (!err) {
          return res.status(200).send(docs);
        } else {
          return res.status(400).send({ error: err });
        }
      })
        .populate('owner', '_id name photo phonenumber email')
        .populate('coin', '_id name abbr icon');
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async findAllMyCoinsPaginate(req, res) {
    try {
      const { page, perPage, sort, level } = req.query;
      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(perPage, 10) || 10,
        sort: { date: -1 }
      };

      await MyCoinModel.paginate({}, options, (err, docs) => {
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

  async deleteMyCoin(req, res) {
    try {
      const coin = await MyCoinModel.findOne({ _id: req.params.id });
      if (!coin) return res.status(200).send({ error: 'coin not found' });

      const wallet = await WalletModel.findOne({ owner: coin.owner });
      if (wallet) {
        let i = 0;
        console.log(1);
        wallet.coin.forEach((coin) => {
          console.log(2);
          if (coin == coin._id) {
            wallet.coin.splice(i, 1);
          }
          i += 1;
        });
        console.log(3);
        await wallet.save({ validateBeforeSave: false });
        console.log(4);
      }

      coin.remove((err, doc) => {
        if (!err) {
          return res.status(200).send({ success: 'coin deleted' });
        } else {
          return res.status(400).send({ error: err });
        }
      });
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async getMarketcap(req, res) {
    const { cryptoAbbr, amount } = req.body;
    console.log('req body', req.body);
    try {
      axios
        .get(
          `https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=${amount}&symbol=USD&convert=${cryptoAbbr}`,
          {
            headers: {
              'Access-Control-Allow-Origin': `https://bitsqudtraders.com`,
              'Content-Type': 'application/json',
              'Access-Control-Allow-Methods':
                'GET,HEAD,OPTIONS,POST,PUT,DELETE',
              'X-CMC_PRO_API_KEY': 'a066765f-2b41-452b-9191-3ccbef3e78e1',
              Accept: 'application / json'
            }
          }
        )
        .then((response) => {
          // console.log(response);
          return res.status(200).send(response.data.data);
        });
    } catch (e) {
      return res.status(400).send({ error: e });
    }
  }
};
