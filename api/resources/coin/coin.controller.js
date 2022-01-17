const url = require("url");
const path = require("path");
const cloudinary = require('../../../config/cloudinary');

const CoinModel = require("./coin.model");

module.exports = {
    async createCoin(req,res){
        try {

            let data = req.body;

            if(!data.name) return res.status(400).send({"error":"Name is required"});
            if(!data.abbr) return res.status(400).send({"error":"Abbr is required"});
            if(!data.address) return res.status(400).send({"error":"Wallet address is required"});
            if(!data.icon) return res.status(400).send({"error":"Icon is required"});

            const coin = await CoinModel.findOne(({name:data.name}));

            if (coin) return res.status(400).send({"error":"Coin already exist"});

            let thisCoin = new CoinModel();
            thisCoin.name = data.name;
            thisCoin.abbr = data.abbr;
            thisCoin.address = data.address;
            thisCoin.icon = data.icon;

            await thisCoin.save((err, docs)=>{
                if (!err){
                    return res.status(201).send({"success":"Coin created"});
                }
                else{
                    return res.status(400).send({"error":`${err}`});
                }
            });

        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async updateCoin(req,res){
        try {
            const coin = await CoinModel.findOne(({_id:req.params.id}));

            if(!coin) return res.status(404).send({"error":'Coin not found'});

            var data = req.body;

            if(!data.name && !data.abbr && !data.icon && !data.address)
                return res.status(400).send({"error":'Nothing to update'});

            if (data.name){
                coin.name = data.name;
            }

            if (data.address){
                coin.address = data.address;
            }

            if (data.abbr){
                coin.abbr = data.abbr;
            }

            if (data.icon){
                coin.icon = data.icon;
            }

            await coin.save(({_id:req.params.id}),(err, docs)=>{
                if (!err){
                    res.status(200).send({"success":"coin updated"});
                }
                else{
                    res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            res.status(400).send({"error":err});
        }
    },

    async getSingleCoin(req,res){
        try {
            CoinModel.findOne(({_id:req.params.id}),(err,doc)=>{
                if(!err){
                    if(!doc)
                        return res.status(404).send({"error":'Coin not found'});

                    res.status(200).send(doc);
                }
                else{
                    res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            res.status(400).send({"error":err});
        }
    },

    async getAllCoins(req,res){
        try {
            CoinModel.find((err,docs)=>{
                if(!err){
                    return res.status(200).send(docs);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async findAllCoinsPaginate(req,res){
        try {
            const {page,perPage,sort,level} = req.query;
            const  options = {
                page: parseInt(page,10) || 1,
                limit: parseInt(perPage,10) || 10,
                sort: {date: -1}
            }
            
            await CoinModel.paginate({},options,(err, docs)=>{
                if(!err){
                    if (docs) return res.status(200).send(docs);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (e) {
            return res.status(400).send({"error":e});
        }
    },

    async deleteCoin(req,res){
        try {
            const coin = await CoinModel.findOne(({_id:req.params.id}));
            if(!coin) return res.status(200).send({"error": "coin not found"});

            try {
                coin.remove((err, doc)=>{
                    if (!err){
                        if (doc.icon){
                            destroy(nameFromUri(doc.icon)).catch((result)=>{
                                console.log(result);
                            });
                        }

                        return res.status(200).send({"success": "coin deleted"});
                    }
                    else{
                        return res.status(400).send({"error": err});
                    }
                });
            } catch (err) {
                return res.status(400).send({"error": err});
            }
        } catch (err) {
            return res.status(400).send({"error": err});
        }
    },
}

function nameFromUri(myurl){
    var parsed = url.parse(myurl);
    var image = path.basename(parsed.pathname);
    return "images/"+path.parse(image).name
}

async function destroy(file) {
    await cloudinary.delete(file);
}