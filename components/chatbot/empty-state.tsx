'use client'

export function EmptyState({
  enableActions = false,
  onSubmit,
  onActionClick,
}: {
  enableActions?: boolean
  onSubmit?: (message: string) => void
  onActionClick?: (id: 'course-form' | 'meal-plan-form') => void
}) {
  return (
    <div className="p-4 flex items-center justify-center h-full">
      <div className="bg-pink-50 p-4 w-full rounded-xl flex flex-col gap-6">
        <h2 className="text-xl font-bold text-center">Chị muốn được tư vấn gì</h2>
        <div className={`grid grid-cols-2 gap-3`}>
          <button
            onClick={() => onSubmit?.('Tư vấn phom dáng')}
            className="bg-pink-100 hover:bg-pink-200 transition-colors text-pink-900 rounded-xl p-3 text-sm font-medium"
          >
            Tư vấn phom dáng
          </button>
          <button
            onClick={() => onSubmit?.('Hỏi Đáp')}
            className="bg-pink-100 hover:bg-pink-200 transition-colors text-pink-900 rounded-xl p-3 text-sm font-medium"
          >
            Hỏi Đáp
          </button>
          {enableActions && (
            <button
              onClick={() => onActionClick?.('course-form')}
              className="bg-pink-100 hover:bg-pink-200 transition-colors text-pink-900 rounded-xl p-3 text-sm font-medium"
            >
              Lên Khóa Tập
            </button>
          )}
          {enableActions && (
            <button
              onClick={() => onActionClick?.('meal-plan-form')}
              className="bg-pink-100 hover:bg-pink-200 transition-colors text-pink-900 rounded-xl p-3 text-sm font-medium"
            >
              Lên Thực Đơn
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
