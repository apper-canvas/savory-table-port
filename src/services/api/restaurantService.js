import { getApperClient } from "@/services/apperClient";

export const restaurantService = {
  async getInfo() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("restaurant_info_c", {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "monday_c" } },
          { field: { Name: "tuesday_c" } },
          { field: { Name: "wednesday_c" } },
          { field: { Name: "thursday_c" } },
          { field: { Name: "friday_c" } },
          { field: { Name: "saturday_c" } },
          { field: { Name: "sunday_c" } },
          { field: { Name: "lat_c" } },
          { field: { Name: "lng_c" } }
        ]
      });

      if (!response.success || !response.data || response.data.length === 0) {
        console.error(response.message || "No restaurant info found");
        return null;
      }

      const record = response.data[0];
      return {
        name: record.name_c,
        address: record.address_c,
        phone: record.phone_c,
        email: record.email_c,
        hours: {
          monday: record.monday_c,
          tuesday: record.tuesday_c,
          wednesday: record.wednesday_c,
          thursday: record.thursday_c,
          friday: record.friday_c,
          saturday: record.saturday_c,
          sunday: record.sunday_c
        },
        coordinates: {
          lat: record.lat_c,
          lng: record.lng_c
        }
      };
    } catch (error) {
      console.error("Error fetching restaurant info:", error);
      return null;
    }
  },

  async updateInfo(data) {
    try {
      const currentInfo = await this.getInfo();
      if (!currentInfo) {
        console.error("Cannot update: no existing restaurant info found");
        return null;
      }

      const apperClient = getApperClient();
      const updateData = {
        Id: currentInfo.Id,
        name_c: data.name,
        address_c: data.address,
        phone_c: data.phone,
        email_c: data.email,
        lat_c: data.coordinates?.lat,
        lng_c: data.coordinates?.lng
      };

      if (data.hours) {
        updateData.monday_c = data.hours.monday;
        updateData.tuesday_c = data.hours.tuesday;
        updateData.wednesday_c = data.hours.wednesday;
        updateData.thursday_c = data.hours.thursday;
        updateData.friday_c = data.hours.friday;
        updateData.saturday_c = data.hours.saturday;
        updateData.sunday_c = data.hours.sunday;
      }

      const response = await apperClient.updateRecord("restaurant_info_c", {
        records: [updateData]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return await this.getInfo();
    } catch (error) {
      console.error("Error updating restaurant info:", error);
      return null;
    }
  },

  async getHours() {
    const info = await this.getInfo();
    return info ? info.hours : null;
  },

  async getLocation() {
    const info = await this.getInfo();
    return info ? {
      address: info.address,
      coordinates: info.coordinates
    } : null;
  },

  async getContactInfo() {
    const info = await this.getInfo();
    return info ? {
      phone: info.phone,
      email: info.email,
      address: info.address
    } : null;
  }
};