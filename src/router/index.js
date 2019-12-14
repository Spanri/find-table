import Vue from "vue";
import VueRouter from "vue-router";
// вроде, если тут не использовать ленивую загрузку, оно быстрее грузится
import Task from "../views/Task.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue")
  },
  {
    path: "/task",
    name: "task",
    component: Task
  },

  {
    path: "*",
    redirect: "/"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
