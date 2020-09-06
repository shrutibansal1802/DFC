const router = require('express').Router();
const Donor = require('../models/donor');
const auth = require('../middleware/authDonor');


// signup page
router.get('/sweetySignup', async(req, res)=>{
    res.render('sweetySignup');
});

// signup
router.post('/sweetySignup', async (req, res)=>{
    const donor = new Donor(req.body);
    try {
        await donor.save();
        const token = await donor.generateAuthToken()
        res.cookie('jwt', token)
        res.send({ donor, token});
    } catch (e) {
        res.status(400).json(e)
    }
});

//Signin route
router.get('/', async(req, res)=>{
    res.render('index');
});

// signin
router.post('/sweetySignin', async (req, res)=>{
    try {
        const donor = await Donor.findByCredentials(req.body.email, req.body.password);
        const token = await donor.generateAuthToken();
        res.cookie('jwt', token)
        res.json({donor, token})
    } catch (e) {
        res.status(400).json(e)
    }
});

// logout
router.post('/donors/logout', auth, async(req, res)=>{
    try {
        req.donor.tokens = req.donor.tokens.filter(token=>{
            return token.token !== req.token
        });
        await req.donor.save();

        res.redirect('/');
    } catch (e) {
        res.status(400).send();
    }
})

// donor profile
router.get('/sweety', auth, async (req, res)=>{
    try {
        const donor = req.donor;
        res.render('sweety', {
            donor
        });
    } catch (e) {
        res.status(400).send();
    }
});

router.get('/profile', auth, (req, res)=>{
    res.render('profile', {
        donor: req.donor
    })
})

// donor profile update
router.patch('/donors/:id', async (req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'contact', 'hobbies', 'profession'];
    const isValidUpdate = updates.every((update)=>{
        return allowedUpdates.includes(update);
    });
    if(!isValidUpdate){
        return res.status(400).send({error:'Invalid Updates!'})
    }
    try {
        const donor = await Donor.findById(req.params.id);
        updates.forEach(update=>{
            return donor[update]=req.body[update]
        });
        await donor.save();

        if(!donor){
            return res.status(400).send();
        }
        res.send(donor);
    } catch (e) {
        res.status(400).send()
    }
});


router.delete('/donors/me', auth, async (req, res)=>{
    try {
        // const donor = await Donor.findByIdAndDelete(req.user._id);

        // if(!donor){
        //     return res.status(404).send();
        // }

        await req.donor.remove()
        res.send(req.donor);
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router;