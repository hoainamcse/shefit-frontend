type RawExercise = {
  week_number: number
  day_number: number
  circuit_name: string
  circuit_description: string
  circuit_auto_replay_count: number
  exercise_title: string
  exercise_description: string
  exercise_youtube_url: string
  exercise_no: number
}

type Transformed = {
  weeks: {
    week_number: number
    days: {
      day_number: number
      circuits: {
        name: string
        description: string
        auto_replay_count: number
        circuit_exercises: {
          circuit_exercise_title: string
          circuit_exercise_description: string
          youtube_url: string
          no: number
        }[]
      }[]
    }[]
  }[]
}

export function transformData(rawData: RawExercise[]): Transformed {
  const result: Transformed = { weeks: [] }

  for (const item of rawData) {
    // Week
    let week = result.weeks.find((w) => w.week_number === item.week_number)
    if (!week) {
      week = { week_number: item.week_number, days: [] }
      result.weeks.push(week)
    }

    // Day
    let day = week.days.find((d) => d.day_number === item.day_number)
    if (!day) {
      day = { day_number: item.day_number, circuits: [] }
      week.days.push(day)
    }

    // Circuit
    let circuit = day.circuits.find((c) => c.name === item.circuit_name)
    if (!circuit) {
      circuit = {
        name: item.circuit_name,
        description: item.circuit_description,
        auto_replay_count: item.circuit_auto_replay_count,
        circuit_exercises: [],
      }
      day.circuits.push(circuit)
    }

    // Exercise
    circuit.circuit_exercises.push({
      circuit_exercise_title: item.exercise_title,
      circuit_exercise_description: item.exercise_description,
      youtube_url: item.exercise_youtube_url,
      no: item.exercise_no,
    })
  }

  return result
}

type RawDish = {
  day_number: number
  dish_name: string
  dish_description: string
  dish_calories: number
  dish_protein: number
  dish_fat: number
  dish_carb: number
  dish_fiber: number
}

type TransformedDish = {
  days: {
    day_number: number
    dishes: {
      name: string
      description: string
      calories: number
      protein: number
      fat: number
      carb: number
      fiber: number
    }[]
  }[]
}

export function transformDishes(rawData: RawDish[]): TransformedDish {
  const result: TransformedDish = { days: [] }

  for (const item of rawData) {
    // Day
    let day = result.days.find((d) => d.day_number === item.day_number)
    if (!day) {
      day = { day_number: item.day_number, dishes: [] }
      result.days.push(day)
    }

    // Dish
    day.dishes.push({
      name: item.dish_name,
      description: item.dish_description,
      calories: item.dish_calories,
      protein: item.dish_protein,
      fat: item.dish_fat,
      carb: item.dish_carb,
      fiber: item.dish_fiber,
    })
  }

  return result
}
