const router = require('express').Router();
const auth = require('../middleware/authNgo');
const Event = require('../models/event');

// Create an event
router.post('/events', auth, async (req, res)=>{
    const event = new Event({
        ...req.body,
        owner: req.ngo._id
    });

    try {
        await event.save();
        res.status(201).send(event)
    } catch (e) {
        res.status(400).send(e)
    }
});

// GET/city=Kota
router.get('/events', async(req, res)=>{
    const city = req.query.city;

    try {
        if(city){
            const eventsbycity = await Event.findOne({ city });
            res.send(eventsbycity)
        }
        const events = await Event.find({});
        res.send(events);
    } catch (e) {
        res.status(400).send()
    }
});

//single events by query and all events
router.get('/events/:id', async(req, res)=>{
    const _id = req.params.id;

    try {
        const event = await Event.findById(_id);
        if(!event){
            return res.status(404).send()
        }
        res.send(event);
    } catch (e) {
        res.status(400).send()
    }
});

// Ngo personalised events
router.get('/events/me', auth, async (req, res)=>{
    const sort= {};
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split('_');
        sort[parts[0]] = parts[1] === 'desc'? -1:1;
    }

    try {
        await req.ngo.populate({
            path: 'events',
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.ngo.events)
    } catch (e) {
        res.status(400).send()
    }
})

router.patch('/events/:id', auth, async (req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'volunteersRequired','category', 'otherRequirements', 'city', 'address', 'description'];
    const isValidUpdate = updates.every(update=>{
        return allowedUpdates.includes(update)
    });
    if(!isValidUpdate){
        return res.status(400).send({error:'Not a valid update'});
    }
    try {
        const event = await Event.findOne({ _id: req.params.id, owner: req.ngo._id });
        

        if(!event){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            return event[update] = req.body[update]
        });
        await event.save()

        res.send(event)
    } catch (e) {
        res.status(500).send()
    }
});

router.delete('/events/:id', auth, async(req, res)=>{
    try {
        const event = await Event.findOne({ _id: req.params.id, owner: req.ngo._id });

        if(!event){
            return res.status(404).send()
        }
        res.send(event);
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router;