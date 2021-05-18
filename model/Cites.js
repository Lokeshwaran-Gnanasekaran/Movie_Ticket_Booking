var mongoose=require("mongoose");
var schema=mongoose.Schema;
var CitySchema=new schema({
    name:String,
    movie_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Movie"
    }]
})
var City=mongoose.model("city",CitySchema);
module.exports=City;