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
    users: '/dashboard/users',
    schedules: '/dashboard/month-view',
    packages: '/dashboard/packages',
    memberships: '/dashboard/memberships',
    chat: '/dashboard/chat',
    checkins: '/dashboard/checkins',
    equipments: '/dashboard/equipments',
    coachCustomer: '/dashboard/coach-customer'
  }
}
