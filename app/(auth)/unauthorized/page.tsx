import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <div className="flex justify-center">
            <div className="bg-emerald-100 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">403 - Unauthorized</h2>
          <p className="mt-2 text-center text-gray-600">Bạn không có quyền truy cập tài nguyên này</p>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <Link
            href="/"
            className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
          >
            Trở về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
