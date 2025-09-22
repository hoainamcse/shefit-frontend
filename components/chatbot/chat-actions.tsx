import { Dumbbell, LineChart, Settings, Utensils } from 'lucide-react'
import { Button } from '../ui/button'

const ACTION_ITEMS: any[] = [
  {
    id: 'course-form',
    label: 'Lên Khoá Tập',
    icon: <Dumbbell className="h-5 w-5" />,
    message: 'Lên Khoá Tập',
  },
  {
    id: 'meal-plan-form',
    label: 'Lên Thực Đơn',
    icon: <Utensils className="h-5 w-5" />,
    message: 'Lên Thực Đơn',
  },
  {
    id: 'progress',
    label: 'Theo dõi tiến độ',
    icon: <LineChart className="h-5 w-5" />,
    message: 'Theo dõi tiến độ',
  },
]

export function ChatActions({
  onMessageClick,
  onClick,
}: {
  onMessageClick?: (message: string) => void
  onClick?: (id: 'course-form' | 'meal-plan-form') => void
}) {
  function handleActionClick(id: string) {
    if (id === 'progress') {
      onMessageClick?.('Theo dõi tiến độ')
      return
    }

    onClick?.(id as 'course-form' | 'meal-plan-form')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Settings className="text-primary w-5 h-5" />
        <h3 className="font-medium">Thao Tác</h3>
      </div>

      <div className="space-y-2">
        {ACTION_ITEMS.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            onClick={() => handleActionClick(item.id)}
            className="w-full px-4 py-6 rounded-xl bg-primary hover:bg-primary/85 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-3 justify-start"
          >
            <div className="bg-background p-2 rounded-full">{item.icon}</div>
            <p className="text-gray-800 font-medium text-base">{item.label}</p>
          </Button>
        ))}
      </div>
    </div>
  )
}
