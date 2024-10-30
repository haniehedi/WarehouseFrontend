import Vue from 'vue';
import VueRouter from 'vue-router'; 
import RegisterPage from './components/accouts/RegisterPage'; 
import LoginPage from './components/accouts/LoginPage.vue'; 
import WarehousePage from './components/warehouses/WarehousePage.vue'; 
import FactorPage from './components/warehouses/FactorPage.vue';
import ProfilePage from './components/accouts/ProfilePage';

Vue.use(VueRouter);
const routes = [
  { path: '/register', component: RegisterPage },
  { path: '/login', component: LoginPage },
  { path: '/warehouse',name: 'WarehousePage', component: WarehousePage },
  { path: '/factor',name: 'FactorPage', component: FactorPage },
  { path: '/profile',name: 'ProfilePage', component: ProfilePage },
 
]
const router = new VueRouter({
  routes,
  mode: 'history', 
});

export default router;
