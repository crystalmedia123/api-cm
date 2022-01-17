const request = require('request');

module.exports = {
  async createMyCoin(req, res) {
    try {
      request(
        'https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=1&symbol=USD&convert=USDC',
        function (error, response, body) {
          console.error('error:', error); // Print the error if one occurred
          if (error) {
            return res.status(400).send({ error: 'error occurred' });
          }
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          if (response.statusCode === 200) {
            return res.status(200).send(body);
          }
          console.log('body:', body); // Print the HTML for the Google homepage.
        }
      );
    } catch (e) {}
  }
};
