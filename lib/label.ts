import type { CourseLevel, CourseForm } from '@/models/course'
import type { DishMealTime, MealPlanGoal } from '@/models/meal-plan'

type Option<T> = {
  value: T
  label: string
}

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

const giftTypeLabel: Record<string, string> = {
  membership_plan: 'Thời gian',
  item: 'Vật dụng',
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
  { value: 'an_giang', label: 'An Giang' },
  { value: 'ba_ria_vung_tau', label: 'Bà Rịa - Vũng Tàu' },
  { value: 'bac_giang', label: 'Bắc Giang' },
  { value: 'bac_kan', label: 'Bắc Kạn' },
  { value: 'bac_lieu', label: 'Bạc Liêu' },
  { value: 'bac_ninh', label: 'Bắc Ninh' },
  { value: 'ben_tre', label: 'Bến Tre' },
  { value: 'binh_dinh', label: 'Bình Định' },
  { value: 'binh_duong', label: 'Bình Dương' },
  { value: 'binh_phuoc', label: 'Bình Phước' },
  { value: 'binh_thuan', label: 'Bình Thuận' },
  { value: 'ca_mau', label: 'Cà Mau' },
  { value: 'can_tho', label: 'Cần Thơ' },
  { value: 'cao_bang', label: 'Cao Bằng' },
  { value: 'da_nang', label: 'Đà Nẵng' },
  { value: 'dak_lak', label: 'Đắk Lắk' },
  { value: 'dak_nong', label: 'Đắk Nông' },
  { value: 'dien_bien', label: 'Điện Biên' },
  { value: 'dong_nai', label: 'Đồng Nai' },
  { value: 'dong_thap', label: 'Đồng Tháp' },
  { value: 'gia_lai', label: 'Gia Lai' },
  { value: 'ha_giang', label: 'Hà Giang' },
  { value: 'ha_nam', label: 'Hà Nam' },
  { value: 'ha_noi', label: 'Hà Nội' },
  { value: 'ha_tinh', label: 'Hà Tĩnh' },
  { value: 'hai_duong', label: 'Hải Dương' },
  { value: 'hai_phong', label: 'Hải Phòng' },
  { value: 'hau_giang', label: 'Hậu Giang' },
  { value: 'hoa_binh', label: 'Hòa Bình' },
  { value: 'hung_yen', label: 'Hưng Yên' },
  { value: 'khanh_hoa', label: 'Khánh Hòa' },
  { value: 'kien_giang', label: 'Kiên Giang' },
  { value: 'kon_tum', label: 'Kon Tum' },
  { value: 'lai_chau', label: 'Lai Châu' },
  { value: 'lam_dong', label: 'Lâm Đồng' },
  { value: 'lang_son', label: 'Lạng Sơn' },
  { value: 'lao_cai', label: 'Lào Cai' },
  { value: 'long_an', label: 'Long An' },
  { value: 'nam_dinh', label: 'Nam Định' },
  { value: 'nghe_an', label: 'Nghệ An' },
  { value: 'ninh_binh', label: 'Ninh Bình' },
  { value: 'ninh_thuan', label: 'Ninh Thuận' },
  { value: 'phu_tho', label: 'Phú Thọ' },
  { value: 'phu_yen', label: 'Phú Yên' },
  { value: 'quang_binh', label: 'Quảng Bình' },
  { value: 'quang_nam', label: 'Quảng Nam' },
  { value: 'quang_ngai', label: 'Quảng Ngãi' },
  { value: 'quang_ninh', label: 'Quảng Ninh' },
  { value: 'quang_tri', label: 'Quảng Trị' },
  { value: 'soc_trang', label: 'Sóc Trăng' },
  { value: 'son_la', label: 'Sơn La' },
  { value: 'tay_ninh', label: 'Tây Ninh' },
  { value: 'thai_binh', label: 'Thái Bình' },
  { value: 'thai_nguyen', label: 'Thái Nguyên' },
  { value: 'thanh_hoa', label: 'Thanh Hóa' },
  { value: 'thua_thien_hue', label: 'Thừa Thiên Huế' },
  { value: 'tien_giang', label: 'Tiền Giang' },
  { value: 'ho_chi_minh', label: 'Hồ Chí Minh' },
  { value: 'tra_vinh', label: 'Trà Vinh' },
  { value: 'tuyen_quang', label: 'Tuyên Quang' },
  { value: 'vinh_long', label: 'Vĩnh Long' },
  { value: 'vinh_phuc', label: 'Vĩnh Phúc' },
  { value: 'yen_bai', label: 'Yên Bái' },
]

export { PROVINCES }
export { courseFormLabel, courseLevelLabel, giftTypeLabel, roleLabel }
export { courseFormOptions, courseLevelOptions, giftTypeOptions, roleOptions }
