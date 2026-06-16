<template>
  <div class="contest-view">
    <!-- contest-view-header -->
    <div class="contest-view-header">
        <span>مسابقه</span>
    </div>
    <!-- end of contest-view-header -->
    
    <!-- contest info table head -->
    <div class="p-head">
        <span class="p-wide-item">
            زمان شروع
        </span>

        <span class="p-item">
            زمان باقی مانده
        </span>

        <span class="p-item" v-if="!is_finished && profileDetail.username != contest_info.author">
            انصراف
        </span>

        <span class="p-item" v-if="profileDetail.username === contest_info.author">
            حذف
        </span>
    </div>
    <!-- end of contest info table head -->

    <!-- contest table body -->
    <div class="p-body">
        <div class="p-row">
            <span class="p-wide-item">
              {{ contest_info.start_time_shamsi }}
            </span>

            <span class="p-item">
              {{ time_status }}
            </span>

            <span class="p-item" v-if="!is_finished && profileDetail.username != contest_info.author">
              <font-awesome-icon icon="sign-out-alt" @click="leaveContest"></font-awesome-icon>
            </span>

            <span class="p-item" v-if="profileDetail.username === contest_info.author && contest_info && profileDetail">
              <font-awesome-icon icon="trash" @click="deleteContest"></font-awesome-icon>
            </span>
        </div>
    </div>
    <!-- end of contest table body -->

    <!-- contest options table head -->
    <div class="p-head">
        <span class="p-wide-item">
            اسکوربورد
        </span>

        <span class="p-wide-item">
            ارسال ها
        </span>
    </div>
    <!-- end of contest options table head -->

    <!-- contest options table body -->
    <div class="p-body">
        <div class="p-row">
            <span class="p-wide-item">
              <a :href="getScoreBaordLink()" target="_blank">مشاهده</a>
            </span>

            <span class="p-wide-item">
              <a :href="getScoreBaordLink()" target="_blank">مشاهده</a>
            </span>
        </div>
    </div>
    <!-- end of contest table body -->

    <!-- contest table head -->
    <div class="p-head">
        <span class="p-thin-item">
            #
        </span>

        <span class="p-wide-item">
            عنوان
        </span>

        <span class="p-thin-item">
          وضعیت
        </span>

        <span class="p-thin-item">
          مشاهده
        </span>
    </div>
    <!-- end of contest table head -->

    <!-- contest table body -->
    <div class="p-body">
        <div class="p-row" v-for="(problem, index) in computeIndex" :key="problem.problemID">
            <span class="p-thin-item">{{ getIndexByPage(index, page) }}</span>

            <span class="p-wide-item">
                <router-link :to="problemLink(problem.problemID)"> {{ problem.name }}</router-link>
            </span>

            <span class="p-thin-item">
                <font-awesome-icon icon="check"></font-awesome-icon>
            </span>

            <span class="p-thin-item">
                <font-awesome-icon icon="angle-left"></font-awesome-icon>
            </span>
        </div>

        <div class="p-row pagination-container">
            <div class="pagination-btns-container">
                <div class="pagination-btn pagination-arrow" :class="[(page + 1) * 5 + 1 > local_problems.length ? 'disabled': '']" @click="nextPage">
                    <font-awesome-icon icon="angle-right"></font-awesome-icon>
                </div>

                <div class="pagination-btn selected-number">{{ plus_one(page) }}</div>
                <div class="pagination-btn pagination-arrow" @click="pervPage" :class="{disabled: page === 0}">
                    <font-awesome-icon icon="angle-left"></font-awesome-icon>
                </div>
            </div>
        </div>
    </div>
    <!-- end of contest table body -->
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import router from '@/router.js'
import moment from 'moment-jalaali'
export default {
    name: "contest",
    data() {
        return {
            contest_info: {},
            local_problems: [],
            parted_local_problems: [],
            time_status: 0,
            is_finished: false,
            page: 0
        }
    },
    methods: {
        ...mapActions(['getProblems']),
        findProblemFromProblems(id){
            for(var i=0; i< this.problems.length; i++){
                if(this.problems[i].problemID === id) {
                    this.local_problems.push(this.problems[i])
                    break;
                }
            }
        },
        leaveContest(){
            var cid = this.$route.params.cid
            var jwt = this.$cookie.get('auth')
            
            axios.patch(this.backendUrl + '/contest/' + cid, {}, {
                headers: {
                    Authorization: jwt
                }
            }).then(response => {
                router.push({name: 'contests', params: {type: 'all'}})

            }).catch(error => {
                console.log(error)
            })
        },
        deleteContest() {
            var cid = this.$route.params.cid
            var jwt = this.$cookie.get('auth')

            axios.delete(this.backendUrl + '/contest/' + cid, {
                headers: {
                    Authorization: jwt
                }
            }).then(response => {
                router.push({name: 'contests', params: {type: 'all'}})

            }).catch(error => {
                console.log(error)
            })
        },
        countTimeStatus() {
            // if contest_info end time moment and start time moment are loaded
            if(this.contest_info.end_time_moment && this.contest_info.start_time_moment) {
                
                if(this.contest_info.start_time_moment.format('x') > moment().locale('fa').format('x')){
                    this.time_status = 'کانتست شروع نشده است'
                    return
                }
                else if (this.contest_info.end_time_moment.format('x') > moment().locale('fa').format('x')) {
                    var duration = moment.duration(this.contest_info.end_time_moment.diff(moment().locale('fa')))
                    var seconds = duration.asSeconds()%60
                    var mins = duration.asMinutes()%60
                    var hours = duration.asHours()%24
                    var days = duration.asDays()
                    this.time_status = parseInt(days) + 'روز و ' + parseInt(hours)+ ':' + parseInt(mins) + ':' + parseInt(seconds)
                    return
                }
                else {
                    this.time_status = 'زمان کانتست به پایان رسیده است'
                    this.is_finished = true
                    return
                }
            }
            this.time_status = 0
            return 
        },
        getScoreBaordLink(){
            var cid = this.$route.params.cid
            return '/contest/' + cid + '/scoreboard'
        },
        nextPage(){
            if ((this.page +1)*5 + 1 <= this.local_problems.length)
                this.page++
        },
        pervPage(){
            if(this.page >= 1)
                this.page--
        },
        problemLink(id){
            var cid = this.$route.params.cid
            return `/contest/${cid}/problem/${id}`
        },
        plus_one(index){
            return index + 1
        },
        getIndexByPage(index, page){
            return page * 5 + index + 1
        }
    },
    computed: {
        ...mapState(['backendUrl', 'problems', 'profileDetail']),
        computeIndex(){
            this.parted_local_problems = this.local_problems.slice(this.page*5, this.page*5+5)
            
            return this.parted_local_problems
        }
    },
    mounted() {
        var jwt = this.$cookie.get('auth')

        axios.get(this.backendUrl + '/contest/' + this.$route.params.cid, {
            headers: {
                Authorization: jwt
            }
        }).then(response => {
            // success
            this.contest_info = response.data.body

            // get start time and convert it
            var start_time = this.contest_info.start_time.replace('+', ' ')
            var start_time_moment = moment(start_time, 'YYYY-MM-DDTHH:mm:ss 04:30')
            var start_time = start_time_moment.locale('fa').format('LLLL')
            this.contest_info.start_time_shamsi = start_time
            this.contest_info.start_time_moment = start_time_moment

            // convert end_time from georgian to shamsi
            var end_time = this.contest_info.end_time.replace('+', ' ')
            var end_time_moment = moment(end_time, 'YYYY-MM-DDTHH:mm:ss 04:30')
            var end_time = end_time_moment.locale('fa').format('LLLL')
            this.contest_info.end_time_shamsi = end_time
            this.contest_info.end_time_moment = end_time_moment

            // set interval to run countTimeStatus method every second
            window.setInterval(this.countTimeStatus, 1000)

        }).catch(error => {
            // fail
            console.log(error)
        })
    },
    watch: {
        contest_info: function() {
            if(this.contest_info.problem) {
                this.getProblems().then(done => {
                    this.contest_info.problem.forEach(element => {
                        this.findProblemFromProblems(element.id)
                    })
                })
            }
        }
    }
}
</script>

<style scoped>
/* font-awesome styling */
.fa-trash {
    color: tomato;
    cursor: pointer;
}

.fa-sign-out-alt {
    color: red;
    font-size: 1.4rem;
    transform: scaleX(-1);
    cursor: pointer;
}

.fa-check {
  color: var(--greenest);
}

.fa-times {
  color: red;
}

.fa-angle-left {
  color: var(--verylight-blue);
  cursor: pointer;
}
/* contest header */
.contest-view-header{
    direction: rtl;
    color: var(--dark-blue);
    background-color: var(--light-gray);
    border-radius: 5px;
    padding: 5px 20px;
    margin-bottom: 20px;
}
/* end of contest header */

/* contest */
.contest-view {
  font-size: 1.2rem;
}

.p-head {
  background-color: var(--light-gray);

  text-align: center;
  border-radius: 5px 5px 0 0;

  display: flex;
  flex-direction: row-reverse;
  padding: 5px;
  margin-top: 10px;
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
  margin-bottom: 20px;
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

/* end of contest */

</style>