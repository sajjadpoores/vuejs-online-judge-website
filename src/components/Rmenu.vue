<template>
      <!-- rightside menu **rmenu** -->
        <div class="rmenu" id="rmenu" v-click-outside="close_rmenu">

          <div id="rmenu-toggler-div" class="rmenu-open-btn" @click="show_rmenu">
                <input id="rmenu-toggler-btn" type="checkbox" class="toggler">
          <div class="hamburger">
         <div></div>
          </div>
        </div>

            <div class="rmenu-close-btn" @click="close_rmenu">
                &times;
            </div>
            <div class="rmenu-photo">
                <img :src="backendUrl + profileDetail.avatar_url" alt="">
            </div>

            <div class="rmenu-item rmenu-head">
                جزءیات
            </div>

            <div class="rmenu-item">
                <div class="rmenu-key">
                    تعداد سوالات حل شده
                </div>

                <div class="rmenu-value">
                    10
                </div>
            </div>

            <div class="rmenu-item">
                <div class="rmenu-key">
                    تعداد مسابقات شرکت کرده
                </div>

                <div class="rmenu-value">
                    20
                </div>
            </div>

        </div>
        <!-- end of rmenu -->
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'

export default {
    name: "Rmenu",
    data() {
        return {
            rmenu: null,
            rmenuTogglerBtn: null,
            rmenuTogglerDiv: null,
        }
    },
    methods: {
        ...mapActions(['getProfile']),
        close_rmenu(event) {
            // if user hasnt click on open rmenu button , close the rmenu
            if(event.target !==         this.rmenuTogglerBtn){
                    this.rmenu.style.width = "0px"  
                    this.rmenuTogglerDiv.style.opacity = "1"
            }
        },
      show_rmenu() {
          this.rmenu.style.width = "300px"
          this.rmenuTogglerDiv.style.opacity = "0"
      }
    },
    computed: {
      ...mapState(['backendUrl', 'profileDetail']),
    },
    mounted(){
        this.rmenu = document.getElementById('rmenu')
        this.rmenuTogglerDiv = document.getElementById('rmenu-toggler-div')
        this.rmenuTogglerBtn = document.getElementById('rmenu-toggler-btn')

        const jwt = this.$cookie.get('auth')
        this.getProfile(jwt)
    }
}
</script>

<style scoped>
#rmenu-view{
  width: 300px;
}
/* rmenu */
.rmenu {
  direction: rtl;
  font-size: 1.3rem;
  background-color: var(--gray-blue);
  color: var(--light-blue);
  border-radius: 10px;
  z-index: 1;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  padding-bottom: 10px;
}

.rmenu .rmenu-close-btn {
  display: none;

  align-self: flex-end;
  padding: 10px;
}
.rmenu .rmenu-close-btn:hover {
  color: var(--greenest);
  font-weight: bold;
  transform: scale(1.08);
  cursor: pointer;
}

.rmenu .rmenu-photo {
  clear: both;
  padding: 2px;
  margin-top: 8px;
  text-align: center;
}

.rmenu .rmenu-photo img {
  border-radius: 5px 0 0 5px;
}

.rmenu .rmenu-photo:hover {
  transform: scale(1.004);
}
.rmenu .rmenu-head {
  font-weight: bolder;
  margin: 5px 0;
  color: var(--light-blue);
}

.rmenu-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-right: 10px !important;
  color: white;
}

.rmenu-key {
  flex: 9;
}
.rmenu-value {
  flex: 1;
  font-weight: bolder;
  margin-right: auto;
}

/* rmenu fades away on tablet size screen */
@media screen and (min-width: 601px) {
  .rmenu .rmenu-close-btn {
    display: none;
  }
}
@media screen and (max-width: 600px) {
  .rmenu {
    position: fixed;
    right: 0;
    top: 0;
    height: 100%;
    opacity: 0.9;
    width: 0;
    transition: all 0.4s linear;

    border-radius: 0;
  }

  .rmenu .rmenu-close-btn {
    display: block;
  }

}
/* end of rmenu */


/* Rmenu hamburget btn */
.rmenu-open-btn {
   position: fixed;
   top: 5px;
   right: 0;
   z-index: 1;
}

.rmenu-open-btn .toggler {
   position: absolute;
   top: 12px;
   right: 0;
   cursor: pointer;
   z-index: 2;
   height: 50px;
   width: 50px;
   opacity: 0;
}

.rmenu-open-btn .hamburger {
   position: absolute;
   right: 0;
   top: 12px;
   z-index: 1;
   width: 60px;
   height: 60px;
   padding: 1rem;
   display: flex;
   justify-content: center;
   align-items: center;
}

/* Hamburger Line */
.rmenu-open-btn .hamburger>div {
   position: relative;
   width: 100%;
   height: 2px;
   background: var(--light-blue);
   display: flex;
   align-items: center;
   justify-content: center;
   transition: all 0.4s ease;
}

/* Top and bottom lines */
.rmenu-open-btn .hamburger>div::before,
.rmenu-open-btn .hamburger>div::after {
   content: '';
   position: absolute;
   z-index: 1;
   top: -10px;
   width: 100%;
   height: 2px;
   background: inherit;
}

/* Moves line down */
.rmenu-open-btn .hamburger>div::after {
   top: 10px;
}

/* stop showing rmenu toggler btn on wide screens */
@media screen and (min-width: 601px) {
  #rmenu-toggler-div {
    display: none;
  }
}

/* end of rmenu hamburger opener btn */

</style>