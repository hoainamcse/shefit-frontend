interface MenuIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string;
}

export function MenuIcon({ size, style, ...others }: MenuIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, ...style }}
      {...others}
    >
      <path
        d="M20 12H10M20 5H4M20 19H4"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
