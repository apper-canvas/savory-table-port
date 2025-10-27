import { getApperClient } from "@/services/apperClient";

const photoService = {
  getAllPhotos: async () => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("photo_c", {
        fields: [
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "description_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(photo => ({
        Id: photo.Id,
        title: photo.title_c,
        category: photo.category_c,
        imageUrl: photo.image_url_c,
        description: photo.description_c
      }));
    } catch (error) {
      console.error("Error fetching photos:", error);
      return [];
    }
  },

  getPhotosByCategory: async (category) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("photo_c", {
        fields: [
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "description_c" } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(photo => ({
        Id: photo.Id,
        title: photo.title_c,
        category: photo.category_c,
        imageUrl: photo.image_url_c,
        description: photo.description_c
      }));
    } catch (error) {
      console.error("Error fetching photos by category:", error);
      return [];
    }
  }
};

export default photoService;