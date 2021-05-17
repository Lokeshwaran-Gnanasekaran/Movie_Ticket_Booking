var express=require("express"),
    app=express(),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose"),
    flash=require("connect-flash"),
    passport=require("passport"),
    localstrategy=require("passport-local");



const User = require("./model/usermodel");




app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(flash());
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    
    next();
})


mongoose.connect("mongodb://localhost/Movie",{useUnifiedTopology:true,useNewUrlParser: true});

app.listen(3000,function(){
    console.log("Movie-Ticket-Booking");
})

app.get("/" ,function(req,res){
    res.render("home");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    var newUser = new User({username:req.body.username,Email:req.body.email,Usertype:"person"});
    User.register(newUser,req.body.password,function(err,user){
         if(err){
             return res.redirect("/register");
         }
         passport.authenticate("local")(req,res,function(){
             res.redirect("/");
         })
    })
})

app.get("/theatreregister",function(req,res){
    res.render("register");
})

app.post("/theatreregister",function(req,res){
    var newUser = new User({username:req.body.username,Email:req.body.email,Usertype:"theatre"});
    User.register(newUser,req.body.password,function(err,user){
         if(err){
             return res.redirect("/register");
         }
         passport.authenticate("local")(req,res,function(){
             res.redirect("/");
         })
    })
})
