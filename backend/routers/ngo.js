const router = require('express').Router();
const Ngo = require('../models/ngo');
const auth = require('../middleware/authNgo')

// signup
router.post('/ngos', async (req, res)=>{
    const ngo = new Ngo(req.body);

    try {
        await ngo.save();
        const token = await ngo.generateAuthToken();
        res.send({ ngo, token });
    } catch (e) {
        res.status(400).send(e)
    }
});

//login
router.post('/ngos/login', async (req, res)=>{
    try {
        const ngo = await Ngo.findByCredential(req.body.email, req.body.password);
        const token = await ngo.generateAuthToken();
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

module.exports = router;