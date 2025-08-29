import transcriptionData from "@/services/mockData/transcriptions.json";

let transcriptions = [...transcriptionData];

const transcriptionService = {
  // Get all transcriptions
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return transcriptions.map(t => ({ ...t }));
  },

  // Get recent transcriptions (last 10)
  getRecentTranscriptions: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return transcriptions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(t => ({ ...t }));
  },

  // Get active jobs (processing, identifying)
  getActiveJobs: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return transcriptions
      .filter(t => ["processing", "identifying"].includes(t.status))
      .map(t => ({ ...t }));
  },

  // Get transcription by ID
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const transcription = transcriptions.find(t => t.Id === parseInt(id));
    if (!transcription) {
      throw new Error("Transcription not found");
    }
    return { ...transcription };
  },

  // Create new transcription
  create: async (transcriptionData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const maxId = transcriptions.length > 0 
      ? Math.max(...transcriptions.map(t => t.Id))
      : 0;
    
    const newTranscription = {
      Id: maxId + 1,
      fileName: transcriptionData.fileName,
      inputPath: transcriptionData.inputPath,
      outputPath: transcriptionData.outputPath || "",
      status: transcriptionData.status || "processing",
      progress: transcriptionData.progress || 0,
      speakers: transcriptionData.speakers || [],
      createdAt: new Date().toISOString(),
      ...transcriptionData
    };

    transcriptions.push(newTranscription);
    return { ...newTranscription };
  },

  // Update transcription
  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = transcriptions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Transcription not found");
    }

    transcriptions[index] = { 
      ...transcriptions[index], 
      ...updateData,
      Id: parseInt(id)
    };
    
    return { ...transcriptions[index] };
  },

  // Cancel transcription
  cancel: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return transcriptionService.update(id, { 
      status: "cancelled",
      progress: 0
    });
  },

  // Delete transcription
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = transcriptions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Transcription not found");
    }

    transcriptions.splice(index, 1);
    return true;
  }
};

export default transcriptionService;