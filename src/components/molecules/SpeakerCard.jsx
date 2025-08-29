import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";

const SpeakerCard = ({ 
  speaker, 
  isIdentifying = false,
  onNameSubmit,
  onPlayClip,
  isPlaying = false,
  className 
}) => {
  const [name, setName] = useState(speaker?.name || "");
  const [isEditing, setIsEditing] = useState(isIdentifying);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setName(speaker.name || "");
  };

  return (
    <Card className={cn("p-4 hover:shadow-md transition-all duration-200", className)}>
      <div className="space-y-4">
        {/* Waveform Visualization */}
        <div className="relative h-12 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-3 flex items-center">
          <div className="waveform flex-1 relative">
            <div className="flex items-center justify-center h-full space-x-1">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-200",
                    isPlaying ? "animate-pulse-slow" : ""
                  )}
                  style={{
                    width: "2px",
                    height: `${Math.random() * 20 + 8}px`,
                    animationDelay: `${i * 50}ms`
                  }}
                />
              ))}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onPlayClip}
            className="ml-2"
          >
            <ApperIcon 
              name={isPlaying ? "Pause" : "Play"} 
              className="w-4 h-4" 
            />
          </Button>
        </div>

        {/* Speaker Info */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <FormField
              label="Speaker Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter speaker name..."
              required
            />
            <div className="flex space-x-2">
              <Button type="submit" size="sm" disabled={!name.trim()}>
                <ApperIcon name="Check" className="w-4 h-4 mr-1" />
                Save
              </Button>
              {!isIdentifying && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div>
<h4 className="font-semibold text-gray-900">{speaker.name}</h4>
              <p className="text-sm text-gray-500">
                {speaker.clipDuration}s clip • Added {new Date(speaker.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Identification Notice */}
        {isIdentifying && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <ApperIcon name="AlertCircle" className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">New speaker detected</p>
                <p>Please provide a name for this speaker to continue.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SpeakerCard;