import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import DirectorySelector from "@/components/molecules/DirectorySelector";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import monitorService from "@/services/api/monitorService";
import transcriptionService from "@/services/api/transcriptionService";

const Monitor = () => {
  const [config, setConfig] = useState(null);
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    loadMonitorConfig();
    loadActiveJobs();
  }, []);

  const loadMonitorConfig = async () => {
    try {
      setError("");
      setLoading(true);
      const monitorConfig = await monitorService.getConfig();
      setConfig(monitorConfig);
      setIsMonitoring(monitorConfig?.autoTranscribe || false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadActiveJobs = async () => {
    try {
      const jobs = await transcriptionService.getActiveJobs();
      setActiveJobs(jobs);
    } catch (err) {
      console.error("Failed to load active jobs:", err);
    }
  };

  const handleDirectoryChange = async (type, path) => {
    try {
      const updatedConfig = {
        ...config,
        [type === "input" ? "inputDirectory" : "outputDirectory"]: path
      };
      
      await monitorService.updateConfig(updatedConfig);
      setConfig(updatedConfig);
      toast.success(`${type === "input" ? "Input" : "Output"} directory updated`);
    } catch (err) {
      toast.error(`Failed to update directory: ${err.message}`);
    }
  };

  const toggleMonitoring = async () => {
    try {
      const updatedConfig = {
        ...config,
        autoTranscribe: !isMonitoring
      };
      
      await monitorService.updateConfig(updatedConfig);
      setConfig(updatedConfig);
      setIsMonitoring(!isMonitoring);
      
      toast.success(
        isMonitoring ? "Auto-transcription disabled" : "Auto-transcription enabled"
      );
    } catch (err) {
      toast.error(`Failed to toggle monitoring: ${err.message}`);
    }
  };

  if (loading) {
    return <Loading type="skeleton" text="Loading monitor configuration..." />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadMonitorConfig}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Directory Monitor</h1>
          <p className="text-lg text-gray-600 mt-2">
            Configure automatic transcription for incoming audio files
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant={isMonitoring ? "success" : "secondary"}>
            <ApperIcon 
              name={isMonitoring ? "Play" : "Pause"} 
              className="w-3 h-3 mr-1" 
            />
            {isMonitoring ? "Monitoring" : "Stopped"}
          </Badge>
          
          <Button
            variant={isMonitoring ? "outline" : "primary"}
            onClick={toggleMonitoring}
            disabled={!config?.inputDirectory || !config?.outputDirectory}
          >
            <ApperIcon 
              name={isMonitoring ? "Square" : "Play"} 
              className="w-4 h-4 mr-2" 
            />
            {isMonitoring ? "Stop" : "Start"} Monitor
          </Button>
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DirectorySelector
          type="input"
          value={config?.inputDirectory || ""}
          onChange={(path) => handleDirectoryChange("input", path)}
        />
        
        <DirectorySelector
          type="output"
          value={config?.outputDirectory || ""}
          onChange={(path) => handleDirectoryChange("output", path)}
        />
      </div>

      {/* Monitor Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Monitor Status</h3>
          <Button variant="ghost" size="sm" onClick={loadActiveJobs}>
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>

        {isMonitoring ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">
                Actively monitoring for new files
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{activeJobs.length}</p>
                <p className="text-sm text-gray-600">Active Jobs</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-success">
                  {activeJobs.filter(job => job.status === "completed").length}
                </p>
                <p className="text-sm text-gray-600">Completed Today</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-warning">
                  {activeJobs.filter(job => job.status === "processing").length}
                </p>
                <p className="text-sm text-gray-600">Processing</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Pause" className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Monitoring Stopped</h4>
            <p className="text-sm text-gray-600">
              Configure directories and start monitoring to automatically transcribe new files
            </p>
          </div>
        )}
      </Card>

      {/* File Type Configuration */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported File Types</h3>
        
        <div className="space-y-3">
          {(config?.fileTypes || [".mp3", ".mp4"]).map((type) => (
            <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon name="FileAudio" className="w-4 h-4 text-gray-600" />
                <span className="font-mono text-sm text-gray-900">{type.toUpperCase()}</span>
                <span className="text-xs text-gray-500">Audio File</span>
              </div>
              <Badge variant="success">Enabled</Badge>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <ApperIcon name="Info" className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">How it works</p>
              <p>
                Files added to the input directory will be automatically detected and queued for transcription. 
                Completed transcriptions will be saved to the output directory.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        
        {activeJobs.length === 0 ? (
          <Empty
            icon="Activity"
            title="No recent activity"
            description="Start monitoring to see transcription activity here."
          />
        ) : (
          <div className="grid gap-4">
            {activeJobs.slice(0, 5).map((job) => (
              <Card key={job.Id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                      <ApperIcon name="FileAudio" className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{job.fileName}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(job.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <Badge variant={
                    job.status === "completed" ? "success" :
                    job.status === "processing" ? "info" :
                    job.status === "error" ? "error" : "default"
                  }>
                    {job.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Monitor;