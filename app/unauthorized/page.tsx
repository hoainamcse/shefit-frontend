export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">403 - Unauthorized</h1>
        <p className="text-gray-600 mb-4">
          Bạn không có quyền truy cập tài nguyên này.
        </p>
        <a href="/" className="text-blue-600 hover:underline">
          Trở về trang chủ
        </a>
      </div>
    </div>
  )
}