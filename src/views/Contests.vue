<template>
  <div class="contests-view">
    <!-- contests-view-header -->
    <div class="contests-view-header">
        <span>مسابقات</span>
    </div>
    <!-- end of contests-view-header -->

    <!-- contests table head -->
    <div class="p-head">
        <span class="p-thin-item">
            #
        </span>

        <span class="p-item">
            عنوان
        </span>

        <span class="p-wide-item">
            تاریخ شروع
        </span>

        <span class="p-wide-item">
            تاریخ پایان
        </span>

        <span class="p-thin-item"></span>
    </div>
    <!-- end of contests table head -->

    <!-- contests table body -->
    <div class="p-body">
        <div class="p-row" v-for="(contest, index) in computeIndex" :key="contest.contestID">
            <span class="p-thin-item">{{ getIndexByPage(index, page) }}</span>

            <span class="p-item">
                <router-link :class="{ 'disabled-linkl': !userIsJoined(contest.contestID)}" :to="contestLink(contest.contestID)"> {{ contest.name }}</router-link>
            </span>

            <span class="p-wide-item">
            {{ contest.start_time_shamsi }}
            </span>

            <span class="p-wide-item" >
            {{ contest.end_time_shamsi }}
            </span>

            <span class="p-thin-item">
                <font-awesome-icon v-if="!contest.is_finished && !userIsJoined(contest.contestID)" @click="joinContest(contest.contestID)" icon="user-plus"></font-awesome-icon>

                <font-awesome-icon v-if="!contest.is_finished && userIsJoined(contest.contestID)" @click="leaveContest(contest.contestID)" icon="user-minus"></font-awesome-icon>
            </span>
        </div>

        <div class="p-row pagination-container">
            <div class="pagination-btns-container">
                <div class="pagination-btn pagination-arrow" :class="[(page + 1) * 5 + 1 > contests.length ? 'disabled': '']" @click="nextPage">
                    <font-awesome-icon icon="angle-right"></font-awesome-icon>
                </div>

                <div class="pagination-btn selected-number">{{ plus_one(page) }}</div>
                <div class="pagination-btn pagination-arrow" @click="pervPage" :class="{disabled: page === 0}">
                    <font-awesome-icon icon="angle-left"></font-awesome-icon>
                </div>
            </div>
        </div>

    </div>
    <!-- end of contests table body -->      
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment-jalaali'
import axios from 'axios'
export default {
    name: "contests",
    data() {
        return {
            page: 0,
            local_contests: [],
            joined_contests: [],
            has_next: true
        }
    },
    props: {
        type: String
    },
    computed: {
        ...mapState(['backendUrl', 'profileDetail', 'contests', 'myContests']),
        computeIndex() {
            if(this.type === 'all')
                this.local_contests = this.contests.slice(this.page*5, this.page*5+5)
            else if(this.type === 'user')
                this.local_contests = this.myContests.slice(this.page*5, this.page*5+5)

            // console.log(this.local_contests)
            return this.local_contests
        }
    },
    methods: {
        ...mapActions(['getContests']),
        nextPage(){
            if ((this.page +1)*5 + 1 <= this.local_contests.length)
                this.page++
        },
        pervPage(){
            if(this.page >= 1)
                this.page--
        },
        contestLink(id) {
            return `/contest/${id}`
        },
        leaveContest(id) {
            var jwt = this.$cookie.get('auth')

            axios.patch(this.backendUrl + '/contest/' + id, {}, {headers: {
                Authorization: jwt
            }}).then(response => {
                var index = this.joined_contests.indexOf(id)
                if (index !== -1)
                    this.joined_contests.splice(index, 1)

            }).catch(error => {
                console.log(error)
            })
        },
        joinContest(id) {
            var jwt = this.$cookie.get('auth')

            axios.post(this.backendUrl + '/contest/' + id, {}, {
              headers: {
                Authorization: jwt
              }
            }).then(response => {
                this.joined_contests.push(id)

            }).catch(error => {
                console.log(error)
            })
        },
        getContestInfo(id) {
            var jwt = this.$cookie.get('auth')

            axios.get(this.backendUrl + '/contest/' + id, {
              headers: {
                Authorization: jwt
              }
            }).then(response => {
                var contest_info = response.data.body
                // console.log(contest_info)
                if(contest_info.participant.includes(this.profileDetail.username)){
                    this.joined_contests.push(contest_info.contestID)
                }
            }).catch(error => {
                console.log(error)
            })
        },
        userIsJoined(id) {
            if (this.joined_contests.includes(id))
                return true
            return false
        },
        plus_one(index){
            return index + 1
        },
        getIndexByPage(index, page){
            return page*5 + index + 1
        }
    },
    mounted() {
        if(this.type === undefined)
        this.type = 'all'
    
        if(this.type === 'all')
            this.getContests()
        else {
            var jwt = this.$cookie.get('auth')
            this.getContests('user')
        }
    },
    watch: {
        local_contests: function() {
            this.local_contests.forEach(element => {
                // convert start_time from georgian to shamsi
                var start_time = element.start_time.replace('+', ' ')
                var start_time_moment = moment(start_time, 'YYYY-MM-DDTHH:mm:ss 04:30')
                
                var start_time = start_time_moment.locale('fa').format('LLLL')
                element.start_time_shamsi = start_time
                
                // convert end_time from georgian to shamsi
                var end_time = element.end_time.replace('+', ' ')
                var end_time_moment = moment(end_time, 'YYYY-MM-DDTHH:mm:ss 04:30')
                var end_time = end_time_moment.locale('fa').format('LLLL')
                element.end_time_shamsi = end_time

                // findout if contest is finished
                if(end_time_moment.format('x') < moment().format('x'))
                    element.is_finished = true
                else
                    element.is_finished = false


                // after local_contests are loaded get info of them
                this.getContestInfo(element.contestID)
            })
        }
    }
}
</script>

<style scoped>
/* font-awesome styling */
.fa-user-minus {
    color: red;
    cursor: pointer;
}
.fa-user-plus {
    color: var(--greenest);
    cursor: pointer;
}

.fa-user-plus:hover{
    color: white;
}

/* contests header */
.contests-view-header{
    direction: rtl;
    color: var(--dark-blue);
    background-color: var(--light-gray);
    border-radius: 5px;
    padding: 5px 20px;
    margin-bottom: 10px;
}
/* end of contests header */

/* contests */
.contests-view {
  font-size: 1.2rem;
}

.p-head {
  background-color: var(--light-gray);

  text-align: center;
  border-radius: 5px 5px 0 0;

  display: flex;
  flex-direction: row-reverse;
  padding: 5px;
}

.p-item {
  flex: 2;
}

.p-thin-item {
  flex: 1;
}

.p-wide-item {
  flex: 3;
}

.p-body {
  display: flex;
  flex-direction: column;
  color: white;
}

.p-body span {
    direction: rtl;
}

.p-row {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;

  text-align: center;

  background-color: var(--gray-blue);
  margin-top: 4px;
}

.p-row:last-child{
    border-radius: 0px 0px 5px 5px;   
}
.p-row a {
  text-decoration: none;
  color: var(--verylight-blue);
}

.p-row a:hover {
  color: var(--medium-light-blue);
}

/* pagination */
.pagination-container {
    direction: rtl;
    padding: 5px;

    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
}

.pagination-info {
    flex-basis: 30%;
    white-space: nowrap;
}

.pagination-btns-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.pagination-btn {
    padding: 2px 10px;
    background-color: var(--greenest);
    color: white;
    margin: 2px;
    cursor: pointer;
    border-radius: 5px;
}

.pagination-btn:hover {
    background-color: white;
    color: var(--greenest);
}

.pagination-arrow {
    margin: 1px 3px;
}

.pagination-btns-container .selected-number {
    background-color: white;
    color: var(--greenest);
    cursor: default;
}

.disabled-linkl {
    pointer-events: none;
}
.disabled{
    background-color: gray;
    cursor: default;
    color: white
}

.disabled:hover {
    background-color: gray;
    cursor: default;
    color: white
}
/* end of pagination */

/* end of contests */

</style>