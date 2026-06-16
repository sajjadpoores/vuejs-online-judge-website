<template>
  <div class="nav-rmenu-view">
      <section class="main">
        <!-- rightside menu **rmenu** -->
        <Rmenu class="rmenu" />
        <!-- end of rmenu -->

        <!-- main content -->
        <div class="main-content">
            <router-view />
        </div>
        <!-- end of main content -->
    </section>
    <!-- end of main section -->
  </div>
</template>

<script>
import Rmenu from '@/components/Rmenu.vue'
export default {
    name: "navRmenu",
    components: {
      Rmenu
    },
}
</script>

<style>
.nav-rmenu-view {
  font-size: 1.4rem;
}
/* general classes */

/* container with elements being centered */
.flex-container-to-center {
  display: flex !important;
  justify-content: center;
  flex-direction: row-reverse;
}

.flex-container-to-center > * {
  margin: 0 5px;
}

/* main section */
.main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px;
}
/* end of main section */

/* main content */
.main-content {
  flex-basis: calc(100% - 300px);
  margin: 0 auto;
}
/* end of main content */

.rmenu{
  /* #rmenu_width */
  flex-basis: 270px;
  order: 1;
}

@media screen and (max-width: 600px) {
  .main-content {
    flex-basis: 100%;
  }
}
</style>