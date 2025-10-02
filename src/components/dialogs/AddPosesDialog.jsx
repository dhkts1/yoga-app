import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../design-system';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { getPoseById } from '../../data/poses';

/**
 * AddPosesDialog - Dialog for adding selected poses with left/right side options
 */
const AddPosesDialog = ({
  isOpen,
  onClose,
  selectedPoseIds,
  onAdd
}) => {
  // Asymmetric poses that need left/right side options
  const asymmetricPoses = new Set(['warrior-one', 'warrior-two', 'triangle-pose', 'supine-twist']);

  // Track which poses should be added with both sides
  const [bothSides, setBothSides] = useState({});

  const handleToggleBothSides = (poseId) => {
    setBothSides(prev => ({
      ...prev,
      [poseId]: !prev[poseId]
    }));
  };

  const handleAdd = () => {
    const posesToAdd = [];

    selectedPoseIds.forEach(poseId => {
      const pose = getPoseById(poseId);
      if (!pose) return;

      if (asymmetricPoses.has(poseId) && bothSides[poseId]) {
        // Add both left and right side
        posesToAdd.push({
          poseId,
          side: 'left',
          duration: 30
        });
        posesToAdd.push({
          poseId,
          side: 'right',
          duration: 30
        });
      } else {
        // Add pose once (or specify side if asymmetric)
        posesToAdd.push({
          poseId,
          side: asymmetricPoses.has(poseId) ? 'right' : null,
          duration: 30
        });
      }
    });

    onAdd(posesToAdd);
    setBothSides({});
    onClose();
  };

  const asymmetricPosesInSelection = selectedPoseIds.filter(id => asymmetricPoses.has(id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add {selectedPoseIds.length} Pose{selectedPoseIds.length !== 1 ? 's' : ''}
          </DialogTitle>
          <DialogDescription>
            Configure how to add selected poses to your sequence
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Show side options for asymmetric poses */}
          {asymmetricPosesInSelection.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Side Options (Asymmetric Poses)
              </h4>
              {asymmetricPosesInSelection.map(poseId => {
                const pose = getPoseById(poseId);
                return (
                  <div key={poseId} className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
                    <Checkbox
                      id={`both-${poseId}`}
                      checked={bothSides[poseId] || false}
                      onCheckedChange={() => handleToggleBothSides(poseId)}
                    />
                    <Label
                      htmlFor={`both-${poseId}`}
                      className="flex items-center gap-2 text-sm cursor-pointer flex-1"
                    >
                      <span className="text-lg">{pose.emoji}</span>
                      <span>
                        {pose.nameEnglish} - <span className="font-medium">Both sides</span>
                      </span>
                    </Label>
                  </div>
                );
              })}
              <p className="text-xs text-gray-500">
                Unchecked poses will be added once (right side for asymmetric poses)
              </p>
            </div>
          )}

          {/* Summary */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>
                {selectedPoseIds.length + Object.values(bothSides).filter(Boolean).length}
              </strong> pose{(selectedPoseIds.length + Object.values(bothSides).filter(Boolean).length) !== 1 ? 's' : ''} will be added
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-secondary hover:bg-primary"
          >
            Add to Sequence
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPosesDialog;
