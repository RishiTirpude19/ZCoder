const mongoose = require("mongoose");


const collaborationRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectDetails: String,
  paymentOffer: Number,
  status: { type: String, enum: ['Pending', 'Accepted', 'Declined'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
}, { timestamps: true });

const CollaborationRequest = mongoose.model('CollaborationRequest', collaborationRequestSchema);
module.exports = CollaborationRequest;