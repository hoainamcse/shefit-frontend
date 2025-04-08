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

export {
  getGoalLabel,
  getFormCategoryLabel,
  getDifficultyLevelLabel,
  DIFFICULTY_LEVEL_OPTIONS,
  FORM_CATEGORY_OPTIONS,
  DIFFICULTY_LEVELS,
  FORM_CATEGORIES,
  COURSE_FORMATS,
  GOAL_OPTIONS,
}
