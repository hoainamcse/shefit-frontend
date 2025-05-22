interface BodyIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string;
}

export function BodyIcon({ size = 24 }: BodyIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path
        d="M33.3332 3.33337C33.3332 3.33337 29.9999 11.1467 29.9999 17.6184C29.9999 19.6917 30.7099 21.425 31.6666 23.1517C32.7666 25.14 34.1949 27.1184 35.2432 29.59C36.0749 31.5534 36.6666 33.8284 36.6666 36.6667M6.66656 3.33337C6.66656 3.33337 9.9999 11.1467 9.9999 17.6184C9.9999 19.6917 9.2899 21.425 8.33323 23.1517C7.23323 25.14 5.8049 27.1184 4.75656 29.59C3.80013 31.8258 3.31557 34.235 3.33323 36.6667"
        strokeLinejoin="round"
      />
      <path d="M10 21.6667H30M35 29.1667C25 29.1667 20.8333 34.1667 20 36.6667C19.1667 34.1667 15 29.1667 5 29.1667" />
    </svg>
  );
}
