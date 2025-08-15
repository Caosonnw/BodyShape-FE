export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  guest: {
    order: '/guest/orders'
  },
  profile: '/profile',
  dashboard: '/dashboard',
  dashboardRoutes: {
    profile: '/dashboard/profile',
    users: '/dashboard/users',
    schedules: '/dashboard/month-view',
    packages: '/dashboard/packages',
    memberships: '/dashboard/memberships',
    chat: '/dashboard/chat',
    chatWithAI: '/dashboard/chat-with-ai',
    checkins: '/dashboard/checkins',
    equipments: '/dashboard/equipments',
    coachCustomer: '/dashboard/coach-customer',
    trainingPlans: '/dashboard/training-plans',
    exercises: '/dashboard/exercises',
    planExcercises: '/dashboard/plan-exercises',
    workoutLogs: '/dashboard/workout-logs',
    plans: '/dashboard/plan-exercises-for-customer'
  }
}
