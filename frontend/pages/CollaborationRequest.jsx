import React from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
function CollaborationRequest() {
  const requesterId = useSelector((state) => state.user.user._id);
  const {recipientId} = useParams().
  return (
    <div>
      <label htmlFor='projectdetails'><strong>Project Details:</strong></label>
      <textarea name="projectdetails" id="projectdetails" cols={10} rows={5}></textarea>
    </div>
  )
}

export default CollaborationRequest
