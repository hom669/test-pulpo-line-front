// Composables
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store';

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

// Guardia de navegación para verificar la autenticación
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Verificar si el usuario está autenticado
    console.log(store.getters.isAuthenticated);
    if (!store.getters.isAuthenticated) {
      // No está autenticado, redirigir al inicio de sesión
      next('/');
    } else {
      // Está autenticado, permitir el acceso a la ruta
      next();
    }
  } else {
    // La ruta no requiere autenticación, permitir el acceso
    next();
  }
});

export default router
