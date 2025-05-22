interface TriangleIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string;
}

export function TriangleIcon({}: TriangleIconProps) {
  return (
    <svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.20105 14.5L0.561523 3H1.71622L7.7784 13.5L8.50012 12.2499V14H8.64443L8.35575 14.5L7.7784 15.5L7.20105 14.5ZM11.5312 9L15.8613 1.5L16.4387 0.5H15.284H4.77843V1.5L14.7066 1.5L10.3765 9H11.5312Z"
      />
    </svg>
  );
}
