const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// Get all reminders
router.get('/', async (req, res) => {
    try {
        const { category, status } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (status === 'active') {
            query.isCompleted = false;
        } else if (status === 'completed') {
            query.isCompleted = true;
        }

        const reminders = await Reminder.find(query).sort({ expiryDate: 1 });
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get upcoming reminders (within 7 days)
router.get('/upcoming', async (req, res) => {
    try {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        const reminders = await Reminder.find({
            expiryDate: { $gte: today, $lte: nextWeek },
            isCompleted: false
        }).sort({ expiryDate: 1 });

        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new reminder
router.post('/', async (req, res) => {
    try {
        const reminder = new Reminder({
            title: req.body.title,
            description: req.body.description,
            expiryDate: req.body.expiryDate,
            category: req.body.category,
            priority: req.body.priority
        });

        const newReminder = await reminder.save();
        res.status(201).json(newReminder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a reminder
router.patch('/:id', async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);
        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        Object.keys(req.body).forEach(key => {
            if (key in reminder) {
                reminder[key] = req.body[key];
            }
        });

        const updatedReminder = await reminder.save();
        res.json(updatedReminder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a reminder
router.delete('/:id', async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);
        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }
        await reminder.remove();
        res.json({ message: 'Reminder deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 