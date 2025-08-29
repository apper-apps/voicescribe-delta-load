const speakerService = {
  // Initialize ApperClient
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  },

  // Get all speakers
  getAll: async () => {
    try {
      const apperClient = speakerService.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "voice_clip_url_c" } },
          { field: { Name: "clip_duration_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords("speaker_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(record => ({
        Id: record.Id,
        name: record.Name || "Unknown",
        voiceClipUrl: record.voice_clip_url_c || "",
        clipDuration: record.clip_duration_c || 0,
        createdAt: record.created_at_c || record.CreatedOn
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching speakers:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Get pending speaker identifications
  getPendingIdentifications: async () => {
    try {
      const apperClient = speakerService.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "voice_clip_url_c" } },
          { field: { Name: "clip_duration_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "Name",
                    operator: "EqualTo",
                    values: ["Unknown"]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "Name",
                    operator: "StartsWith",
                    values: ["Speaker"]
                  }
                ],
                operator: "AND"
              }
            ]
          }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords("speaker_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(record => ({
        Id: record.Id,
        name: record.Name || "Unknown",
        voiceClipUrl: record.voice_clip_url_c || "",
        clipDuration: record.clip_duration_c || 0,
        createdAt: record.created_at_c || record.CreatedOn
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching pending identifications:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Get speaker by ID
  getById: async (id) => {
    try {
      const apperClient = speakerService.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "voice_clip_url_c" } },
          { field: { Name: "clip_duration_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      };

      const response = await apperClient.getRecordById("speaker_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Speaker not found");
      }

      const record = response.data;
      return {
        Id: record.Id,
        name: record.Name || "Unknown",
        voiceClipUrl: record.voice_clip_url_c || "",
        clipDuration: record.clip_duration_c || 0,
        createdAt: record.created_at_c || record.CreatedOn
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching speaker with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Create new speaker
  create: async (speakerData) => {
    try {
      const apperClient = speakerService.getApperClient();
      
      // Prepare data with only Updateable fields
      const recordData = {
        Name: speakerData.name || "Unknown",
        voice_clip_url_c: speakerData.voiceClipUrl || "",
        clip_duration_c: speakerData.clipDuration || 0,
        created_at_c: new Date().toISOString()
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord("speaker_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create speaker ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord && successfulRecord.data) {
          const record = successfulRecord.data;
          return {
            Id: record.Id,
            name: record.Name || "Unknown",
            voiceClipUrl: record.voice_clip_url_c || "",
            clipDuration: record.clip_duration_c || 0,
            createdAt: record.created_at_c || record.CreatedOn
          };
        }
      }
      
      throw new Error("No successful record created");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating speaker:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Update speaker (mainly for naming)
  update: async (id, updateData) => {
    try {
      const apperClient = speakerService.getApperClient();
      
      // Prepare data with only Updateable fields
      const recordData = {
        Id: parseInt(id)
      };

      if (updateData.name !== undefined) recordData.Name = updateData.name;
      if (updateData.voiceClipUrl !== undefined) recordData.voice_clip_url_c = updateData.voiceClipUrl;
      if (updateData.clipDuration !== undefined) recordData.clip_duration_c = updateData.clipDuration;

      const params = {
        records: [recordData]
      };

      const response = await apperClient.updateRecord("speaker_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update speaker ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord && successfulRecord.data) {
          const record = successfulRecord.data;
          return {
            Id: record.Id,
            name: record.Name || "Unknown",
            voiceClipUrl: record.voice_clip_url_c || "",
            clipDuration: record.clip_duration_c || 0,
            createdAt: record.created_at_c || record.CreatedOn
          };
        }
      }
      
      throw new Error("No successful record updated");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating speaker:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Identify speaker (set name)
  identifySpeaker: async (id, name) => {
    return speakerService.update(id, { name });
  },

  // Delete speaker
  delete: async (id) => {
    try {
      const apperClient = speakerService.getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("speaker_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete speaker ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        const successfulDeletions = response.results.filter(result => result.success);
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting speaker:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
};

export default speakerService;