import monitorData from "@/services/mockData/monitorConfig.json";

let config = { ...monitorData };

const monitorService = {
  // Get monitor configuration
  getConfig: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { ...config };
  },

  // Update monitor configuration
  updateConfig: async (newConfig) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    config = { ...config, ...newConfig };
    return { ...config };
  },

  // Toggle auto-transcription
  toggleAutoTranscribe: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    config.autoTranscribe = !config.autoTranscribe;
    return { ...config };
  },

  // Update directory paths
  updateDirectories: async (inputDir, outputDir) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    config.inputDirectory = inputDir;
    config.outputDirectory = outputDir;
    return { ...config };
  }
};

export default monitorService;