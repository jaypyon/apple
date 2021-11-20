import Vue from "vue";
import router from "./router";
import store from "./store";
import App from "./App.vue";
import VueLogger from "vuejs-logger";

Vue.use(VueLogger, {
  logLevel: process.env.NODE_ENV === "production" ? "error" : "debug",
});
Vue.config.productionTip = false;

if (window) {
  // eslint-disable-next-line no-undef
  window.setLogLevel = function (level) {
    VueLogger.install(Vue, { logLevel: level });
  };
}

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
