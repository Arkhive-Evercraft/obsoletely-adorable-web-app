"use client";

import React from 'react';
import { Button, ButtonProps } from '../base/Button';

export interface IconButtonProps extends Omit<ButtonProps, 'icon'> {
  icon: React.ReactElement;
  label?: string;
  hideText?: boolean;
}

export function IconButton({
  icon,
  label,
  hideText = false,
  children,
  ...props
}: IconButtonProps) {
  return (
    <Button
      icon={icon}
      {...props}
    >
      {!hideText && (children || label)}
    </Button>
  );
}
