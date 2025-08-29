import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FileDropZone from "@/components/molecules/FileDropZone";
import DirectorySelector from "@/components/molecules/DirectorySelector";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import transcriptionService from "@/services/api/transcriptionService";
const Upload = () => {
  const [recentUploads, setRecentUploads] = useState([]);
const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [outputPath, setOutputPath] = useState("/Users/Documents/Audio/Output");
  useEffect(() => {
    loadRecentUploads();
  }, []);

  const loadRecentUploads = async () => {
    try {
      setError("");
      setLoading(true);
      const uploads = await transcriptionService.getRecentTranscriptions();
      setRecentUploads(uploads);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      
      for (const file of files) {
const transcription = {
          fileName: file.name,
          inputPath: `/uploads/${file.name}`,
          outputPath: outputPath || "/Users/Documents/Audio/Output",
          status: "processing",
          progress: 0,
          speakers: [],
          createdAt: new Date().toISOString()
        };

        await transcriptionService.create(transcription);
        toast.success(`Upload started: ${file.name}`);
      }

      // Refresh the recent uploads
      await loadRecentUploads();
      
    } catch (err) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteUpload = async (id) => {
    try {
      await transcriptionService.delete(id);
      toast.success("Upload deleted successfully");
      await loadRecentUploads();
    } catch (err) {
      toast.error("Failed to delete upload: " + err.message);
    }
  };

  if (loading) {
    return <Loading type="skeleton" text="Loading recent uploads..." />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadRecentUploads}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Upload Audio Files</h1>
        <p className="text-lg text-gray-600">
          Upload MP3 or MP4 files to start transcription with automatic speaker identification
        </p>
      </div>
{/* Upload Zone */}
      <Card className="p-6">
        <FileDropZone 
          onFileSelect={handleFileSelect}
          acceptedTypes={[".mp3", ".mp4"]}
          maxFiles={10}
        />
        
        {uploading && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin">
                <ApperIcon name="Loader" className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-800">
                Processing uploads...
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Output Directory Configuration */}
      <div className="mt-6">
        <DirectorySelector
          type="output"
          value={outputPath}
          onChange={setOutputPath}
        />
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <ApperIcon name="FolderSync" className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">Auto Monitor</h3>
          <p className="text-sm text-gray-600 mb-3">
            Set up automatic transcription for new files
          </p>
          <Button variant="outline" size="sm">
            Configure
          </Button>
        </Card>

        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <ApperIcon name="Users" className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">Manage Speakers</h3>
          <p className="text-sm text-gray-600 mb-3">
            View and edit your speaker database
          </p>
          <Button variant="outline" size="sm">
            View Speakers
          </Button>
        </Card>

        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <ApperIcon name="Activity" className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">Active Jobs</h3>
          <p className="text-sm text-gray-600 mb-3">
            Monitor transcription progress
          </p>
          <Button variant="outline" size="sm">
            View Jobs
          </Button>
        </Card>
      </div>

      {/* Recent Uploads */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Uploads</h2>
          <Button variant="ghost" size="sm" onClick={loadRecentUploads}>
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {recentUploads.length === 0 ? (
          <Empty
            icon="Upload"
            title="No uploads yet"
            description="Upload your first audio file to get started with transcription."
            action="Upload Files"
            onAction={() => document.getElementById("file-input")?.click()}
          />
        ) : (
          <div className="grid gap-4">
            {recentUploads.map((upload) => (
              <Card key={upload.Id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                      <ApperIcon name="FileAudio" className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{upload.fileName}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(upload.createdAt).toLocaleDateString()} • 
                        Status: {upload.status}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Eye" className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteUpload(upload.Id)}
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
    </div>
  );
};

export default Upload;