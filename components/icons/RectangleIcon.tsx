interface RectangleIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string
}

export function RectangleIcon({}: RectangleIconProps) {
  return (
    <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.561401 19V5H1.5614V19H11.5614V20H1.5614H0.561401V19ZM16.5614 15V1V0H15.5614H5.5614V1H15.5614V15H16.5614Z"
        fill="#8E8E93"
      />
    </svg>
  )
}
