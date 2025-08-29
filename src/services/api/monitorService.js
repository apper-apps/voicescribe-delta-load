const monitorService = {
  // Initialize ApperClient
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  },

  // Get monitor configuration (gets the first/default config)
  getConfig: async () => {
    try {
      const apperClient = monitorService.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "input_directory_c" } },
          { field: { Name: "output_directory_c" } },
          { field: { Name: "auto_transcribe_c" } },
          { field: { Name: "file_types_c" } }
        ],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("monitor_config_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.data && response.data.length > 0) {
        const record = response.data[0];
        return {
          Id: record.Id,
          name: record.Name,
          inputDirectory: record.input_directory_c || "",
          outputDirectory: record.output_directory_c || "",
          autoTranscribe: record.auto_transcribe_c || false,
          fileTypes: record.file_types_c ? record.file_types_c.split('\n').filter(Boolean) : [".mp3", ".mp4", ".wav", ".m4a"]
        };
      } else {
        // Create default config if none exists
        return monitorService.createDefaultConfig();
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching monitor config:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Create default configuration
  createDefaultConfig: async () => {
    try {
      const apperClient = monitorService.getApperClient();
      
      const recordData = {
        Name: "Default Monitor Configuration",
        input_directory_c: "/Users/Documents/Audio/Input",
        output_directory_c: "/Users/Documents/Audio/Output",
        auto_transcribe_c: true,
        file_types_c: ".mp3\n.mp4\n.wav\n.m4a"
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord("monitor_config_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord && successfulRecord.data) {
          const record = successfulRecord.data;
          return {
            Id: record.Id,
            name: record.Name,
            inputDirectory: record.input_directory_c || "",
            outputDirectory: record.output_directory_c || "",
            autoTranscribe: record.auto_transcribe_c || false,
            fileTypes: record.file_types_c ? record.file_types_c.split('\n').filter(Boolean) : [".mp3", ".mp4", ".wav", ".m4a"]
          };
        }
      }
      
      throw new Error("Failed to create default configuration");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating default monitor config:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Update monitor configuration
  updateConfig: async (newConfig) => {
    try {
      const apperClient = monitorService.getApperClient();
      
      // First get existing config to get ID
      const existingConfig = await monitorService.getConfig();
      
      const recordData = {
        Id: existingConfig.Id
      };

      if (newConfig.name !== undefined) recordData.Name = newConfig.name;
      if (newConfig.inputDirectory !== undefined) recordData.input_directory_c = newConfig.inputDirectory;
      if (newConfig.outputDirectory !== undefined) recordData.output_directory_c = newConfig.outputDirectory;
      if (newConfig.autoTranscribe !== undefined) recordData.auto_transcribe_c = newConfig.autoTranscribe;
      if (newConfig.fileTypes !== undefined) {
        recordData.file_types_c = Array.isArray(newConfig.fileTypes) ? newConfig.fileTypes.join('\n') : newConfig.fileTypes;
      }

      const params = {
        records: [recordData]
      };

      const response = await apperClient.updateRecord("monitor_config_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update monitor config ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
            name: record.Name,
            inputDirectory: record.input_directory_c || "",
            outputDirectory: record.output_directory_c || "",
            autoTranscribe: record.auto_transcribe_c || false,
            fileTypes: record.file_types_c ? record.file_types_c.split('\n').filter(Boolean) : [".mp3", ".mp4", ".wav", ".m4a"]
          };
        }
      }
      
      throw new Error("No successful record updated");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating monitor config:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Toggle auto-transcription
  toggleAutoTranscribe: async () => {
    try {
      const existingConfig = await monitorService.getConfig();
      return monitorService.updateConfig({ 
        autoTranscribe: !existingConfig.autoTranscribe 
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error toggling auto-transcribe:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Update directory paths
  updateDirectories: async (inputDir, outputDir) => {
    try {
      return monitorService.updateConfig({ 
        inputDirectory: inputDir,
        outputDirectory: outputDir
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating directories:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
};

export default monitorService;