const router = require('express').Router();
const Donor = require('../models/donor');
const auth = require('../middleware/auth');

router.post('/donors', async (req, res)=>{
    const donor = new Donor(req.body);
    try {
        await donor.save();
        const token = await donor.generateAuthToken()
        res.send({ donor: donor.getPublicProfile(), token});
    } catch (e) {
        res.status(400).send(e)
    }
});

router.post('/donors/login', async (req, res)=>{
    try {
        const donor = await Donor.findByCredentials(req.body.email, req.body.password);
        const token = await donor.generateAuthToken();
        res.send({donor: donor.getPublicProfile(), token})
    } catch (e) {
        res.status(400).send()
    }
});

router.post('/donors/logout', auth, async(req, res)=>{
    try {
        req.donor.tokens = req.donor.tokens.filter(token=>{
            return token.token !== req.token
        });
        await req.donor.save();

        res.send();
    } catch (e) {
        res.status(400).send();
    }
})

router.get('/donors/me', auth, async (req, res)=>{
    try {
        res.send(req.donor);
    } catch (e) {
        res.status(400).send();
    }
});

router.get('/donors/:id', async (req, res)=>{
    const _id = req.params.id;

    try {
        const donor = await Donor.findById(_id);

        if(!donor){
            return res.status(404).send();
        }
        res.send(donor);
    } catch (e) {
        res.status(400).send();
    }
});

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

router.delete('/donors/:id', async (req, res)=>{
    try {
        const donor = await Donor.findByIdAndDelete(req.params.id);

        if(!donor){
            return res.status(404).send();
        }
        res.send(donor);
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router;