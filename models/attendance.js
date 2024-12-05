const mongoose = require('mongoose');

// Define the Attendance schema
const attendanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  entryTime: {
    type: String,
    required: true, // Entry time is mandatory
  },
  exitTime: {
    type: String, // Exit time can be optional
    default: null,
  },
  purposeOfVisiting: {
    type: String,
    trim: true,
    default: 'General Visit', // Default purpose if not provided
  },
  date: {
    type: Date,
    default: Date.now, // Automatically store the date of the record
  },
});

module.exports = mongoose.model('Attendance', attendanceSchema);
