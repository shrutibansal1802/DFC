const router = require('express').Router();
const Ngo = require('../models/ngo');
const Event = require('../models/event')
const auth = require('../middleware/authNgo')

// signup
router.get('/needySignup', async (req, res)=>{
    res.render('needySignup')
})

// signup
router.post('/needySignup', async (req, res)=>{
    const ngo = new Ngo(req.body);

    try {
        await ngo.save();
        const token = await ngo.generateAuthToken();
        res.cookie('jwt1', token)
        res.send({ ngo, token });
    } catch (e) {
        res.status(400).json(e)
    }
});

// Login Page
router.get('/needysignin', (req, res)=>{
    res.render('needysignin')
})

//login
router.post('/ngos/login', async (req, res)=>{
    try {
        const ngo = await Ngo.findByCredential(req.body.email, req.body.password);
        const token = await ngo.generateAuthToken();
        res.cookie('jwt1', token)
        res.send({ ngo, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

// logout
router.post('/ngos/logout', auth, async (req, res)=>{
    try {
        req.ngo.tokens = req.ngo.tokens.filter((token)=>{
            return token.token !== req.token;
        })
        await req.ngo.save()
        res.send();
    } catch (e) {
        res.status(400).send();
    }
});

// ngo profile
// router.get('/ngos/me', auth, async (req, res)+>{

// })


// GET by city
router.get('/ngolist', async(req, res)=>{
    const city = req.query.city;

    try {
        if(city){
            const ngos = await Ngo.findOne({ city });
            res.render('ngolist', {ngos})
        }
        const ngos = await Ngo.find({});
        res.render('ngolist', {ngos});
    } catch (e) {
        res.status(400).send()
    }
});

// Home Page
router.get('/needy', auth, async (req, res)=>{
    const events = await Event.find({owner: req.ngo._id})
    res.render('needy', {
        ngo:req.ngo,
        events
    })
})

module.exports = router;