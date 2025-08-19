export const WelcomeSection = () => {
  const userName = 'Admin'

  return (
    <div className="w-full bg-white rounded-xl border border-border p-8 md:p-10 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-6">
          <span className="text-4xl md:text-5xl">💪</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Chào mừng {userName} đến với Shefit.vn Admin
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-8">
          Hệ thống quản lý toàn diện cho fitness, bodybuilding và dinh dưỡng. Quản lý thành viên, động tác, thực đơn và
          theo dõi tiến độ một cách dễ dàng.
        </p>
      </div>
    </div>
  )
}
