import Index from './pages/index/index';
import Battle from './pages/battle/index';
import Result from './pages/result/index';
import Dashang from './pages/dashang/index';

export default [
    { path: '/',      redirect: '/index' },
    { path: '/index', component: Index },
    { path: '/battle', component: Battle },
    { path: '/result', component: Result },
    { path: '/dashang', component: Dashang },
];