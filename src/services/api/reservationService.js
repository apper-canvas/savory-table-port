import { getApperClient } from "@/services/apperClient";

export const reservationService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("reservation_c", {
        fields: [
          { field: { Name: "date_c" } },
          { field: { Name: "time_c" } },
          { field: { Name: "party_size_c" } },
          { field: { Name: "customer_name_c" } },
          { field: { Name: "customer_email_c" } },
          { field: { Name: "customer_phone_c" } },
          { field: { Name: "special_requests_c" } },
          { field: { Name: "status_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(reservation => ({
        Id: reservation.Id,
        date: reservation.date_c,
        time: reservation.time_c,
        partySize: reservation.party_size_c,
        customerName: reservation.customer_name_c,
        customerEmail: reservation.customer_email_c,
        customerPhone: reservation.customer_phone_c,
        specialRequests: reservation.special_requests_c,
        status: reservation.status_c
      }));
    } catch (error) {
      console.error("Error fetching reservations:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById("reservation_c", id, {
        fields: [
          { field: { Name: "date_c" } },
          { field: { Name: "time_c" } },
          { field: { Name: "party_size_c" } },
          { field: { Name: "customer_name_c" } },
          { field: { Name: "customer_email_c" } },
          { field: { Name: "customer_phone_c" } },
          { field: { Name: "special_requests_c" } },
          { field: { Name: "status_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const reservation = response.data;
      return reservation ? {
        Id: reservation.Id,
        date: reservation.date_c,
        time: reservation.time_c,
        partySize: reservation.party_size_c,
        customerName: reservation.customer_name_c,
        customerEmail: reservation.customer_email_c,
        customerPhone: reservation.customer_phone_c,
        specialRequests: reservation.special_requests_c,
        status: reservation.status_c
      } : null;
    } catch (error) {
      console.error(`Error fetching reservation ${id}:`, error);
      return null;
    }
  },

  async create(reservationData) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.createRecord("reservation_c", {
        records: [
          {
            date_c: reservationData.date,
            time_c: reservationData.time,
            party_size_c: parseInt(reservationData.partySize),
            customer_name_c: reservationData.customerName,
            customer_email_c: reservationData.customerEmail,
            customer_phone_c: reservationData.customerPhone,
            special_requests_c: reservationData.specialRequests || "",
            status_c: "confirmed"
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      let newReservation = null;
      if (response.results && response.results.length > 0) {
        const created = response.results[0];
        if (created.success) {
          const data = created.data;
          newReservation = {
            Id: data.Id,
            date: data.date_c,
            time: data.time_c,
            partySize: data.party_size_c,
            customerName: data.customer_name_c,
            customerEmail: data.customer_email_c,
            customerPhone: data.customer_phone_c,
            specialRequests: data.special_requests_c,
            status: data.status_c
          };
        }
      }

      if (newReservation) {
        try {
          const emailResult = await apperClient.functions.invoke(
            import.meta.env.VITE_SEND_RESERVATION_EMAIL,
            {
              body: JSON.stringify({
                customerName: reservationData.customerName,
                customerEmail: reservationData.customerEmail,
                customerPhone: reservationData.customerPhone,
                date: reservationData.date,
                time: reservationData.time,
                partySize: reservationData.partySize,
                specialRequests: reservationData.specialRequests
              }),
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
          
          if (!emailResult.success) {
            console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SEND_RESERVATION_EMAIL}. The response body is: ${JSON.stringify(emailResult)}.`);
          }
        } catch (error) {
          console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_SEND_RESERVATION_EMAIL}. The error is: ${error.message}`);
        }
      }

      return newReservation;
    } catch (error) {
      console.error("Error creating reservation:", error);
      return null;
    }
  },

  async update(id, data) {
    try {
      const apperClient = getApperClient();
      
      const updateData = {
        Id: id
      };

      if (data.date) updateData.date_c = data.date;
      if (data.time) updateData.time_c = data.time;
      if (data.partySize) updateData.party_size_c = parseInt(data.partySize);
      if (data.customerName) updateData.customer_name_c = data.customerName;
      if (data.customerEmail) updateData.customer_email_c = data.customerEmail;
      if (data.customerPhone) updateData.customer_phone_c = data.customerPhone;
      if (data.specialRequests !== undefined) updateData.special_requests_c = data.specialRequests;
      if (data.status) updateData.status_c = data.status;

      const response = await apperClient.updateRecord("reservation_c", {
        records: [updateData]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return await this.getById(id);
    } catch (error) {
      console.error(`Error updating reservation ${id}:`, error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord("reservation_c", {
        RecordIds: [id]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return { Id: id };
    } catch (error) {
      console.error(`Error deleting reservation ${id}:`, error);
      return null;
    }
  },

  async checkAvailability(date, time) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("reservation_c", {
        fields: [
          { field: { Name: "date_c" } },
          { field: { Name: "time_c" } },
          { field: { Name: "status_c" } }
        ],
        where: [
          {
            FieldName: "date_c",
            Operator: "EqualTo",
            Values: [date]
          },
          {
            FieldName: "time_c",
            Operator: "EqualTo",
            Values: [time]
          },
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: ["confirmed"]
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return true;
      }

      const existingReservations = response.data || [];
      return existingReservations.length < 3;
    } catch (error) {
      console.error("Error checking availability:", error);
      return true;
    }
  },

  async getAvailableTimeSlots(date) {
    const timeSlots = [
      "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", 
      "20:00", "20:30", "21:00", "21:30", "22:00"
    ];
    
    const availableSlots = [];
    for (const time of timeSlots) {
      const isAvailable = await this.checkAvailability(date, time);
      if (isAvailable) {
        availableSlots.push(time);
      }
    }
    return availableSlots;
  }
};