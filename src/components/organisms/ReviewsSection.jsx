import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { reviewService } from "@/services/api/reviewService";
import ReviewCard from "@/components/molecules/ReviewCard";
import ReviewForm from "@/components/molecules/ReviewForm";
import StarRating from "@/components/molecules/StarRating";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";

const ReviewsSection = () => {
const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadReviewsData();
  }, []);

const loadReviewsData = async () => {
    try {
      setLoading(true);
      setError("");
      const [allReviews, avgRating] = await Promise.all([
        reviewService.getAll(),
        reviewService.getAverageRating()
      ]);
      // Get first 3 reviews for preview
      setReviews(allReviews.slice(0, 3));
      setAverageRating(avgRating);
    } catch (err) {
      setError("Failed to load customer reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = () => {
    setShowReviewForm(false);
    loadReviewsData();
  };
if (loading) return <Loading type="reviews" />;
  if (error) return <Error message={error} onRetry={loadReviewsData} />;

return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-display font-bold text-secondary mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What Our Guests Say
          </motion.h2>
          
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <StarRating rating={Math.floor(averageRating)} size="w-6 h-6" />
            <span className="text-xl font-semibold text-gray-900">
              {averageRating} out of 5
            </span>
            <span className="text-gray-600">
              ({reviews.length}+ reviews)
            </span>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {reviews.map((review, index) => (
            <motion.div
              key={review.Id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              viewport={{ once: true }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button 
            size="lg" 
            variant="primary" 
            className="px-8 py-4"
            onClick={() => setShowReviewForm(true)}
          >
            <ApperIcon name="PenSquare" className="w-5 h-5 mr-2" />
            Write a Review
          </Button>
          <Link to="/reviews">
            <Button size="lg" variant="secondary" className="px-8 py-4">
              <ApperIcon name="MessageCircle" className="w-5 h-5 mr-2" />
              Read All Reviews
            </Button>
          </Link>
        </motion.div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReviewForm(false)}
          >
            <motion.div
              className="max-w-2xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ReviewForm
                onSuccess={handleReviewSubmit}
                onCancel={() => setShowReviewForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
</div>
    </section>
  );
};

export default ReviewsSection;