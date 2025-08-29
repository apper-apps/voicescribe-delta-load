import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress";

const TranscriptionCard = ({ 
  transcription, 
  onViewDetails,
  onDownload,
  onCancel,
  className 
}) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "completed": return "success";
      case "processing": return "info";
      case "identifying": return "warning";
      case "error": return "error";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return "CheckCircle";
      case "processing": return "Loader";
      case "identifying": return "UserSearch";
      case "error": return "AlertCircle";
      default: return "Clock";
    }
  };

  return (
    <Card className={cn("p-4", className)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">
              {transcription.fileName}
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Started {new Date(transcription.createdAt).toLocaleString()}
            </p>
          </div>
          <Badge variant={getStatusVariant(transcription.status)}>
            <ApperIcon 
              name={getStatusIcon(transcription.status)} 
              className={cn(
                "w-3 h-3 mr-1",
                transcription.status === "processing" && "animate-spin"
              )} 
            />
            {transcription.status}
          </Badge>
        </div>

        {/* Progress */}
        {transcription.status === "processing" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{transcription.progress}%</span>
            </div>
            <Progress value={transcription.progress} variant="primary" />
          </div>
        )}

        {/* Speakers */}
        {transcription.speakers && transcription.speakers.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Speakers Identified</p>
            <div className="flex flex-wrap gap-2">
              {transcription.speakers.map((speaker, index) => (
                <Badge key={index} variant="default">
                  <ApperIcon name="User" className="w-3 h-3 mr-1" />
                  {speaker}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex space-x-2">
            {transcription.status === "completed" && (
              <Button size="sm" onClick={() => onDownload(transcription)}>
                <ApperIcon name="Download" className="w-4 h-4 mr-1" />
                Download
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onViewDetails(transcription)}
            >
              <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
              Details
            </Button>
          </div>
          
          {(transcription.status === "processing" || transcription.status === "identifying") && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onCancel(transcription)}
            >
              <ApperIcon name="X" className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TranscriptionCard;