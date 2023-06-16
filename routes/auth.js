const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation} = require('../validation');

router.post('/register', async (req, res) => {
    const check = registerValidation(req.body);
    if (check) return res.status(400).send(check.details[0].message);

    const emailExists = await User.findOne({email: req.body.email});
    if (emailExists) return res.status(400).send('Email already exists!');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    const user = new User ({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    
    try {
        const saveUser = await user.save();
        res.send({user: user._id});
    } catch(err){
        res.status(400).send(err);
    }
})


router.post('/login', async (req, res) => {

    const check = loginValidation(req.body);
    if (check) return res.status(400).send(check.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email does not exist!');

    const passCheck = await bcrypt.compare(req.body.password, user.password);
    if (!passCheck) return res.status(400).send('Invalid password!');

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
})

module.exports = router;
