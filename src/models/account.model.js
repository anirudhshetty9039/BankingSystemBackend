const mongoose = require("mongoose");
const { applyTimestamps } = require("./user.model");
const ledgerModel = require("./ledger.model");

const accountSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:[true,"User is required for creating an account"],
            index:true  //to make search faster on this field
            // this index is mongodb feature and b+tree is used in the index part of mongodb to make search faster on this field
        },

        status:{
            type:String,
            enum:{
             values:["Active","Frozen" , "Closed"],
            message:"Status should be either Active , Frozen or Closed"
            },
            default:"ACTIVE",
            
        },
        currency:{
            type:String,
            required:[true,"Currency is required for creating an account"],
            default:"INR"   
        },
    },
    {
        timestamps:true
    }
    )

    accountSchema.index({user:1,status:1});


// aggregate function to get the balance of the account from the ledger collection and
    accountSchema.methods.getBalance = async function(){
      const balanceData = await ledgerModel.aggregate([
        {$match:{account:this._id}},
        {
            $group:{
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type", "DEBIT"]},
                            "$amount",
                            0
                    ]
                    }
                },
                totalCredit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type", "CREDIT"]},
                            "$amount",
                            0   
                        ]
                    }
                },
            },
            $project:{
                    _id:0,
                    balance:{$subtract:["$totalCredit","$totalDebit"]}
                }   
        }

      ])
      return balanceData[0]?.balance || 0;
    }
     
    const accountModel = mongoose.model("Account",accountSchema);
    module.exports = accountModel;
    