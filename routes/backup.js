router.post('/login',async(req,res,next)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Student.findOne({email:email});
        if(useremail.password === password){
            Student.find({}).exec(function(err, data){
                if(err)throw err;
                res.redirect('/home');     
            })
        }else{
            res.send('invalid login password');
        }
    }catch{
        res.send('invalid login detail')
    }
})

//get register    
router.get('/register',(req,res)=>{
    Student.find({}).exec(function(err, data){
        if(err)throw err;
        res.render('register',{ title : 'student data',records : data});
    })
    })

//post register
router.post('/register',upload,function(req,res,next){
    bcrypt.hash(req.body.password,10,(err,hash)=>{
    const student = new Student({
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        password : hash,
        gender : req.body.gender,
        hobbies : req.body.hobbies,
        file : req.file.filename,
    })
    student.save(function(err,req1){
        if(err)throw err;
        Student.find({}).exec(function(err, data){
            if(err)throw err;
            req.flash('success_message','registration successfully.....');
            res.redirect('/home');     
        })
    })
})
})

//get login
router.get('/login',function(req,res,next){
    Student.find({}).exec(function(err, data){
        if(err)throw err;
        res.render('login',{title : 'studnet data',records : data});     
    })
})

//post login
router.post('/login',async(req,res,next)=>{
        const email = req.body.email;
        const password = req.body.password;
        const user = await Student.findOne({email:email});
        if(user){
            const validPassword = await bcrypt.compare(password,user.password)
            if(validPassword){
                Student.find({}).exec(function(err, data){
                    if(err)throw err;
                    res.redirect('/home'); 
            })
        }else{
            res.send('invalid login password');
        }
        }else{
            res.send('invalid login detail')
        }  
})

exports.postRegister = function (req, res, next) {
    var { name, email,phone, password,cpassword, gender, hobbies } = req.body;
    var err;
    if (!name || !email || !phone || !password || ! cpassword || !gender || !hobbies) {
        err = 'plz fill all the fields'
        res.render('register', { err: err });
    }
    if(!(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/).test(String(email))){
        err = 'plz fill valid email'
        res.render('register',{ err : err});
    }
    if(!(/^(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{6,16}$/).test(String(password))){
        err = 'plz fill valid password'
        res.render('register',{ err : err});
    }
    if(password != cpassword){
        err = 'passworrd dont match'
        res.render('register',{err : err})
    }
    
    if (typeof err == 'undefined') {
        Student.findOne({ email: email }, function (err, data) {
            if (err) throw err;
            if (data) {
                console.log('user exist');
                err = "user already exist this email..."
                res.render('register', { err: err });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    const student = new Student({
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone,
                        password: hash,
                        gender: req.body.gender,
                        hobbies: req.body.hobbies,
                        department : req.body.department,
                        file: req.file.filename,
                    })
                    student.save(function (err, req1) {
                        if (err) throw err;
                        Student.find({}).exec(function (err, data) {
                            if (err) throw err;
                            req.flash('success_message', 'registration successfully.....');
                            res.redirect('/home');
                        })
                    })
                })
            }
        })
    }
}