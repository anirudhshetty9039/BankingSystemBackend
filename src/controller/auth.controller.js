const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

/*User Registration Controller*/

async function userRegisterController(req, res) {
    const {email, name,password} = req.body;
    const isExists = await userModel.findOne({email});
    if(isExists)
    {
        return res.status(422).json({
            message:"User already exists with this email",
            status:"failed"
        })
    }
const user  = await userModel.create(
    {email, name, password}
)

const token =  jwt.sign({userId: user._id}, process.env.JWT_SECRET,
    { expiresIn:"3d"}
)

res.cookie("token",token )
res.status(201).json({
    user:{
        _id:user._id,
        email:user.email,
        name:user.name  
    },
    token
})
}


/*User Login Controller*/

async function userLoginController(req,res){
    const {email ,password} = req.body;
    // here passwor is specified as select:false in the user model so we need to explicitly select it here...
    const user = await userModel.findOne({email}).select("+password");
    if(!user)
    {
        return res.status(401).json({
            message:"Email or password is invalid",
            status:"failed"
        })
    }

   const isValidPassword= await  user.comparePassword(password);
   if(!isValidPassword)
   {
          return res.status(401).json({
            message:"Email or password is invalid",
            status:"failed"
        })
   }

   const token =  jwt.sign({userId: user._id}, process.env.JWT_SECRET,
    { expiresIn:"3d"}
)

        res.cookie("token",token )
        res.status(200).json({
            user:{
                _id:user._id,
                email:user.email,
                name:user.name  
            },
            token
        })

}

module.exports={
    userRegisterController,
    userLoginController
}
