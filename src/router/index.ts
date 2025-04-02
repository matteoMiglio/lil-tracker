import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: "/:pathMatch(.*)*",
    //   component: () => import("@/views/PageNotFoundView.vue"),
    // },
    // { path: '/choose-season', name: 'ChooseSeason', component: ChooseSeasonView },
    {
      path: "/",
      name: "home",
      component: HomeView,
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
  ],
});

// router.beforeEach((to, from, next) => {
//   const seasonStore = useSeasonStore()
//   const activeSeason = seasonStore.getActiveSeason

//   if (!activeSeason && to.name !== 'ChooseSeason') {
//     // Redirect to the season selection page if no active season
//     next({ name: 'ChooseSeason' })
//   } else {
//     next()
//   }
// })

export default router;
