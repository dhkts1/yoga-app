import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './design-system';
import { Slider } from './ui/slider';
import { getPoseById } from '../data/poses';
import { formatDuration } from '../data/customSessions';

/**
 * DurationEditDialog - Modal for editing pose duration with slider and quick options
 *
 * Uses shadcn/ui Dialog and Slider for a clean, focused editing experience
 */
const DurationEditDialog = ({
  isOpen,
  onClose,
  poseId,
  currentDuration,
  onSave
}) => {
  const [duration, setDuration] = useState(currentDuration);
  const pose = getPoseById(poseId);

  // Update local state when dialog opens with new values
  useEffect(() => {
    if (isOpen) {
      setDuration(currentDuration);
    }
  }, [isOpen, currentDuration]);

  const quickOptions = [
    { label: '15s', value: 15 },
    { label: '30s', value: 30 },
    { label: '45s', value: 45 },
    { label: '60s', value: 60 },
    { label: '90s', value: 90 },
    { label: '2min', value: 120 },
  ];

  const handleSave = () => {
    onSave(duration);
    onClose();
  };

  const handleSliderChange = (values) => {
    // Slider returns array, we want first value
    setDuration(values[0]);
  };

  if (!pose) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{pose.emoji}</span>
            Set Duration
          </DialogTitle>
          <DialogDescription>
            {pose.nameEnglish} · {pose.nameSanskrit}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Duration Display */}
          <div className="flex items-center justify-center gap-2 text-2xl font-medium text-muted-foreground">
            <Clock className="h-6 w-6" />
            {formatDuration(duration)}
          </div>

          {/* Slider */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              Adjust Duration
            </label>
            <Slider
              value={[duration]}
              onValueChange={handleSliderChange}
              min={15}
              max={180}
              step={15}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>15s</span>
              <span>3min</span>
            </div>
          </div>

          {/* Quick Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Quick Select
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quickOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={duration === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDuration(option.value)}
                  className={
                    duration === option.value
                      ? "bg-secondary hover:bg-primary"
                      : ""
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-secondary hover:bg-primary"
          >
            Save Duration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DurationEditDialog;
