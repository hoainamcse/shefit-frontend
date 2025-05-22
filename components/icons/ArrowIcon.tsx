interface ArrowIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string
}

export function ArrowIcon({ size = 24 }: ArrowIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.58329 19.4583L24.3312 19.4583L16.1791 27.6103L18.25 29.6666L29.9166 17.9999L18.25 6.33325L16.1937 8.3895L24.3312 16.5416L6.58329 16.5416L6.58329 19.4583Z"
      />
    </svg>
  )
}
