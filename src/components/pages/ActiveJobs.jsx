import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress";
import TranscriptionCard from "@/components/molecules/TranscriptionCard";
import SpeakerCard from "@/components/molecules/SpeakerCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import transcriptionService from "@/services/api/transcriptionService";
import speakerService from "@/services/api/speakerService";

const ActiveJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [pendingIdentifications, setPendingIdentifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    loadActiveJobs();
    
    // Set up auto-refresh for active jobs
    const interval = setInterval(loadActiveJobs, 5000);
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const loadActiveJobs = async () => {
    try {
      setError("");
      if (jobs.length === 0) setLoading(true);
      
      const activeJobs = await transcriptionService.getActiveJobs();
      const identifications = await speakerService.getPendingIdentifications();
      
      setJobs(activeJobs);
      setPendingIdentifications(identifications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelJob = async (job) => {
    try {
      await transcriptionService.cancel(job.Id);
      toast.success("Job cancelled successfully");
      await loadActiveJobs();
    } catch (err) {
      toast.error("Failed to cancel job: " + err.message);
    }
  };

  const handleDownloadTranscription = async (job) => {
    try {
      // Simulate download - in real app would download actual file
      toast.success("Downloading transcription...");
    } catch (err) {
      toast.error("Failed to download: " + err.message);
    }
  };

  const handleViewJobDetails = (job) => {
    toast.info(`Viewing details for ${job.fileName}`);
  };

  const handleSpeakerIdentification = async (speakerId, name) => {
    try {
      await speakerService.identifySpeaker(speakerId, name);
      toast.success(`Speaker identified as "${name}"`);
      await loadActiveJobs();
    } catch (err) {
      toast.error("Failed to identify speaker: " + err.message);
    }
  };

  const handlePlaySpeakerClip = (speakerId) => {
    // Simulate audio playback
    toast.info("Playing voice clip...");
  };

  if (loading) {
    return <Loading type="cards" text="Loading active jobs..." />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadActiveJobs}
      />
    );
  }

  const processingJobs = jobs.filter(job => job.status === "processing");
  const completedJobs = jobs.filter(job => job.status === "completed");
  const errorJobs = jobs.filter(job => job.status === "error");

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Jobs</h1>
          <p className="text-lg text-gray-600 mt-2">
            Monitor transcription progress and identify new speakers
          </p>
        </div>

        <Button variant="ghost" onClick={loadActiveJobs}>
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-info">{processingJobs.length}</p>
          <p className="text-sm text-gray-600">Processing</p>
        </Card>
        
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-warning">{pendingIdentifications.length}</p>
          <p className="text-sm text-gray-600">Awaiting ID</p>
        </Card>
        
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-success">{completedJobs.length}</p>
          <p className="text-sm text-gray-600">Completed</p>
        </Card>
        
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-error">{errorJobs.length}</p>
          <p className="text-sm text-gray-600">Errors</p>
        </Card>
      </div>

      {/* Pending Speaker Identifications */}
      {pendingIdentifications.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">Speaker Identification Required</h2>
            <Badge variant="warning">
              {pendingIdentifications.length} Pending
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingIdentifications.map((speaker) => (
              <SpeakerCard
                key={speaker.Id}
                speaker={speaker}
                isIdentifying={true}
                onNameSubmit={(name) => handleSpeakerIdentification(speaker.Id, name)}
                onPlayClip={() => handlePlaySpeakerClip(speaker.Id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Processing Jobs */}
      {processingJobs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Currently Processing</h2>
          
          <div className="space-y-4">
            {processingJobs.map((job) => (
              <TranscriptionCard
                key={job.Id}
                transcription={job}
                onCancel={handleCancelJob}
                onViewDetails={handleViewJobDetails}
                onDownload={handleDownloadTranscription}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Jobs */}
      {completedJobs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Recently Completed</h2>
          
          <div className="space-y-4">
            {completedJobs.slice(0, 5).map((job) => (
              <TranscriptionCard
                key={job.Id}
                transcription={job}
                onViewDetails={handleViewJobDetails}
                onDownload={handleDownloadTranscription}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error Jobs */}
      {errorJobs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 text-error">Failed Jobs</h2>
          
          <div className="space-y-4">
            {errorJobs.map((job) => (
              <TranscriptionCard
                key={job.Id}
                transcription={job}
                onViewDetails={handleViewJobDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {jobs.length === 0 && pendingIdentifications.length === 0 && (
        <Empty
          icon="Activity"
          title="No active jobs"
          description="Upload audio files to start transcription and see job progress here."
          action="Upload Files"
          onAction={() => window.location.href = "/"}
        />
      )}

      {/* Real-time Status */}
      {(processingJobs.length > 0 || pendingIdentifications.length > 0) && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-800">
              Auto-refreshing every 5 seconds to show latest status
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ActiveJobs;