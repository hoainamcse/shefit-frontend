import { DifficultyLevel, FormCategory } from '@/models/course'

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

export {
  getFormCategoryLabel,
  getDifficultyLevelLabel,
  DIFFICULTY_LEVEL_OPTIONS,
  FORM_CATEGORY_OPTIONS,
  DIFFICULTY_LEVELS,
  FORM_CATEGORIES,
  COURSE_FORMATS,
}
