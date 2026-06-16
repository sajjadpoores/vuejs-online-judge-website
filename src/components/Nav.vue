<template>
<div class="nav-view">
  <!-- nav -->
        <nav class="nav">
            <!-- first section of nav -->
            <div class="nav-first">
                <div class="nav-item logo">
                    <a href="/"><img src="@/assets/img/logo.png" alt=""></a>
                </div>
                <div class="full-width-on-mobile nav-item dropdown">
                    <span @click="show_dropdown"
                    v-click-outside="close_dropdown"
                     class="dropbtn flex-container-to-center">
                        
                        <font-awesome-icon icon="caret-down" class="dropbtn dropbtni" />
                        <span class="capitalized dropbtn">{{get_username}}</span>
                    </span>
                    <div id="myDropdown" class="dropdown-content">
                        <div class="dropdown-item">
                          <router-link to="/profile">پروفایل</router-link>
                        </div>
                        <div class="dropdown-item">
                          <router-link to="/logout" @click="logout">خروج</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <!-- end of first section -->
            <!-- second section of nav -->
            <div class="nav-second">

                <div class="full-width-on-mobile nav-item">
                  <router-link to="/dashboard">داشبورد</router-link>
                </div>

                <div class="full-width-on-mobile nav-item">
                  <router-link to="/problems/all">سوالات</router-link>
                </div>
                
                <div class="full-width-on-mobile nav-item">
                  <router-link to="/history">ارسال ها</router-link>
                </div>

                <div class="full-width-on-mobile nav-item">
                  <router-link to="/contests/all">مسابقات</router-link>
                </div>

                <div class="nav-item rightside-menu-btn" >
                  <svg width="30" height="30">
                        <path d="M0,5 30,5" stroke="" stroke-width="3" />

                        <path d="M0,14 30,14" stroke="" stroke-width="3" />

                        <path d="M0,23 30,23" stroke="" stroke-width="3" />
                    </svg>
                </div>
            </div>
            <!-- end of section section -->
        </nav>
        <!-- end of nav -->

        <!-- mobile nav -->
        <nav class="mobile-nav">
            <div class="mnav-item logo">
                <a href="/"><img src="@/assets/img/logo.png" alt=""></a>
            </div>
            <div class="mnav-dropbtn mnav-item" @click="show_mnav_items()">
                <a href="#">

                    <font-awesome-icon 
                    id="arrow_i_down"
                    icon="caret-down"/>

                    <font-awesome-icon 
                    id="arrow_i_up"
                    icon="caret-up"/>

                    <span class="capitalized">{{get_username}}</span>

                </a>
            </div>
            <div id="mnav-drop-container" class="mnav-drop-container">
                <div class="mnav-drop-item">
                    <router-link to="/profile">پروفایل</router-link>
                </div>
                <div class="mnav-drop-item">
                    <router-link to="/logout" @click="logout">خروج</router-link>
                </div>
            </div>


            <div class="mnav-item">
                <router-link to="/dashboard">داشبورد</router-link>
            </div>

            <div class="mnav-item">
                <router-link to="/problems/all">سوالات</router-link>
            </div>

            <div class="mnav-item">
                <router-link to="/history">ارسال ها</router-link>
            </div>

            <div class="mnav-item">
                <router-link to="/contests/all">مسابقات</router-link>
            </div>
        </nav>
        <!-- end of mobile nav -->

    </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    name: "Nav",
    data() {
        return {
            mnav_drop_container: null,
            arrow_i: null
        }
    },
    methods: {
        ...mapActions(['getProfile']),
        show_dropdown(){
            document.getElementById("myDropdown").classList.toggle("show");
        },
        close_dropdown(){
            if (!event.target.matches(".dropbtn")) {
                var dropdowns = document.getElementsByClassName("dropdown-content");
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains("show")) {
                    openDropdown.classList.remove("show");
                }
                }
            }
        },
        show_mnav_items(){
          if (this.mnav_drop_container.style.height === "100%") {
              this.mnav_drop_container.style.height = "0"
              this.mnav_drop_container.style.transform = "scaleY(0)"
              document.getElementById('arrow_i_up').style.display = 'none'
              document.getElementById('arrow_i_down').style.display = 'inline'
          } else {
              this.mnav_drop_container.style.height = "100%"
              this.mnav_drop_container.style.transform = "scaleY(1)"
              document.getElementById('arrow_i_up').style.display = 'inline'
              document.getElementById('arrow_i_down').style.display = 'none'
          }

          // console.log(this.mnav_drop_container.style.height)
        },
        logout(){
          this.$cookie.delete('auth')
          // refresh the page
          window.location.reload()
        },
    },
    computed: {
        ...mapState(['profileDetail']),
        get_username(){
            if(this.profileDetail.username === null)
                return 'پروفایل'
            return this.profileDetail.username
        }
    },
    mounted(){
        this.mnav_drop_container = document.getElementById("mnav-drop-container")

        const jwt = this.$cookie.get('auth')
        this.getProfile(jwt)
    }
}
</script>

<style scoped>
/* nav */
.nav {
  display: flex;
  color: var(--light-blue) !important;

  font-size: 1.4rem;
  font-family: 'vazir', sans-serif;
}

.nav-first {
  display: flex;
  flex: 4;
}

.nav-second {
  flex: 1;
  display: flex;
  flex-direction: row-reverse;
}

.nav-item a {
  color: var(--light-blue);
  text-decoration: none;
}

.nav-item a:hover {
  color: var(--greenest);
}

.nav-item {
  align-self: center;
  margin: 7px;
  white-space: nowrap;
}

.nav-second .nav-item {
  align-self: center;
  flex: 1;
}

.logo {
  border-radius: 5px;
  max-height: 80px;
  filter: invert(1);
}

.rightside-menu-btn {
  display: none;
  order: -100;
}

.rightside-menu-btn svg path:hover {
  stroke: var(--greenest);
}

/* tablet size screen */
@media screen and (max-width: 600px) {
  .rightside-menu-btn {
    display: block;
    align-self: center;
  }
}

/* mobile size screen */
@media screen and (max-width: 600px) {
  .nav {
    flex-direction: column;
  }
  .nav-first {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .nav-second {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
  }

  .rightside-menu-btn {
    position: fixed;
    right: 0;
    top: 10px;
    background: none !important;
  }

  /* make some of nav items full width on mobile size screen */
  .full-width-on-mobile {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.1);
  }

  .nav-item a {
    display: block;
    width: 100%;
  }
  .nav-item {
    text-align: center;
  }

  /* change dropdown content being 100% in mobile size screen */
  .dropdown-content {
    width: 50% !important;
    right: 20vw !important;
  }
}

/* nav dropdown */
.dropbtn {
  cursor: pointer;
  display: block;
}

.dropbtn:hover,
.dropbtn:focus {
  color: var(--greenest);
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  width: 130%;
  text-align: center;
  display: none;
  position: absolute;
  z-index: 100;
  top: 50px;
  right: 2px;
  background-color: var(--light-blue);

  border-radius: 5px;
}

.dropdown-item {
  border-radius: 5px 5px 0 0;
  border-bottom: 1px solid var(--dark-blue);
  cursor: pointer;
  background-color: var(--light-blue);
  margin-top: 2px;
}

.dropdown-item a{
  color: var(--dark-blue);
}

.dropdown-item:last-child {
  border-radius: 5px;
}

.dropdown-item:hover {
  color: var(--greenest);
}

.dropbtn .dropbtni {
  display: block;
  float: right;
  margin-top: 9px;
  margin-left: 5px;
}

.show {
  display: block;
}

#arrow_i_up{
  display: none;
  margin-right: 3px;
}

#arrow_i_down {
  display: inline;
  margin-right: 3px;
}
/* end of nav dropdown */

/* end of nav */


/* mobile menu */

.mobile-nav {
  display: none;
}
@media screen and (max-width: 600px) {
  .nav {
    display: none;
  }

  .mobile-nav {
    display: flex;
    flex-direction: column;
    text-align: center;
    font-size: 1.4rem;
    font-family: 'vazir', sans-serif;
  }

  .mnav-item {
    background-color: rgba(255, 255, 255, 0.1);
    margin-bottom: 7px;
  }

  .mnav-drop-container {
    transition: all 0.3s linear;
    transform: scaleY(0);
    transform-origin: top;
    height: 0;
    overflow: hidden;
  }

  .mnav-drop-item a {
    text-decoration: none;
    color: var(--light-blue);
    display: block;
    width: 100%;
  }

  .mnav-drop-item a:hover {
    color: var(--greenest);
  }

  .mnav-item a {
    text-decoration: none;
    color: var(--light-blue);
    display: block;
    width: 100%;
  }

  .mnav-item a:hover {
    color: var(--greenest);
  }
}
/* end of mobile menu */

/* general classes */
.capitalized {
    text-transform: capitalize;
}
/* end of general classes */
</style>