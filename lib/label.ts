import type { CourseLevel, CourseForm } from '@/models/course'
import type { DishMealTime, MealPlanGoal } from '@/models/meal-plan'

type Option<T> = {
  value: T
  label: string
}

const mealPlanGoalLabel: Record<MealPlanGoal, string> = {
  weight_loss: 'Giảm cân',
  energy: 'Tăng năng lượng',
  recovery: 'Tăng khả năng phục hồi',
  hormonal_balance: 'Cân bằng hormone',
  muscle_tone: 'Tăng cường cơ bắp',
} as const

const mealPlanGoalOptions = Object.entries(mealPlanGoalLabel).map(([value, label]) => ({
  value: value as MealPlanGoal,
  label,
})) as Option<MealPlanGoal>[]

const courseFormLabel: Record<CourseForm, string> = {
  pear: 'Dáng quả lê',
  apple: 'Dáng quả táo',
  rectangle: 'Dáng chữ nhật',
  hourglass: 'Dáng đồng hồ cát',
  inverted_triangle: 'Dáng tam giác ngược',
} as const

const courseFormOptions = Object.entries(courseFormLabel).map(([value, label]) => ({
  value: value as CourseForm,
  label,
})) as Option<CourseForm>[]

const courseLevelLabel: Record<CourseLevel, string> = {
  beginner: 'Dễ',
  intermediate: 'Trung bình',
  advanced: 'Nâng cao',
} as const

const courseLevelOptions = Object.entries(courseLevelLabel).map(([value, label]) => ({
  value: value as CourseLevel,
  label,
})) as Option<CourseLevel>[]

const dishMealTimeLabel: Record<DishMealTime, string> = {
  breakfast: 'Bữa sáng',
  lunch: 'Bữa trưa',
  dinner: 'Bữa tối',
  snack: 'Bữa phụ',
} as const

const dishMealTimeOptions = Object.entries(dishMealTimeLabel).map(([value, label]) => ({
  value: value as DishMealTime,
  label,
})) as Option<DishMealTime>[]

const giftTypeLabel: Record<string, string> = {
  membership_month: 'MEMBERSHIP_MONTH',
  item: 'ITEM',
} as const

const giftTypeOptions = Object.entries(giftTypeLabel).map(([value, label]) => ({
  value,
  label,
})) as Option<string>[]

const roleLabel: Record<string, string> = {
  normal_user: 'User',
  admin: 'Admin',
  sub_admin: 'Sub Admin',
} as const

const roleOptions = Object.entries(roleLabel).map(([value, label]) => ({
  value,
  label,
})) as Option<string>[]

const PROVINCES = [
  { value: 'An Giang', label: 'An Giang' },
  { value: 'Bà Rịa - Vũng Tàu', label: 'Bà Rịa - Vũng Tàu' },
  { value: 'Bắc Giang', label: 'Bắc Giang' },
  { value: 'Bắc Kạn', label: 'Bắc Kạn' },
  { value: 'Bạc Liêu', label: 'Bạc Liêu' },
  { value: 'Bắc Ninh', label: 'Bắc Ninh' },
  { value: 'Bến Tre', label: 'Bến Tre' },
  { value: 'Bình Định', label: 'Bình Định' },
  { value: 'Bình Dương', label: 'Bình Dương' },
  { value: 'Bình Phước', label: 'Bình Phước' },
  { value: 'Bình Thuận', label: 'Bình Thuận' },
  { value: 'Cà Mau', label: 'Cà Mau' },
  { value: 'Cần Thơ', label: 'Cần Thơ' },
  { value: 'Cao Bằng', label: 'Cao Bằng' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng' },
  { value: 'Đắk Lắk', label: 'Đắk Lắk' },
  { value: 'Đắk Nông', label: 'Đắk Nông' },
  { value: 'Điện Biên', label: 'Điện Biên' },
  { value: 'Đồng Nai', label: 'Đồng Nai' },
  { value: 'Đồng Tháp', label: 'Đồng Tháp' },
  { value: 'Gia Lai', label: 'Gia Lai' },
  { value: 'Hà Giang', label: 'Hà Giang' },
  { value: 'Hà Nam', label: 'Hà Nam' },
  { value: 'Hà Nội', label: 'Hà Nội' },
  { value: 'Hà Tĩnh', label: 'Hà Tĩnh' },
  { value: 'Hải Dương', label: 'Hải Dương' },
  { value: 'Hải Phòng', label: 'Hải Phòng' },
  { value: 'Hậu Giang', label: 'Hậu Giang' },
  { value: 'Hòa Bình', label: 'Hòa Bình' },
  { value: 'Hưng Yên', label: 'Hưng Yên' },
  { value: 'Khánh Hòa', label: 'Khánh Hòa' },
  { value: 'Kiên Giang', label: 'Kiên Giang' },
  { value: 'Kon Tum', label: 'Kon Tum' },
  { value: 'Lai Châu', label: 'Lai Châu' },
  { value: 'Lâm Đồng', label: 'Lâm Đồng' },
  { value: 'Lạng Sơn', label: 'Lạng Sơn' },
  { value: 'Lào Cai', label: 'Lào Cai' },
  { value: 'Long An', label: 'Long An' },
  { value: 'Nam Định', label: 'Nam Định' },
  { value: 'Nghệ An', label: 'Nghệ An' },
  { value: 'Ninh Bình', label: 'Ninh Bình' },
  { value: 'Ninh Thuận', label: 'Ninh Thuận' },
  { value: 'Phú Thọ', label: 'Phú Thọ' },
  { value: 'Phú Yên', label: 'Phú Yên' },
  { value: 'Quảng Bình', label: 'Quảng Bình' },
  { value: 'Quảng Nam', label: 'Quảng Nam' },
  { value: 'Quảng Ngãi', label: 'Quảng Ngãi' },
  { value: 'Quảng Ninh', label: 'Quảng Ninh' },
  { value: 'Quảng Trị', label: 'Quảng Trị' },
  { value: 'Sóc Trăng', label: 'Sóc Trăng' },
  { value: 'Sơn La', label: 'Sơn La' },
  { value: 'Tây Ninh', label: 'Tây Ninh' },
  { value: 'Thái Bình', label: 'Thái Bình' },
  { value: 'Thái Nguyên', label: 'Thái Nguyên' },
  { value: 'Thanh Hóa', label: 'Thanh Hóa' },
  { value: 'Thừa Thiên Huế', label: 'Thừa Thiên Huế' },
  { value: 'Tiền Giang', label: 'Tiền Giang' },
  { value: 'TP Hồ Chí Minh', label: 'TP Hồ Chí Minh' },
  { value: 'Trà Vinh', label: 'Trà Vinh' },
  { value: 'Tuyên Quang', label: 'Tuyên Quang' },
  { value: 'Vĩnh Long', label: 'Vĩnh Long' },
  { value: 'Vĩnh Phúc', label: 'Vĩnh Phúc' },
  { value: 'Yên Bái', label: 'Yên Bái' },
]

export { PROVINCES }
export { mealPlanGoalLabel, courseFormLabel, courseLevelLabel, dishMealTimeLabel, giftTypeLabel, roleLabel }
export { mealPlanGoalOptions, courseFormOptions, courseLevelOptions, dishMealTimeOptions, giftTypeOptions, roleOptions }
