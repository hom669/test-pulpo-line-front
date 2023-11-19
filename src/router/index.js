// Composables
import { createRouter, createWebHistory } from 'vue-router'
import authService from '@/services/auth.service';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/session/LoginView.vue'),
      },
      {
        path: 'register-encounter',
        name: 'Registros Encuentro de Oracion',
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/session/RegisterView.vue'),
      },
      {
        path: '/login',
        name: 'login',
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/session/LoginView.vue'),
      },
      {
        path: '/register',
        name: 'register',
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/session/RegisterView.vue'),
      },
      {
        path: '/currency-converter',
        name: 'currency converter',
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/CurrencyConverter/CurrencyConverterView.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Esta ruta requiere autenticación
    if (!authService.isAuthenticated()) {
      // Usuario no autenticado, redirige a la ruta de inicio de sesión
      next('/login');
    } else {
      // Usuario autenticado, permite el acceso a la ruta
      next();
    }
  } else {
    // Esta ruta no requiere autenticación, permite el acceso sin verificar
    next();
  }
});

export default router
