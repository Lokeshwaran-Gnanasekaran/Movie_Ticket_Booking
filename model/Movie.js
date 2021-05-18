var mongoose=require("mongoose");
var schema=mongoose.Schema;
var MovieSchema=new schema({
    name:String,
    genre:String,
    img:String,
    theatre_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Theatre"
    }]
})
var Movie=mongoose.model("movie",MovieSchema);
module.exports=Movie;