var mongoose=require("mongoose");
var passport=require("passport");
var local=require("passport-local-mongoose");
var Schema=mongoose.Schema;
var UserSchema= new Schema({
    username:String,
    Email:String,
    Usertype:{
       type:String,
       default:"person"
    },
    theatre_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Theatre"
    }]
});
UserSchema.plugin(local);
var User=mongoose.model("user",UserSchema);
module.exports=User;