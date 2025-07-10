interface BookIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string;
  className?: string;
}

export function BookIcon({ size, style, className = '', ...others }: BookIconProps) {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, ...style }}
      {...others}
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.75 3.5H13.5L12.975 3.725L12 4.685L11.025 3.725L10.5 3.5H2.25L1.5 4.25V19.25L2.25 20H10.185L11.475 21.275H12.525L13.815 20H21.75L22.5 19.25V4.25L21.75 3.5ZM11.25 18.98L10.98 18.725L10.5 18.5H3V5H10.185L11.295 6.11L11.25 18.98ZM21 18.5H13.5L12.975 18.725L12.765 18.92V6.05L13.815 5H21V18.5ZM9 8H4.5V9.5H9V8ZM9 14H4.5V15.5H9V14ZM4.5 11H9V12.5H4.5V11ZM19.5 8H15V9.5H19.5V8ZM15 11H19.5V12.5H15V11ZM15 14H19.5V15.5H15V14Z"
        fill="currentColor"
      />
    </svg>
  );
}
