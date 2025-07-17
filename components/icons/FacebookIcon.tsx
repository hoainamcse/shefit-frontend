interface FacebookIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string
}

export function FacebookIcon({ size = 46 }: FacebookIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_878_901)">
        <path
          d="M46 23C46 10.2975 35.7025 0 23 0C10.2975 0 0 10.2975 0 23C0 34.4799 8.41081 43.9952 19.4062 45.7206V29.6484H13.5664V23H19.4062V17.9328C19.4062 12.1684 22.8401 8.98438 28.0938 8.98438C30.6101 8.98438 33.2422 9.43359 33.2422 9.43359V15.0938H30.342C27.4848 15.0938 26.5938 16.8667 26.5938 18.6857V23H32.9727L31.9529 29.6484H26.5938V45.7206C37.5892 43.9952 46 34.4801 46 23Z"
          fill="#1877F2"
        />
        <path
          d="M31.9529 29.6484L32.9727 23H26.5938V18.6857C26.5938 16.8665 27.4848 15.0938 30.342 15.0938H33.2422V9.43359C33.2422 9.43359 30.6101 8.98438 28.0936 8.98438C22.8401 8.98438 19.4062 12.1684 19.4062 17.9328V23H13.5664V29.6484H19.4062V45.7206C20.5951 45.9069 21.7966 46.0003 23 46C24.2034 46.0003 25.4049 45.9069 26.5938 45.7206V29.6484H31.9529Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_878_901">
          <rect width="46" height="46" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
