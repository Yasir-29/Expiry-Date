const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    barcode: {
        type: String,
        trim: true,
        index: true
    },
    expiryDate: {
        type: Date,
        required: [true, 'Expiry date is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Food', 'Medicine', 'Document', 'Other'],
        default: 'Other'
    },
    priority: {
        type: String,
        required: [true, 'Priority is required'],
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for days until expiry
reminderSchema.virtual('daysUntilExpiry').get(function() {
    const today = new Date();
    const expiryDate = new Date(this.expiryDate);
    const diffTime = expiryDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for expiry status
reminderSchema.virtual('status').get(function() {
    const daysUntil = this.daysUntilExpiry;
    if (daysUntil < 0) return 'expired';
    if (daysUntil <= 3) return 'critical';
    if (daysUntil <= 7) return 'warning';
    return 'safe';
});

// Pre-save middleware to ensure expiryDate is set to end of day
reminderSchema.pre('save', function(next) {
    if (this.expiryDate) {
        const date = new Date(this.expiryDate);
        date.setHours(23, 59, 59, 999);
        this.expiryDate = date;
    }
    next();
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder; 