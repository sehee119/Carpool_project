import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Chat from '@/views/Chat'
import Driver from '@/views/Driver'
import Home from '@/views/Home'
import Mypage from '@/views/Mypage'
import Passenger from '@/views/Passenger'
import Request from '@/views/Request'


export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Chat',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/Driver',
      name: 'Driver',
      component: Driver
    },
    {
      path: '/Mypage',
      name: 'Mypage',
      component: Mypage
    },
    {
      path: '/Passenger',
      name: 'Passenger',
      component: Passenger
    },
    {
      path: '/Request',
      name: 'Request',
      component: Request
    }
  ]
})
