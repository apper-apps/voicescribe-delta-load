import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";

const DirectorySelector = ({ 
  type = "input",
  value = "",
  onChange,
  className 
}) => {
  const [path, setPath] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onChange(path);
    setIsEditing(false);
  };

  const handleBrowse = () => {
    // In a real app, this would open a directory picker
    // For now, we'll simulate with a common path
    const simulatedPath = type === "input" 
      ? "/Users/Documents/Audio/Input" 
      : "/Users/Documents/Audio/Output";
    setPath(simulatedPath);
  };

  return (
    <Card className={cn("p-4", className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">
            {type === "input" ? "Input Directory" : "Output Directory"}
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <ApperIcon name="Settings" className="w-4 h-4" />
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <FormField
              label="Directory Path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder={`/path/to/${type}/directory`}
            />
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBrowse}
              >
                <ApperIcon name="FolderOpen" className="w-4 h-4 mr-1" />
                Browse
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!path.trim()}
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPath(value);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {path ? (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Folder" className="w-4 h-4 text-gray-600" />
                  <p className="text-sm font-mono text-gray-700 break-all">{path}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <ApperIcon name="FolderOpen" className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm">No directory selected</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setIsEditing(true)}
                >
                  Select Directory
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DirectorySelector;