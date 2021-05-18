var mongoose=require("mongoose");
var schema=mongoose.Schema;
var TheatreSchema=new schema({
    name:String,
    img:String,
    no_seats:Number,
    avail_seats:Number,
    city:String,
    desc:String
});
var Theatre=mongoose.model("theatre",TheatreSchema);
module.exports=Theatre;