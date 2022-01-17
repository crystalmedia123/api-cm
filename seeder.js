const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './.env' });

// Load models
// const User = require('./api/resources/user/user.model');
const Coin = require('./api/resources/coin/coin.model');
// const MyCoin = require('./api/resources/mycoin/mycoin.model');
// const Transaction = require('./api/resources/transaction/transaction.model');
// const Wallet = require('./api/resources/wallet/wallet.model');
// const Image = require('./api/resources/wallet/images.model');

// Connect to DB
mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files
const coins = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/coins.json`, 'utf-8')
);

// const mycoins = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/mycoins.json`, 'utf-8')
// );

// const transactions = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/transactions.json`, 'utf-8')
// );

// const wallets = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/wallets.json`, 'utf-8')
// );

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
// );

// const images = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/images.json`, 'utf-8')
// );

// Import into DB
const importData = async () => {
  try {
    // await User.create(users);
    await Coin.create(coins);
    // await MyCoin.create(mycoins);
    // await Transaction.create(transactions);
    // await Wallet.create(wallets);
    // await Image.create(images);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    // await User.deleteMany();
    await Coin.deleteMany();
    // await MyCoin.deleteMany();
    // await Transaction.deleteMany();
    // await Wallet.deleteMany();
    // await Image.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Condition to choose Del or Imp
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
