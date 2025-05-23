
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Pencil, Trash2 } from "lucide-react";

interface TradeActionButtonsProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TradeActionButtons = ({
  isEditing,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: TradeActionButtonsProps) => {
  if (isEditing) {
    return (
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onSave}
          title="Save changes"
        >
          <Check className="h-4 w-4 text-green-500" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancel}
          title="Cancel editing"
        >
          <X className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex space-x-1">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onEdit}
        title="Edit trade"
      >
        <Pencil className="h-4 w-4 text-blue-500" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onDelete}
        title="Delete trade"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
};

export default TradeActionButtons;
