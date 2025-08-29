import speakerData from "@/services/mockData/speakers.json";

let speakers = [...speakerData];

const speakerService = {
  // Get all speakers
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return speakers.map(s => ({ ...s }));
  },

  // Get pending speaker identifications
  getPendingIdentifications: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return speakers
      .filter(s => s.name === "Unknown" || s.name.startsWith("Speaker"))
      .map(s => ({ ...s }));
  },

  // Get speaker by ID
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const speaker = speakers.find(s => s.Id === parseInt(id));
    if (!speaker) {
      throw new Error("Speaker not found");
    }
    return { ...speaker };
  },

  // Create new speaker
  create: async (speakerData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const maxId = speakers.length > 0 
      ? Math.max(...speakers.map(s => s.Id))
      : 0;
    
    const newSpeaker = {
      Id: maxId + 1,
      name: speakerData.name || "Unknown",
      voiceClipUrl: speakerData.voiceClipUrl || "",
      clipDuration: speakerData.clipDuration || 5,
      createdAt: new Date().toISOString(),
      ...speakerData
    };

    speakers.push(newSpeaker);
    return { ...newSpeaker };
  },

  // Update speaker (mainly for naming)
  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = speakers.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Speaker not found");
    }

    speakers[index] = { 
      ...speakers[index], 
      ...updateData,
      Id: parseInt(id)
    };
    
    return { ...speakers[index] };
  },

  // Identify speaker (set name)
  identifySpeaker: async (id, name) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return speakerService.update(id, { name });
  },

  // Delete speaker
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = speakers.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Speaker not found");
    }

    speakers.splice(index, 1);
    return true;
  }
};

export default speakerService;