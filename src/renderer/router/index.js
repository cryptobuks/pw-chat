import Vue from 'vue'
import Router from 'vue-router'
import feathersClient from '@/api/feathers-client'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'welcome-view',
      component: require('@/components/WelcomeView'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/components/Login'),
      meta: { requiresAuth: false }
    },
    {
      path: '/signup',
      name: 'signup',
      component: require('@/components/Signup'),
      meta: { requiresAuth: false }
    },
    {
      path: '/forgot',
      name: 'forgot-password',
      component: require('@/components/ForgotPassword'),
      meta: { requiresAuth: false }
    },
    {
      path: '/chats',
      name: 'chat',
      component: require('@/components/MessengerView'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: require('@/components/ProfileView'),
      meta: { requiresAuth: true }
    },
    {
      name: 'EditProfile',
      path: '/edit-profile',
      component: require('@/components/ProfileView/EditProfile'),
      meta: { requiresAuth: true }
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: require('@/components/Contacts'),
      meta: { requiresAuth: true }
    },
    {
      path: '/add-contact',
      name: 'AddContact',
      component: require('@/components/AddContact'),
      meta: { requiresAuth: true }
    },
    {
      path: '/logout',
      name: 'logout',
      component: require('@/components/Logout'),
      meta: { requiresAuth: true }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
// Global naviagtion guard
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!feathersClient.get('user')) {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
