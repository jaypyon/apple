import VueRouter from "vue-router";
import Constants from "@/constants.js";
import MainPage from "@/view/MainPage.vue";
let routes = [
  {
    path: "/",
    name: Constants.ROUTE_NAME.MAINPAGE,
    component: MainPage,
    meta: {
      auth: false,
    },
  },
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
