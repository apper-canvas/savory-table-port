import { getApperClient } from "@/services/apperClient";

export const reviewService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("review_c", {
fields: [
          { field: { Name: "title_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "review_text_c" } },
          { field: { Name: "reviewer_name_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "verified_c" } },
          { field: { Name: "pros_c" } },
          { field: { Name: "cons_c" } },
          { field: { Name: "creation_date_c" } },
          { field: { Name: "updated_date_c" } },
          { field: { Name: "reply_c" } },
          { field: { Name: "vote_option_c" } }
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
        title: review.title_c,
        rating: review.rating_c,
        reviewText: review.review_text_c,
        reviewerName: review.reviewer_name_c,
        date: review.date_c,
        verified: review.verified_c,
        pros: review.pros_c,
        cons: review.cons_c,
        creationDate: review.creation_date_c,
        updatedDate: review.updated_date_c,
        reply: review.reply_c,
        voteOption: review.vote_option_c
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
{ field: { Name: "title_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "review_text_c" } },
          { field: { Name: "reviewer_name_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "verified_c" } },
          { field: { Name: "pros_c" } },
          { field: { Name: "cons_c" } },
          { field: { Name: "creation_date_c" } },
          { field: { Name: "updated_date_c" } },
          { field: { Name: "reply_c" } },
          { field: { Name: "vote_option_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const review = response.data;
      return review ? {
Id: review.Id,
        title: review.title_c,
        rating: review.rating_c,
        reviewText: review.review_text_c,
        reviewerName: review.reviewer_name_c,
        date: review.date_c,
        verified: review.verified_c,
        pros: review.pros_c,
        cons: review.cons_c,
        creationDate: review.creation_date_c,
        updatedDate: review.updated_date_c,
        reply: review.reply_c,
        voteOption: review.vote_option_c
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
            title_c: reviewData.title,
            rating_c: reviewData.rating,
            review_text_c: reviewData.reviewText,
            reviewer_name_c: reviewData.reviewerName,
            date_c: today,
            verified_c: false,
            pros_c: reviewData.pros,
            cons_c: reviewData.cons,
            creation_date_c: new Date().toISOString(),
            updated_date_c: new Date().toISOString(),
            reply_c: "",
            vote_option_c: ""
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
title: data.title_c,
            rating: data.rating_c,
            reviewText: data.review_text_c,
            reviewerName: data.reviewer_name_c,
            date: data.date_c,
            verified: data.verified_c,
            pros: data.pros_c,
            cons: data.cons_c,
            creationDate: data.creation_date_c,
            updatedDate: data.updated_date_c,
            reply: data.reply_c,
            voteOption: data.vote_option_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating review:", error);
      return null;
    }
  },

  async update(id, reviewData) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.updateRecord("review_c", {
        records: [
          {
            Id: id,
title_c: reviewData.title,
            rating_c: reviewData.rating,
            review_text_c: reviewData.reviewText,
            reviewer_name_c: reviewData.reviewerName,
            pros_c: reviewData.pros,
            cons_c: reviewData.cons,
            updated_date_c: new Date().toISOString()
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const updated = response.results[0];
        if (updated.success) {
          const data = updated.data;
          return {
            Id: data.Id,
title: data.title_c,
            rating: data.rating_c,
            reviewText: data.review_text_c,
            reviewerName: data.reviewer_name_c,
            date: data.date_c,
            verified: data.verified_c,
            pros: data.pros_c,
            cons: data.cons_c,
            creationDate: data.creation_date_c,
            updatedDate: data.updated_date_c,
            reply: data.reply_c,
            voteOption: data.vote_option_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error(`Error updating review ${id}:`, error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.deleteRecord("review_c", {
        RecordIds: [id]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        const deleted = response.results[0];
        return deleted.success;
      }

      return false;
    } catch (error) {
      console.error(`Error deleting review ${id}:`, error);
      return false;
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