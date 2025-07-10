interface AccountIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string;
  className?: string;
}

export function AccountIcon({ size, style, className = '', ...others }: AccountIconProps) {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, ...style }}
      className={className}
      {...others}
    >
      <path
        d="M12 4.5C13.0609 4.5 14.0783 4.92143 14.8284 5.67157C15.5786 6.42172 16 7.43913 16 8.5C16 9.56087 15.5786 10.5783 14.8284 11.3284C14.0783 12.0786 13.0609 12.5 12 12.5C10.9391 12.5 9.92172 12.0786 9.17157 11.3284C8.42143 10.5783 8 9.56087 8 8.5C8 7.43913 8.42143 6.42172 9.17157 5.67157C9.92172 4.92143 10.9391 4.5 12 4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M20 20.5V19.5C20 18.4391 19.5786 17.4217 18.8284 16.6716C18.0783 15.9214 17.0609 15.5 16 15.5H8C6.93913 15.5 5.92172 15.9214 5.17157 16.6716C4.42143 17.4217 4 18.4391 4 19.5V20.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
