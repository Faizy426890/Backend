import mongoose from 'mongoose'; 

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Email validation
  },
  review: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Add createdAt and updatedAt timestamps

const Review = mongoose.model('Review', reviewSchema);
export default Review;
