import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { reviewService } from "@/services/api/reviewService";

const ReviewForm = ({ onSuccess, onCancel }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }
    
    if (!reviewerName.trim()) {
      newErrors.reviewerName = "Name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.info("Please log in to submit a review");
      navigate("/login?redirect=/reviews");
      return;
    }
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const result = await reviewService.create({
        rating,
        reviewText: reviewText.trim(),
        reviewerName: reviewerName.trim()
      });

      if (result) {
        toast.success("Review submitted successfully!");
        // Reset form
        setRating(0);
        setReviewerName("");
        setReviewText("");
        setErrors({});
        // Call parent callback
        if (onSuccess) onSuccess();
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting your review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h3 className="text-2xl font-display font-bold text-secondary mb-6">
        Write Your Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating <span className="text-error">*</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <ApperIcon
                  name="Star"
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? "text-accent fill-accent"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-sm text-error mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Reviewer Name */}
        <Input
          label="Your Name"
          required
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          error={errors.reviewerName}
          disabled={loading}
          placeholder="Enter your name"
          maxLength={100}
        />

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            disabled={loading}
            placeholder="Share your experience at Savory Table..."
            rows={5}
            maxLength={1000}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 resize-none"
          />
          <p className="text-sm text-gray-500 mt-1 text-right">
            {reviewText.length}/1000 characters
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <ApperIcon name="Send" className="w-5 h-5 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ReviewForm;