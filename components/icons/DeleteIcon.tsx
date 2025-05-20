interface DeleteIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string
}

export function DeleteIcon({ size = 50 }: DeleteIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="50" height="50" rx="25" fill="white" />
      <path
        d="M25 25L20 20M25 25L30 30M25 25L30 20M25 25L20 30"
        stroke="#FF7873"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
