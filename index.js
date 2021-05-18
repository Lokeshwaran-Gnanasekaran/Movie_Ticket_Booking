var express=require("express"),
    app=express(),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose"),
    flash=require("connect-flash"),
    passport=require("passport"),
    LocalStrategy=require("passport-local"),
    session=require("express-session");



var User = require("./model/usermodel"),
    City=require("./model/Cites"),
    Movie=require("./model/Movie"),
    Theatre=require("./model/Theatre");




app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.use(session({
    secret:"lokesh",
    resave:false,
    saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
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
             res.redirect("/user");
         })
    })
})


app.get("/theatreregister",function(req,res){
    res.render("theatreregister");
})

app.post("/theatreregister",async function(req,res){
    var user=new User({username:req.body.username,Email:req.body.email,Usertype:"theatre"});
   await User.register(user,req.body.password,function(err,user){
             if(err){
               return res.redirect("/theatreregister");  
             }
             passport.authenticate("local")(req,res,function(){
                   res.redirect("/user");
             });
    })
    
})

app.get("/login",function(req,res){
    res.render("login");
})
app.post("/login",passport.authenticate("local",{
    successRedirect:"/user",
    failureRedirect:"/login"
}),function(req,res){

});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})


app.get("/user",function(req,res){
    console.log(req.user);
    if(req.user.Usertype==="person"){
        res.redirect("/city");
    }
    else if(req.user.Usertype==="theatre"){
        res.redirect("/theatre_reg")
    }
})


app.get("/city",function(req,res){
    City.find({},function(err,city){
        if(err){
            console.log("error");
        }
        else{
            res.render("city",{city:city});
        }
    })
})

app.get("/city/movies/:city",function(req,res){
    Movie.find({},function(err,movie){
        if(err){
            console.log("err");
        }
        else{
            res.render("movie",{movies:movie,city:req.params.city});
        }
    })
})
app.get("/city/movies/:city/theatre",function(req,res){
    Theatre.find({city:req.params.city},function(err,theatre){
        if(err){
            console.log("error");
            
        }
        else{
            res.render("theatre",{theatres:theatre,city:req.params.city});
        }
    })
})

app.get("/city/movies/:city/theatre/book/:id",function(req,res){
    Theatre.findById(req.params.id,function(err,theatre){
        if(err){
            console.log("error");
        }
        else{
            res.render("book",{theatre:theatre});
        }
    })
})
app.post("/city/movies/theatre/book/:id",function(req,res){
    var seats=req.body.seats;
    Theatre.findById(req.params.id,function(err,t){
         if(err){
             console.log("error");
         }
         else{
             var no=t.avail_seats-seats;
             Theatre.findByIdAndUpdate(req.params.id,{avail_seats:no},function(err,update){
                 if(err){
                     console.log("error");
                 }
                 else{
                     // nodemailer
                 }
             }
             )
             res.redirect("/");
            }
    })
    
})
app.get("/theatre_reg",function(req,res){
    var arr=[];
    User.findById(req.user._id,function(err,user){
        if(err){
            console.log("error");
        }
        else{
           Theatre.find({},async function(err,t){
               
            await t.forEach(element => {
                
                if((user.theatre_id).includes(element._id)){
                    arr.push(element);
                }
            })
            console.log(arr);
           await res.render("theatre_reg",{arr:arr});

           })
        }
    
        
    })
    
})
app.get("/theatre_reg/new",function(req,res){
    res.render("new_theatre");
})
app.post("/theatre_reg/new",function(req,res){
    var theatre=new Theatre({name:req.body.name,desc:req.body.desc,no_seats:req.body.seats,avail_seats:req.body.seats,img:req.body.img_t,city:req.body.city});
    var id;
    Theatre.create(theatre,function(err,t){
        Movie.findOne({name:req.body.name_m},function(err,movies){
            if(movies==null){
                Movie.create({name:req.body.name_m,img:req.body.img_m,genre:req.body.genre,theatre_id:[t._id]},function(err,m){
                    id=m._id;
                });
            }
            else{
                movies.theatre_id.push(t._id);
                movies.save();
                id=movies._id;
            }
            City.findOne({name:req.body.city},function(err,city){
                if(city==null){
                    City.create({name:req.body.city,movie_id:[id]},function(err,city){});
                }
                else{
                     city.movie_id.push(id);
                     city.save();
                }
                User.findById(req.user._id,function(err,user){
                    user.theatre_id.push(t._id);
                    user.save();
                })
                res.redirect("/theatre_reg");
            })
        })
       
    })
    
})
