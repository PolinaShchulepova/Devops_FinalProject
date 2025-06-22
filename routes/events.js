const express = require('express');
const router = express.Router();
const Event = require('../models/schema');


router.get('/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
         console.error("Error fetching events:", err);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

router.post('/events', async (req, res) => {
    const { title, date, time } = req.body;
    if (!title || !date || !time) {
        return res.status(400).json({ error: 'Missing title, date or time' });
    }

    try {
        const newEvent = new Event({ title, date, time });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
         console.error("Error saving event:", err);
        res.status(500).json({ error: 'Failed to save event' });
    }
});


module.exports = router;
