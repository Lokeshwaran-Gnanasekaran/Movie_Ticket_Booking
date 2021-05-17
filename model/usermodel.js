var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var UserSchema= new Schema({
    username:String,
    Email:String,
    Usertype:{
       type:String,
       default:"person"
    }
});
var User=mongoose.model("user",UserSchema);
module.exports=User;