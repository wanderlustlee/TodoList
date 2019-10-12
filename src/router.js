import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Todolist from './components/TodoList'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
            path: '/home',
            name: 'home',
            component: Home
        },
        {
            path: '/',
            name: 'Todolist',
            component: Todolist
        },
        {
            path: '/about',
            name: 'about',
            component: () =>
                import ( /* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
})