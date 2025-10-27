import { getApperClient } from "@/services/apperClient";

export const reviewService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("review_c", {
        fields: [
          { field: { Name: "rating_c" } },
          { field: { Name: "review_text_c" } },
          { field: { Name: "reviewer_name_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "verified_c" } }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(review => ({
        Id: review.Id,
        rating: review.rating_c,
        reviewText: review.review_text_c,
        reviewerName: review.reviewer_name_c,
        date: review.date_c,
        verified: review.verified_c
      }));
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById("review_c", id, {
        fields: [
          { field: { Name: "rating_c" } },
          { field: { Name: "review_text_c" } },
          { field: { Name: "reviewer_name_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "verified_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const review = response.data;
      return review ? {
        Id: review.Id,
        rating: review.rating_c,
        reviewText: review.review_text_c,
        reviewerName: review.reviewer_name_c,
        date: review.date_c,
        verified: review.verified_c
      } : null;
    } catch (error) {
      console.error(`Error fetching review ${id}:`, error);
      return null;
    }
  },

  async create(reviewData) {
    try {
      const apperClient = getApperClient();
      const today = new Date().toISOString().split('T')[0];
      
      const response = await apperClient.createRecord("review_c", {
        records: [
          {
            rating_c: reviewData.rating,
            review_text_c: reviewData.reviewText,
            reviewer_name_c: reviewData.reviewerName,
            date_c: today,
            verified_c: false
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const created = response.results[0];
        if (created.success) {
          const data = created.data;
          return {
            Id: data.Id,
            rating: data.rating_c,
            reviewText: data.review_text_c,
            reviewerName: data.reviewer_name_c,
            date: data.date_c,
            verified: data.verified_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating review:", error);
      return null;
    }
  },

  async getSortedByRating(ascending = false) {
    const reviews = await this.getAll();
    return reviews.sort((a, b) => 
      ascending ? a.rating - b.rating : b.rating - a.rating
    );
  },

  async getAverageRating() {
    const reviews = await this.getAll();
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  },

  async getRatingDistribution() {
    const reviews = await this.getAll();
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  }
};