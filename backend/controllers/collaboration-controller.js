const CollaborationRequest = require("../models/collaborationRequest-schema");

module.exports.sendInvite = async (req, res) => {
  const { projectDetails, paymentOffer } = req.body;
  const requesterId = req.user._id; 
  const recipientId = req.params.recipientId

  const invite = new CollaborationRequest({
    requester: requesterId,
    recipient: recipientId,
    projectDetails,
    paymentOffer,
  });

  await invite.save();
  res.status(201).json({ message: 'Invitation sent successfully!' });
}
  
module.exports.acceptInvite =  async (req, res) => {
  const { inviteId } = req.params;
  const invite = await CollaborationRequest.findById(inviteId);

  if (invite) {
    invite.status = 'Accepted';
    await invite.save();
    res.json({ message: 'Invitation accepted!' });
  } else {
    res.status(404).json({ error: 'Invitation not found' });
  }
};

module.exports.declineInvite =  async (req, res) => {
  const { inviteId } = req.params;
  const invite = await CollaborationRequest.findById(inviteId);

  if (invite) {
    invite.status = 'Declined';
    await invite.save();
    res.json({ message: 'Invitation declined.' });
  } else {
    res.status(404).json({ error: 'Invitation not found' });
  }
};