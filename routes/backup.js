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

