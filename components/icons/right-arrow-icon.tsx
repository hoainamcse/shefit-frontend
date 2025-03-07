interface RightArrowIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string;
}

export function RightArrowIcon({
  size,
  style,
  ...others
}: RightArrowIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      style={{ width: size, height: size, ...style }}
      {...others}
    >
      <path
        d="M10 17L15 12L10 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
