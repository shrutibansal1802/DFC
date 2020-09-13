const router = require('express').Router();
const Ngo = require('../models/ngo');
const Event = require('../models/event')
const auth = require('../middleware/authNgo')

// Render signup
router.get('/needySignup', async (req, res)=>{
    res.render('needySignup', {
        ngo: req.ngo,
        donor: req.donor
    })
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

// Render Login Page
router.get('/needysignin', (req, res)=>{
    res.render('needysignin', {
        ngo: req.ngo,
        donor: null
    })
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
router.get('/ngo/logout', auth, async (req, res)=>{
    try {
        req.ngo.tokens = req.ngo.tokens.filter((token)=>{
            return token.token !== req.token;
        })
        await req.ngo.save()
        res.cookie('jwt1', '', {maxAge:1})
        res.redirect('/needySignin');
    } catch (e) {
        res.status(400).send();
    }
});

// ngo profile
// router.get('/ngos/me', auth, async (req, res)+>{

// })


// GET by city
router.get('/ngos', async(req, res)=>{
    const city = req.query.city;

    try {
        if(city){
            const ngos = await Ngo.find({ city });
            res.render('ngolist', {
                ngos,
                ngo: req.ngo,
                donor: null
            })
        }
        const ngos = await Ngo.find({});
        res.render('ngolist', {
            ngos,
            ngo: req.ngo,
            donor: null
        });
    } catch (e) {
        res.status(400).send()
    }
});

// Render Home Page
router.get('/needy', auth, async (req, res)=>{
    const events = await Event.find({owner: req.ngo._id})
    res.render('needy', {
        ngo:req.ngo,
        events,
        donor: null
    })
})

module.exports = router;