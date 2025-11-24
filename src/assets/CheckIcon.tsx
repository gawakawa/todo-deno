import React from "react";

type CheckIconProps = {
  className?: string;
};

export const CheckIcon = ({ className }: CheckIconProps): React.JSX.Element => {
  return (
    <svg
      viewBox="0 0 18 18"
      aria-hidden="true"
      className={className}
    >
      <polyline points="1 9 7 14 15 4" />
    </svg>
  );
};
