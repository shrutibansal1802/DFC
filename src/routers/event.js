const router = require('express').Router();
const authNgo = require('../middleware/authNgo');
const authDonor = require('../middleware/authdonor');
const Event = require('../models/event');
const Ngo = require('../models/ngo');
const moment = require('moment')

// Render create event
router.get('/newEvent', authNgo, (req, res)=>{
    res.render('newEvent', {
        ngo:req.ngo
    })
})

// Create an event
router.post('/events', authNgo, async (req, res)=>{
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
        if(!req.cookies.jwt && !req.cookies.jwt1){
            if(city){
                const eventsbycity = await Event.find({ city: city });
                res.render('citywise', {
                    events: eventsbycity,
                    donor: null,
                    ngo: null
                })
            }
            const events = await Event.find({});
            res.render('citywise', {
                events,
                donor: null,
                ngo: null
            });
        } else {
            if(req.cookies.jwt){
                if(city){
                    const eventsbycity = await Event.find({ city: city });
                    res.render('citywise', {
                        events: eventsbycity,
                        donor:"req.donor",
                        ngo: null
                    })
                }
                const events = await Event.find({});
                res.render('citywise', {
                    events,
                    donor:"req.donor",
                    ngo: null
            });
            } else {
                if(city){
                    const eventsbycity = await Event.find({ city: city });
                    res.render('citywise', {
                        events: eventsbycity,
                        donor:null,
                        ngo: "req.ngo"
                    })
                }
                const events = await Event.find({});
                res.render('citywise', {
                    events,
                    donor:null,
                    ngo: "req.ngo"
            });
            }
        }
    } catch (e) {
        res.status(400).render('404')
    }
});

// Render single events by query and all events
router.get('/sweetytoneedie/:id', async(req, res)=>{
    const _id = req.params.id;

    try {
        const event = await Event.findById(_id);
        await event.populate('owner').execPopulate()
        if(!event){
            return res.status(404).render('404')
        }
        
        res.render('sweetytoneedie', {
            ngo: null, 
            donor: null,
            event,
            moment
        });
    } catch (e) {
        res.status(400).send(e)
    }
});

// Ngo personalised events
router.get('/events/me', authNgo, async (req, res)=>{
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
        res.status(400).render('404')
    }
})

// Update event
router.patch('/events/:id', authNgo, async (req, res)=>{
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

// Delete event
router.delete('/events/:id', authNgo, async(req, res)=>{
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