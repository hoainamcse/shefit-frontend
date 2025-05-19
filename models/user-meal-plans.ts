type UserMealPlan = {
    id?: number,
    user_id: number,
    meal_plan_id: number,
    created_at: string,
    updated_at: string,
    meal_plan: {
        id: number,
        title: string,
        subtitle: string,
        chef_name: string,
        goal: string,
        image: string,
        description: string,
        number_of_days: number,
        is_public: boolean,
        is_free: boolean,
        free_days: number,
        diet_id: number
      }
    }

export type { UserMealPlan }