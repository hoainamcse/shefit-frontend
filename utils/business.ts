function calculateIdealWeight(height: number): number {
  const baseWeight = 45.5 + 2.2 * ((height - 152.4) / 2.54)
  const adjustedWeight = Math.floor(baseWeight * 0.97)
  return adjustedWeight < 45 ? 45 : adjustedWeight
}

function calculateWeightToGain(weight: number, height: number): number {
  const idealWeight = calculateIdealWeight(height)
  return weight - idealWeight
}

export function calculateGoal(weight: number, height: number): string {
  const weightToLose = calculateWeightToGain(weight, height)
  if (weightToLose > 2.5) {
    return 'Giảm cân'
  } else if (weightToLose <= 2.5 && weightToLose > -1) {
    return 'Tăng cơ giảm mỡ'
  } else {
    return 'Tăng cân tăng cơ'
  }
}

function calculateBMR(weight: number, height: number): number {
  return 10 * weight + 6.25 * height - 5 * 35 - 161
}

function calculateTDEE(weight: number, height: number): number {
  const bmr = calculateBMR(weight, height)
  return bmr * 1.35
}

function calculateCaloriesToConsume(weight: number, height: number): number {
  const weightToLose = calculateWeightToGain(weight, height)
  return weightToLose * 7700
}

export function calculateCaloriePlan(weight: number, height: number): number {
  const idealWeight = calculateIdealWeight(height)
  const tdee = calculateTDEE(weight, height)

  if (weight > idealWeight) {
    return tdee - 500
  } else if (weight === idealWeight) {
    return tdee
  } else {
    return tdee + 500
  }
}

export function isActiveSubscription(status: string, endDate: string) {
  const now = new Date()
  const end = new Date(endDate)
  return status === 'active' && end > now
}
