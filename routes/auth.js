const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation} = require('../validation');

router.post('/register', async (req, res) => {
    //REGISTER info Validation
    const check = registerValidation(req.body);
    if (check) return res.status(400).send(check.details[0].message);

    //UNIQUE email check
    const emailExists = await User.findOne({email: req.body.email});
    if (emailExists) return res.status(400).send('Email already exists!');
    
    const user = new User ({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    
    try {
        const saveUser = await user.save();
        res.send(saveUser);
    } catch(err){
        res.status(400).send(err);
    }
})

module.exports = router;
