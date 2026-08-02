const accountModel = require("../models/account.model");

// Create a new account for the user

async function createAccountController(req,res){

    // request user from the model
    const user =req.user;
    // account created 
    const account=  await accountModel.create({
        user:user._id,
    })
     // status code 201 
    res.status(201).json({
        account
    })
    
}

async function getUserAccountController(req, res) {

    const accounts = await accountModel.find({ user: req.user._id });

    res.status(200).json({
        accounts
    })
}

async function getAccountBalanceController(req, res) {
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }

    const balance = await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}





module.exports = {
    createAccountController,
    getUserAccountController,
    getAccountBalanceController
   
}

