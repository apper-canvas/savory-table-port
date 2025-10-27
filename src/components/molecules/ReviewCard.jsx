import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import StarRating from "@/components/molecules/StarRating";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { reviewService } from "@/services/api/reviewService";
const ReviewCard = ({ review, isEditing, onEdit, onCancelEdit, onUpdate, onDelete }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editReviewerName, setEditReviewerName] = useState(review.reviewerName);
  const [editReviewText, setEditReviewText] = useState(review.reviewText);
  const [hoverRating, setHoverRating] = useState(0);

  const handleUpdate = async () => {
    if (editRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    if (!editReviewerName.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setLoading(true);
      const result = await reviewService.update(review.Id, {
        rating: editRating,
        reviewerName: editReviewerName.trim(),
        reviewText: editReviewText.trim()
      });

      if (result) {
        toast.success("Review updated successfully!");
        if (onUpdate) onUpdate();
      } else {
        toast.error("Failed to update review. Please try again.");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("An error occurred while updating your review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      setLoading(true);
      const success = await reviewService.delete(review.Id);

      if (success) {
        toast.success("Review deleted successfully!");
        if (onDelete) onDelete();
      } else {
        toast.error("Failed to delete review. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("An error occurred while deleting your review");
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Edit Review</h4>
        
        {/* Star Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating <span className="text-error">*</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setEditRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                disabled={loading}
                className="focus:outline-none transition-transform hover:scale-110 disabled:opacity-50"
              >
                <ApperIcon
                  name="Star"
                  className={`w-8 h-8 ${
                    star <= (hoverRating || editRating)
                      ? "text-accent fill-accent"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Reviewer Name */}
        <div className="mb-4">
          <Input
            label="Your Name"
            required
            value={editReviewerName}
            onChange={(e) => setEditReviewerName(e.target.value)}
            disabled={loading}
            placeholder="Enter your name"
            maxLength={100}
          />
        </div>

        {/* Review Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={editReviewText}
            onChange={(e) => setEditReviewText(e.target.value)}
            disabled={loading}
            placeholder="Share your experience..."
            rows={5}
            maxLength={1000}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 resize-none"
          />
          <p className="text-sm text-gray-500 mt-1 text-right">
            {editReviewText.length}/1000 characters
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={onCancelEdit}
            disabled={loading}
            className="flex-1"
          >
            <ApperIcon name="X" className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold mr-4"
            whileHover={{ scale: 1.1 }}
          >
            {review.reviewerName.charAt(0)}
          </motion.div>
          <div>
            <h4 className="font-semibold text-gray-900">{review.reviewerName}</h4>
            <p className="text-sm text-gray-500">
              {format(new Date(review.date), "MMMM d, yyyy")}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <StarRating rating={review.rating} />
          {review.verified && (
            <motion.div
              className="flex items-center text-success text-xs"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ApperIcon name="CheckCircle" className="w-4 h-4 mr-1" />
              Verified
            </motion.div>
          )}
          
          {isAuthenticated && (
            <div className="flex gap-2 ml-2">
              <button
                onClick={onEdit}
                disabled={loading}
                className="text-primary hover:text-accent transition-colors p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                title="Edit review"
              >
                <ApperIcon name="Pencil" className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="text-error hover:text-red-700 transition-colors p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                title="Delete review"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
    </Card>
  );
};

export default ReviewCard;