import { createRouter, createWebHashHistory } from 'vue-router'
import Register from '@/views/Register.vue'
import ForgetPassword from '@/views/ForgetPassword.vue'
import SetPassword from '@/views/SetPassword.vue'
import Home from '@/views/Home.vue'
import Chat from '@/views/chatViews/Chat.vue'
import Profile from '@/views/homePage/profile.vue'
import FriendsManage from '@/views/friend/FriendsManage.vue'
import GroupChatInfo from '@/views/friend/GroupChatInfo.vue'
import FriendProfile from '@/views/homePage/FriendProfile.vue'
import Informs from '@/views/informs/Informs.vue'
// import Home from '../views/Home.vue'

const router = createRouter({
  mode: "hash",
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Start",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "Login",
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/forgetPassword',
      name: 'ForgetPassword',
      component: ForgetPassword
    },
    {
      path: '/setPassword',
      name: 'SetPassword',
      component: SetPassword
    },{
      path: "/home",
      name: "Home",
      // redirect: "/chat",
      component: Home,
      children:[{
        path: 'profile',
        name: 'Profile',
        component: Profile
      },{
        path: 'chat',
        name: 'Chat',
        component: Chat
        // components: {
        //   default:Home,
        //   homePage:Chat
        // }
      },{
        path: 'friendsManage',
        name: 'FriendsManage',
        component: FriendsManage,
        children:[{
          path: 'groupChatInfo',
          name: 'GroupChatInfo',
          component: GroupChatInfo
        },{
          path: 'friendProfile',
          name: 'FriendProfile',
          component: FriendProfile
        }]
      },{
        path: 'informs',
        name: 'Informs',
        component: Informs,
      }]
    }
  ]
})
export default router
