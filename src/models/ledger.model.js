const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Ledger must be associated with an accounnt"],
        index:true,//to make search faster on this field
        immutable:true  //once ledger is created, it cannot be changed
    },

    amount:{
        type:Number,
        required:[true,"Amount is required for creating a ledger"],
        immutable:true  //once ledger is created, it cannot be changed
    },

    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Transaction",
        required:[true,"Ledger must be associated with a transaction"],
        index:true, //to make search faster on this field
        immutable:true  //once ledger is created, it cannot be changed
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Type should be either CREDIT or DEBIT"
    },
        required:[true,"Type is required for creating a ledger"],
        immutable:true  //once ledger is created, it cannot be changed
    }
})

//this prevents ledger entries from being modified or deleted after they are created,
//  as they are immutable and should not be changed once created. 
// This is to ensure the integrity of the ledger and to prevent any fraudulent activities.
function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
}
//pre -- is mongoose middleware that is executed before the specified operation is performed on the document.
ledgerSchema.pre("findOneAndUpdate",preventLedgerModification);
ledgerSchema.pre("updateOne",preventLedgerModification);
ledgerSchema.pre("deleteOne",preventLedgerModification);
ledgerSchema.pre("remove",preventLedgerModification);
ledgerSchema.pre("deleteMany",preventLedgerModification);
ledgerSchema.pre("updateMany",preventLedgerModification);
ledgerSchema.pre("findOneAndDelete",preventLedgerModification);
ledgerSchema.pre("findOneAndReplace",preventLedgerModification);

const ledgerModel = mongoose.model("Ledger",ledgerSchema);

module.exports = ledgerModel;
