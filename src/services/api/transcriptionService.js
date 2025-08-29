const transcriptionService = {
  // Initialize ApperClient
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  },

  // Get all transcriptions
  getAll: async () => {
    try {
      const apperClient = transcriptionService.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "file_name_c" } },
          { field: { Name: "input_path_c" } },
          { field: { Name: "output_path_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "speakers_c" } },
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

      const response = await apperClient.fetchRecords("transcription_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(record => ({
        Id: record.Id,
        fileName: record.file_name_c || record.Name,
        inputPath: record.input_path_c || "",
        outputPath: record.output_path_c || "",
        status: record.status_c || "processing",
        progress: record.progress_c || 0,
        speakers: record.speakers_c ? record.speakers_c.split(',') : [],
        createdAt: record.created_at_c || record.CreatedOn
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching transcriptions:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Get recent transcriptions (last 10)
  getRecentTranscriptions: async () => {
    try {
      const apperClient = transcriptionService.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "file_name_c" } },
          { field: { Name: "input_path_c" } },
          { field: { Name: "output_path_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "speakers_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 10,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("transcription_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(record => ({
        Id: record.Id,
        fileName: record.file_name_c || record.Name,
        inputPath: record.input_path_c || "",
        outputPath: record.output_path_c || "",
        status: record.status_c || "processing",
        progress: record.progress_c || 0,
        speakers: record.speakers_c ? record.speakers_c.split(',') : [],
        createdAt: record.created_at_c || record.CreatedOn
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching recent transcriptions:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Get active jobs (processing, identifying)
  getActiveJobs: async () => {
    try {
      const apperClient = transcriptionService.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "file_name_c" } },
          { field: { Name: "input_path_c" } },
          { field: { Name: "output_path_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "speakers_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "Contains",
            Values: ["processing", "identifying"]
          }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords("transcription_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(record => ({
        Id: record.Id,
        fileName: record.file_name_c || record.Name,
        inputPath: record.input_path_c || "",
        outputPath: record.output_path_c || "",
        status: record.status_c || "processing",
        progress: record.progress_c || 0,
        speakers: record.speakers_c ? record.speakers_c.split(',') : [],
        createdAt: record.created_at_c || record.CreatedOn
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching active jobs:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Get transcription by ID
  getById: async (id) => {
    try {
      const apperClient = transcriptionService.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "file_name_c" } },
          { field: { Name: "input_path_c" } },
          { field: { Name: "output_path_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "speakers_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      };

      const response = await apperClient.getRecordById("transcription_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Transcription not found");
      }

      const record = response.data;
      return {
        Id: record.Id,
        fileName: record.file_name_c || record.Name,
        inputPath: record.input_path_c || "",
        outputPath: record.output_path_c || "",
        status: record.status_c || "processing",
        progress: record.progress_c || 0,
        speakers: record.speakers_c ? record.speakers_c.split(',') : [],
        createdAt: record.created_at_c || record.CreatedOn
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching transcription with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Create new transcription
  create: async (transcriptionData) => {
    try {
      const apperClient = transcriptionService.getApperClient();
      
      // Prepare data with only Updateable fields
      const recordData = {
        Name: transcriptionData.fileName || "",
        file_name_c: transcriptionData.fileName || "",
        input_path_c: transcriptionData.inputPath || "",
        output_path_c: transcriptionData.outputPath || "",
        status_c: transcriptionData.status || "processing",
        progress_c: transcriptionData.progress || 0,
        speakers_c: Array.isArray(transcriptionData.speakers) ? transcriptionData.speakers.join(',') : "",
        created_at_c: new Date().toISOString()
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord("transcription_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create transcription ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
            fileName: record.file_name_c || record.Name,
            inputPath: record.input_path_c || "",
            outputPath: record.output_path_c || "",
            status: record.status_c || "processing",
            progress: record.progress_c || 0,
            speakers: record.speakers_c ? record.speakers_c.split(',') : [],
            createdAt: record.created_at_c || record.CreatedOn
          };
        }
      }
      
      throw new Error("No successful record created");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating transcription:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Update transcription
  update: async (id, updateData) => {
    try {
      const apperClient = transcriptionService.getApperClient();
      
      // Prepare data with only Updateable fields
      const recordData = {
        Id: parseInt(id)
      };

      if (updateData.fileName !== undefined) recordData.file_name_c = updateData.fileName;
      if (updateData.inputPath !== undefined) recordData.input_path_c = updateData.inputPath;
      if (updateData.outputPath !== undefined) recordData.output_path_c = updateData.outputPath;
      if (updateData.status !== undefined) recordData.status_c = updateData.status;
      if (updateData.progress !== undefined) recordData.progress_c = updateData.progress;
      if (updateData.speakers !== undefined) {
        recordData.speakers_c = Array.isArray(updateData.speakers) ? updateData.speakers.join(',') : updateData.speakers;
      }

      const params = {
        records: [recordData]
      };

      const response = await apperClient.updateRecord("transcription_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update transcription ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
            fileName: record.file_name_c || record.Name,
            inputPath: record.input_path_c || "",
            outputPath: record.output_path_c || "",
            status: record.status_c || "processing",
            progress: record.progress_c || 0,
            speakers: record.speakers_c ? record.speakers_c.split(',') : [],
            createdAt: record.created_at_c || record.CreatedOn
          };
        }
      }
      
      throw new Error("No successful record updated");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating transcription:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Cancel transcription
  cancel: async (id) => {
    return transcriptionService.update(id, { 
      status: "cancelled",
      progress: 0
    });
  },

  // Delete transcription
  delete: async (id) => {
    try {
      const apperClient = transcriptionService.getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("transcription_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete transcription ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
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
        console.error("Error deleting transcription:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
};

export default transcriptionService;