const mongoose = require('mongoose');
const bcrypt =require('bcryptjs');

// regex used for emial validation
// ^
// Start

// [\w.-]+
// Username (one or more letters, numbers, _, ., -)

// @

// ([\w-]+\.)+
// Domain name ending with a dot
// (gmail. or yahoo. or company. etc.)

// [\w-]{2,4}
// Top-level domain (2 to 4 characters)
// (com, org, net, in)

// $
// End

const userSchema  = new mongoose.Schema({
    email:{
        type:String,
        required:[true, "Email is reequired for creating a user "],
        trim:true,
        lowercase:true,
        unique:[true, "Email already exists"],
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"Please provide a valid email address"]
    },

    name:{
        type:String,
        required :[true,"Name is required for creating a user"],
        trim:true
    },

    password:{
        type:String,
        required:[true,"Password is required for creating an account"],
        minLength:[6,"password should have minimum of 6 characters"],
        select:false
    }

},

{
    timestamps:true
})
// hash the password before saving it to the database
userSchema.pre("save" , async function(next){

            if(!this.isModified("password")) {
                return next();

            }

        const hash= await bcrypt.hash(this.password,10);
        this.password=hash;
        return next();
     }
)

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}