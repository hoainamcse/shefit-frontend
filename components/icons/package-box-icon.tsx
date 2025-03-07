interface PackageBoxIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string;
}

export function PackageBoxIcon({
  size,
  style,
  ...others
}: PackageBoxIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      style={{ width: size, height: size, ...style }}
      {...others}
    >
      <path d="M8.33203 11.6667H5.83203M10.832 14.1667H5.83203M4.9987 16.6667H14.9987C15.4407 16.6667 15.8646 16.4911 16.1772 16.1785C16.4898 15.866 16.6654 15.442 16.6654 15V5.00001C16.6654 4.55798 16.4898 4.13406 16.1772 3.8215C15.8646 3.50894 15.4407 3.33334 14.9987 3.33334H4.9987C4.55667 3.33334 4.13275 3.50894 3.82019 3.8215C3.50763 4.13406 3.33203 4.55798 3.33203 5.00001V15C3.33203 15.442 3.50763 15.866 3.82019 16.1785C4.13275 16.4911 4.55667 16.6667 4.9987 16.6667Z" />
      <path d="M13.332 5.83334H11.6654C11.2051 5.83334 10.832 6.20644 10.832 6.66668V8.33334C10.832 8.79358 11.2051 9.16668 11.6654 9.16668H13.332C13.7923 9.16668 14.1654 8.79358 14.1654 8.33334V6.66668C14.1654 6.20644 13.7923 5.83334 13.332 5.83334Z" />
    </svg>
  );
}
