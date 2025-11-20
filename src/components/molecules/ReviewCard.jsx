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
  const [editTitle, setEditTitle] = useState(review.title || "");
  const [editRating, setEditRating] = useState(review.rating);
  const [editReviewerName, setEditReviewerName] = useState(review.reviewerName);
  const [editReviewText, setEditReviewText] = useState(review.reviewText);
  const [editPros, setEditPros] = useState(review.pros || "");
  const [editCons, setEditCons] = useState(review.cons || "");
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [userVote, setUserVote] = useState(review.voteOption || "");
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
title: editTitle.trim(),
        rating: editRating,
        reviewerName: editReviewerName.trim(),
        reviewText: editReviewText.trim(),
        pros: editPros.trim(),
        cons: editCons.trim()
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
        
        {/* Title */}
        <div className="mb-4">
          <Input
            label="Review Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={loading}
            placeholder="Enter review title..."
            maxLength={200}
          />
        </div>
        
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
            rows={4}
            maxLength={1000}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 resize-none"
          />
          <p className="text-sm text-gray-500 mt-1 text-right">
            {editReviewText.length}/1000 characters
          </p>
        </div>

        {/* Pros */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What did you like? (Pros)
          </label>
          <textarea
            value={editPros}
            onChange={(e) => setEditPros(e.target.value)}
            disabled={loading}
            placeholder="What were the highlights..."
            rows={3}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 resize-none"
          />
        </div>

        {/* Cons */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Areas for improvement (Cons)
          </label>
          <textarea
            value={editCons}
            onChange={(e) => setEditCons(e.target.value)}
            disabled={loading}
            placeholder="What could be better..."
            rows={3}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 resize-none"
          />
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
              {review.updatedDate && review.updatedDate !== review.creationDate && (
                <span className="ml-2 text-xs text-gray-400">
                  (Updated: {format(new Date(review.updatedDate), "MMM d, yyyy")})
                </span>
              )}
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
      
{review.title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{review.title}</h3>
      )}
      
      <p className="text-gray-700 leading-relaxed mb-4">{review.reviewText}</p>
      
      {review.pros && (
        <div className="mb-3">
          <h5 className="font-medium text-green-700 mb-1 flex items-center">
            <ApperIcon name="ThumbsUp" className="w-4 h-4 mr-1" />
            Pros
          </h5>
          <p className="text-gray-600 text-sm pl-5">{review.pros}</p>
        </div>
      )}
      
      {review.cons && (
        <div className="mb-4">
          <h5 className="font-medium text-red-700 mb-1 flex items-center">
            <ApperIcon name="ThumbsDown" className="w-4 h-4 mr-1" />
            Cons
          </h5>
          <p className="text-gray-600 text-sm pl-5">{review.cons}</p>
        </div>
      )}

      {/* Vote Section */}
      <div className="flex items-center gap-4 mb-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUserVote(userVote === "Upvote" ? "" : "Upvote")}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
              userVote === "Upvote" 
                ? "bg-green-100 text-green-700" 
                : "bg-gray-100 text-gray-600 hover:bg-green-50"
            }`}
          >
            <ApperIcon name="ThumbsUp" className="w-4 h-4" />
            Helpful
          </button>
          <button
            onClick={() => setUserVote(userVote === "Downvote" ? "" : "Downvote")}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
              userVote === "Downvote" 
                ? "bg-red-100 text-red-700" 
                : "bg-gray-100 text-gray-600 hover:bg-red-50"
            }`}
          >
            <ApperIcon name="ThumbsDown" className="w-4 h-4" />
            Not Helpful
          </button>
        </div>
        
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-blue-50 transition-colors"
        >
          <ApperIcon name="MessageCircle" className="w-4 h-4" />
          Reply
        </button>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          />
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm"
              onClick={() => {
                // Handle reply submission here
                console.log("Reply submitted:", replyText);
                setReplyText("");
                setShowReplyForm(false);
              }}
            >
              Submit Reply
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowReplyForm(false);
                setReplyText("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Existing Reply Display */}
      {review.reply && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-200">
          <h6 className="font-medium text-blue-900 mb-2 flex items-center">
            <ApperIcon name="MessageSquare" className="w-4 h-4 mr-1" />
            Restaurant Reply
          </h6>
          <p className="text-blue-800 text-sm">{review.reply}</p>
        </div>
      )}
    </Card>
  );
};

export default ReviewCard;