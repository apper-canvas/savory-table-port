import { getApperClient } from "@/services/apperClient";

export const menuService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("menu_item_c", {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "image_c" } },
          { field: { Name: "dietary_tags_c" } },
          { field: { Name: "available_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching menu items:", error);
      return [];
    }
  },

  async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("menu_item_c", {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "image_c" } },
          { field: { Name: "dietary_tags_c" } },
          { field: { Name: "available_c" } }
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

      return response.data || [];
    } catch (error) {
      console.error("Error fetching menu items by category:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById("menu_item_c", id, {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "image_c" } },
          { field: { Name: "dietary_tags_c" } },
          { field: { Name: "available_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching menu item ${id}:`, error);
      return null;
    }
  },

  async searchItems(query) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("menu_item_c", {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "image_c" } },
          { field: { Name: "dietary_tags_c" } },
          { field: { Name: "available_c" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "name_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "description_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "category_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              }
            ]
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching menu items:", error);
      return [];
    }
  },

  async getByDietaryTags(tags) {
    if (!tags || tags.length === 0) return await this.getAll();

    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("menu_item_c", {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "image_c" } },
          { field: { Name: "dietary_tags_c" } },
          { field: { Name: "available_c" } }
        ],
        where: [
          {
            FieldName: "dietary_tags_c",
            Operator: "Contains",
            Values: tags
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching menu items by dietary tags:", error);
      return [];
    }
  },

  getCategories() {
    return ["appetizers", "mains", "desserts", "drinks"];
  },

  getDietaryTags() {
    return ["vegetarian", "vegan", "gluten-free"];
  }
};