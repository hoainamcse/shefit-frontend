interface ClockIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string
}

export function ClockIcon({}: ClockIconProps) {
  return (
    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.5616 9.99984C12.1087 9.99984 13.5924 9.38526 14.6864 8.29129C15.7804 7.19733 16.3949 5.7136 16.3949 4.1665H4.72827C4.72827 5.7136 5.34285 7.19733 6.43682 8.29129C7.53078 9.38526 9.01451 9.99984 10.5616 9.99984ZM10.5616 9.99984C12.1087 9.99984 13.5924 10.6144 14.6864 11.7084C15.7804 12.8023 16.3949 14.2861 16.3949 15.8332H4.72827C4.72827 14.2861 5.34285 12.8023 6.43682 11.7084C7.53078 10.6144 9.01451 9.99984 10.5616 9.99984ZM4.72827 1.6665H16.3949M4.72827 18.3332H16.3949"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
