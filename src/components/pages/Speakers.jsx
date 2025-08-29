import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import SpeakerCard from "@/components/molecules/SpeakerCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import speakerService from "@/services/api/speakerService";

const Speakers = () => {
  const [speakers, setSpeakers] = useState([]);
  const [filteredSpeakers, setFilteredSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    loadSpeakers();
  }, []);

  useEffect(() => {
    filterSpeakers();
  }, [speakers, searchTerm]);

  const loadSpeakers = async () => {
    try {
      setError("");
      setLoading(true);
      const speakerList = await speakerService.getAll();
      setSpeakers(speakerList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterSpeakers = () => {
    if (!searchTerm) {
      setFilteredSpeakers(speakers);
    } else {
      const filtered = speakers.filter(speaker =>
        speaker.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSpeakers(filtered);
    }
  };

  const handleNameUpdate = async (speakerId, newName) => {
    try {
      await speakerService.update(speakerId, { name: newName });
      toast.success("Speaker name updated successfully");
      await loadSpeakers();
    } catch (err) {
      toast.error("Failed to update speaker: " + err.message);
    }
  };

  const handleDeleteSpeaker = async (speakerId) => {
    if (!window.confirm("Are you sure you want to delete this speaker?")) {
      return;
    }

    try {
      await speakerService.delete(speakerId);
      toast.success("Speaker deleted successfully");
      await loadSpeakers();
    } catch (err) {
      toast.error("Failed to delete speaker: " + err.message);
    }
  };

  const handlePlayClip = (speakerId) => {
    if (playingId === speakerId) {
      setPlayingId(null);
    } else {
      setPlayingId(speakerId);
      // Simulate audio playback - in real app would play actual audio
      setTimeout(() => setPlayingId(null), 3000);
    }
  };

  if (loading) {
    return <Loading type="cards" text="Loading speakers..." />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadSpeakers}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Speaker Database</h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage identified speakers and their voice clips
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant="primary">
            {speakers.length} Speaker{speakers.length !== 1 ? "s" : ""}
          </Badge>
          
          <Button variant="ghost" onClick={loadSpeakers}>
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="lg:flex-1 p-4">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Search" className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search speakers by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 focus:ring-0 pl-0"
            />
          </div>
        </Card>

        <div className="flex space-x-4">
          <Card className="p-4 text-center min-w-[100px]">
            <p className="text-2xl font-bold text-primary">{speakers.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </Card>
          
          <Card className="p-4 text-center min-w-[100px]">
            <p className="text-2xl font-bold text-success">
              {speakers.filter(s => s.name !== "Unknown").length}
            </p>
            <p className="text-sm text-gray-600">Named</p>
          </Card>
          
          <Card className="p-4 text-center min-w-[100px]">
            <p className="text-2xl font-bold text-warning">
              {speakers.filter(s => s.name === "Unknown").length}
            </p>
            <p className="text-sm text-gray-600">Unknown</p>
          </Card>
        </div>
      </div>

      {/* Speakers List */}
      <div className="space-y-4">
        {filteredSpeakers.length === 0 ? (
          <Empty
            icon="Users"
            title="No speakers found"
            description={
              searchTerm 
                ? `No speakers match "${searchTerm}". Try adjusting your search.`
                : "No speakers in your database yet. Upload and transcribe audio files to identify speakers."
            }
            action={!searchTerm ? "Upload Audio Files" : undefined}
            onAction={!searchTerm ? () => window.location.href = "/" : undefined}
          />
        ) : (
          <div className="grid gap-4">
            {filteredSpeakers.map((speaker) => (
              <Card key={speaker.Id} className="p-4">
                <div className="flex items-center justify-between">
                  {/* Speaker Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">{speaker.name}</h3>
                      <p className="text-sm text-gray-500">
                        {speaker.clipDuration}s voice clip • 
                        Added {new Date(speaker.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {/* Voice Clip Preview */}
                    <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                      <div className="flex space-x-1">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-200 ${
                              playingId === speaker.Id ? "animate-pulse-slow" : ""
                            }`}
                            style={{
                              height: `${Math.random() * 12 + 4}px`,
                              animationDelay: `${i * 100}ms`
                            }}
                          />
                        ))}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePlayClip(speaker.Id)}
                      >
                        <ApperIcon 
                          name={playingId === speaker.Id ? "Pause" : "Play"} 
                          className="w-4 h-4" 
                        />
                      </Button>
                    </div>

                    {/* Edit Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newName = prompt("Enter new name:", speaker.name);
                        if (newName && newName.trim() !== speaker.name) {
                          handleNameUpdate(speaker.Id, newName.trim());
                        }
                      }}
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSpeaker(speaker.Id)}
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4 text-error" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <ApperIcon name="HelpCircle" className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <h4 className="font-medium mb-2">How Speaker Identification Works</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Voice clips are automatically extracted when new speakers are detected</li>
              <li>• Each speaker gets a unique voice pattern stored in the database</li>
              <li>• Future transcriptions will automatically identify known speakers</li>
              <li>• You can edit speaker names and manage the database anytime</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Speakers;