import { DifficultyLevel, FormCategory } from '@/models/course'
import { MealPlan, Goal } from '@/models/meal-plans'

function getGoalLabel(goal: Goal) {
  switch (goal) {
    case 'weight_loss':
      return 'Giảm cân'
    case 'energy':
      return 'Tăng năng lượng'
    case 'recovery':
      return 'Tăng khả năng phục hồi'
    case 'hormonal_balance':
      return 'Cân bằng hormone'
    case 'muscle_tone':
      return 'Tăng cường cơ bắp'
  }
}

function getFormCategoryLabel(category: FormCategory) {
  switch (category) {
    case 'pear':
      return 'Dáng quả lê'
    case 'apple':
      return 'Dáng quả táo'
    case 'rectangle':
      return 'Dáng chữ nhật'
    case 'hourglass':
      return 'Dáng đồng hồ cát'
    case 'inverted_triangle':
      return 'Dáng tam giác ngược'
  }
}

function getDifficultyLevelLabel(level: DifficultyLevel) {
  switch (level) {
    case 'beginner':
      return 'Dễ'
    case 'intermediate':
      return 'Trung bình'
    case 'advanced':
      return 'Nâng cao'
  }
}

function getVisibleInLabel(visible_in: string) {
  switch (visible_in) {
    case 'homepage_section_1':
      return 'Trang homepage 1'
    case 'homepage_section_2':
      return 'Trang homepage 2'
    case 'main_page':
      return 'Trang chủ'
  }
}

function getRoleLabel(role: string) {
  switch (role) {
    case 'normal_user':
      return 'User'
    case 'admin':
      return 'Admin'
    case 'sub_admin':
      return 'Sub Admin'
  }
}

const DIFFICULTY_LEVEL_OPTIONS: { value: DifficultyLevel; label: string }[] = [
  {
    value: 'beginner',
    label: 'Dễ',
  },
  {
    value: 'intermediate',
    label: 'Trung bình',
  },
  {
    value: 'advanced',
    label: 'Nâng cao',
  },
]

const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  {
    value: 'weight_loss',
    label: 'Giảm cân',
  },
  {
    value: 'energy',
    label: 'Tăng năng lượng',
  },
  {
    value: 'recovery',
    label: 'Tăng khả năng phục hồi',
  },
  {
    value: 'hormonal_balance',
    label: 'Cân bằng hormone',
  },
  {
    value: 'muscle_tone',
    label: 'Tăng cường cơ bắp',
  },
]

const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const

const FORM_CATEGORY_OPTIONS: { value: FormCategory; label: string }[] = [
  {
    value: 'pear',
    label: 'Dáng quả lê',
  },
  {
    value: 'apple',
    label: 'Dáng quả táo',
  },
  {
    value: 'rectangle',
    label: 'Dáng chữ nhật',
  },
  {
    value: 'hourglass',
    label: 'Dáng đồng hồ cát',
  },
  {
    value: 'inverted_triangle',
    label: 'Dáng tam giác ngược',
  },
]

const FORM_CATEGORIES = ['pear', 'apple', 'rectangle', 'hourglass', 'inverted_triangle'] as const

const COURSE_FORMATS = ['video', 'live']

const VISIBLE_IN_OPTIONS: { value: string; label: string }[] = [
  {
    value: 'homepage_section_1',
    label: 'Trang homepage 1',
  },
  {
    value: 'homepage_section_2',
    label: 'Trang homepage 2',
  },
  {
    value: 'main_page',
    label: 'Trang chủ',
  },
]

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

const ROLE_OPTIONS = [
  { value: 'normal_user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'sub_admin', label: 'Sub Admin' },
]

export {
  getGoalLabel,
  getFormCategoryLabel,
  getDifficultyLevelLabel,
  getVisibleInLabel,
  getRoleLabel,
  DIFFICULTY_LEVEL_OPTIONS,
  FORM_CATEGORY_OPTIONS,
  DIFFICULTY_LEVELS,
  FORM_CATEGORIES,
  COURSE_FORMATS,
  GOAL_OPTIONS,
  VISIBLE_IN_OPTIONS,
  PROVINCES,
  ROLE_OPTIONS,
}
