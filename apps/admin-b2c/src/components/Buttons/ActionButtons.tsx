import React from 'react';
import { Button, ButtonProps } from './Button';
import { EditIcon, SaveIcon, CancelIcon, PlusIcon, CategoriesIcon, SpinnerIcon, BackIcon } from './Icons';

interface ActionButtonProps extends Omit<ButtonProps, 'icon' | 'children'> {
  children?: React.ReactNode;
}

export const EditButton: React.FC<ActionButtonProps> = ({ children = 'Quick Edit', ...props }) => (
  <Button
    variant="primary"
    icon={<EditIcon />}
    {...props}
  >
    {children}
  </Button>
);

export const SaveButton: React.FC<ActionButtonProps> = ({ children = 'Save Changes', loading, ...props }) => (
  <Button
    variant="success"
    icon={loading ? <SpinnerIcon /> : <SaveIcon />}
    loading={loading}
    {...props}
  >
    {loading ? 'Saving...' : children}
  </Button>
);

export const CancelButton: React.FC<ActionButtonProps> = ({ children = 'Cancel', ...props }) => (
  <Button
    variant="danger"
    icon={<CancelIcon />}
    {...props}
  >
    {children}
  </Button>
);

export const AddButton: React.FC<ActionButtonProps> = ({ children = 'Add New Product', ...props }) => (
  <Button
    variant="success"
    icon={<PlusIcon />}
    {...props}
  >
    {children}
  </Button>
);

export const ManageCategoriesButton: React.FC<ActionButtonProps> = ({ children = 'Manage Categories', ...props }) => (
  <Button
    variant="warning"
    icon={<CategoriesIcon />}
    {...props}
  >
    {children}
  </Button>
);

export const BackButton: React.FC<ActionButtonProps> = ({ children = 'Back', ...props }) => (
  <Button
    variant="secondary"
    icon={<BackIcon />}
    {...props}
  >
    {children}
  </Button>
);

// Compound button for edit/save functionality
interface EditSaveButtonProps {
  isEditing: boolean;
  isSaving?: boolean;
  onEdit: () => void;
  onSave: () => void;
  editText?: string;
  saveText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const EditSaveButton: React.FC<EditSaveButtonProps> = ({
  isEditing,
  isSaving = false,
  onEdit,
  onSave,
  editText = 'Quick Edit',
  saveText = 'Save Changes',
  disabled = false,
  fullWidth = false,
}) => {
  if (isEditing) {
    return (
      <SaveButton
        onClick={onSave}
        loading={isSaving}
        disabled={disabled || isSaving}
        fullWidth={fullWidth}
      >
        {saveText}
      </SaveButton>
    );
  }

  return (
    <EditButton
      onClick={onEdit}
      disabled={disabled}
      fullWidth={fullWidth}
    >
      {editText}
    </EditButton>
  );
};