import React, { useState, useCallback } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const FileDropZone = ({ 
  onFileSelect, 
  acceptedTypes = [".mp3", ".mp4"],
  maxFiles = 10,
  className 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      acceptedTypes.some(type => file.name.toLowerCase().endsWith(type.toLowerCase()))
    );
    
    if (validFiles.length > 0) {
      setFiles(validFiles.slice(0, maxFiles));
      onFileSelect(validFiles.slice(0, maxFiles));
    }
  }, [acceptedTypes, maxFiles, onFileSelect]);

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles.slice(0, maxFiles));
    onFileSelect(selectedFiles.slice(0, maxFiles));
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "file-drop-zone relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
          isDragOver && "drag-over"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
            <ApperIcon name="Upload" className="w-8 h-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">
              Drop your audio files here
            </p>
            <p className="text-sm text-gray-500">
              Supports MP3 and MP4 files up to 100MB each
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => document.getElementById("file-input").click()}
            >
              <ApperIcon name="FolderOpen" className="w-4 h-4 mr-2" />
              Browse Files
            </Button>
          </div>

          <input
            id="file-input"
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Selected Files</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Music" className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileDropZone;