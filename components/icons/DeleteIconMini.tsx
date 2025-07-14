interface DeleteIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string
}

export function DeleteIconMini({ size = 21 }: DeleteIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="21" height="21" rx="10.5" fill="white" />
      <path
        d="M10.4993 10.4998L6.54102 6.5415M10.4993 10.4998L14.4577 14.4582M10.4993 10.4998L14.4577 6.5415M10.4993 10.4998L6.54102 14.4582"
        stroke="#FF7873"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
