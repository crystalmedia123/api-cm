const WalletModel = require("./wallet.model");

module.exports = {
    async getSingleWallet(req,res){
        try {
            WalletModel.findOne(({_id:req.params.id}),(err,doc)=>{
                if(!err){
                    if(!doc)
                        return res.status(404).send({"error":'MyWallet not found'});

                    return res.status(200).send(doc);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            }).populate('owner', '_id name photo phonenumber email').populate('coin', '_id name abbr icon');
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async getMyWallet(req,res){
        try {
            WalletModel.findOne(({owner:req.params.owner}),(err,doc)=>{
                if(!err){
                    if(!doc)
                        return res.status(404).send({"error":'MyWallet not found'});

                    return res.status(200).send(doc);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            }).populate('owner', '_id name photo phonenumber email').populate('coin', '_id name abbr icon');
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async getAllWallets(req,res){
        try {
            WalletModel.find((err,docs)=>{
                if(!err){
                    return res.status(200).send(docs);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            }).populate('owner', '_id name photo phonenumber email').populate('coin', '_id name abbr icon');
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async findAllWalletsPaginate(req,res){
        try {
            const {page,perPage,sort,level} = req.query;
            const  options = {
                page: parseInt(page,10) || 1,
                limit: parseInt(perPage,10) || 10,
                sort: {date: -1}
            }
            
            await WalletModel.paginate({},options,(err, docs)=>{
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
}