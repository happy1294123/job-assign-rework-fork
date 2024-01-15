import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/point',
    name: 'point',
    component: () => import('../views/Point.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/announcement',
    name: 'announcement',
    component: () => import('../views/Announcement.vue')
  },
  {
    path: '/announcement/:id',
    name: 'announcementDetail',
    component: () => import('../views/AnnouncementDetail.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/cooperate',
    name: 'cooperate',
    component: () => import('../views/Cooperate.vue')
  },
  {
    path: '/service',
    name: 'service',
    component: () => import('../views/Service.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/Contact.vue')
  },
  {
    path: '/admin',
    name: 'admin login',
    component: () => import('../views/admin/Login.vue')
  },
  {
    path: '/admin/memberGroup',
    name: 'AdminMemberGroup',
    component: () => import('../views/admin/AdminMemberGroup.vue'),
  },
  {
    path: '/admin/memberManage/:memberId',
    name: 'AdminMember',
    component: () => import('../views/admin/AdminMember.vue'),
  },
  {
    path: '/admin/memberManage',
    name: 'AdminMemberManage',
    component: () => import('../views/admin/AdminMemberManage.vue'),
  },
  {
    path: '/admin/pointManage',
    name: 'AdminPointManage',
    component: () => import('../views/admin/AdminPointManage.vue'),
  },
  {
    path: '/admin/pointRecord',
    name: 'AdminPointRecord',
    component: () => import('../views/admin/AdminPointRecord.vue'),
  },
  {
    path: '/admin/productLaunch',
    name: 'AdminProductLaunch',
    component: () => import('../views/admin/AdminProductLaunch.vue'),
  },
  {
    path: '/admin/announcement',
    name: 'AdminAnnouncement',
    component: () => import('../views/admin/AdminAnnouncement.vue'),
  },
  {
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: () => import('../views/NotFound.vue')
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes,
  linkExactActiveClass: 'active',
})

export default router