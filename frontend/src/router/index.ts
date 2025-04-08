import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
      meta: {
        breadcrumb: "Home",
      },
    },
    {
      path: "/form",
      name: "form",
      component: () => import("@/views/FormView.vue"),
      meta: {
        breadcrumb: "Form",
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        breadcrumb: "Login",
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn;

  if (!isLoggedIn && to.name !== "login") {
    // Redirect to the login page if the user is not logged in
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
