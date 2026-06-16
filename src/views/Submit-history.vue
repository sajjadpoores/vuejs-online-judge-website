<template>
  <div class="submit-history-view">
    <!-- submit-history-view-header -->
    <div class="submit-history-view-header">
        <span>تاریخچه ارسال پاسخ</span>
    </div>

    <!-- submit-history table head -->
    <div class="p-head">
        <span class="p-thin-item">
            #
        </span>

        <span class="p-item">
          سوال
        </span>

        <span class="p-thin-item">
          وضعیت
        </span>

        <span class="p-item">
          تاریخ ارسال
        </span>
    </div>
    <!-- end of submit-history table head -->

    <!-- submit-history table body -->
    <div class="p-body">
        <div class="p-row" v-for="(submission, index) in computeIndex" :key="submission.submissionID">
            <span class="p-thin-item">{{ getIndexByPage(index, page) }}</span>

            <span class="p-item">
            <a :href="problemLink(submission.problemID)">{{ submission.problem_info.name }}</a></span
            >

            <span :class="['p-thin-item', resultLabel(submission.result)]">
                {{ submission.result.judgement_status }}
            </span>

            <span class="p-item">
                {{ submission.sent_time }}
            </span>
        </div>

        <div class="p-row pagination-container">
            <div class="pagination-btns-container">
                <div class="pagination-btn pagination-arrow" :class="[(page + 1) * 5 + 1 > true_submissions.length ? 'disabled': '']" @click="nextPage">
                    <font-awesome-icon icon="angle-right"></font-awesome-icon>
                </div>

                <div class="pagination-btn selected-number">{{ plus_one(page) }}</div>
                <div class="pagination-btn pagination-arrow" @click="pervPage" :class="{disabled: page === 0}">
                    <font-awesome-icon icon="angle-left"></font-awesome-icon>
                </div>
            </div>
        </div>
    </div>
    <!-- end of submit-history table body -->
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import moment from 'moment-jalaali'
export default {
    name: "submit-history",
    data() {
      return {
        submissions: [],
        true_submissions: [],
        parted_submissions: [],
        page: 0,
      }
    },
    methods: {
      ...mapActions(['getProblems']),
      getSubmissionResult(submission) {
        var jwt = this.$cookie.get('auth')
        axios.get(this.backendUrl + '/problem/' + submission.problemID + '/submissions/' + submission.submissionID, {
          headers: {
            Authorization: jwt
          }
        }).then(response => {
          submission.result = response.data
          var problem = this.problems.find(obj => {
            return obj.problemID === submission.problemID
          })

          if(problem)
            submission.problem_info = problem

          // convert the submission datetime to persian
          var sent_moment = moment(submission.second, 'YYYY-MM-DD-HH-mm-ss')
          var sent_time = sent_moment.locale('fa').format('LLLL')
          submission.sent_time = sent_time

          this.true_submissions.push(submission)
        }).catch(error => {
          // console.log(error.response)
        })
      },
      resultLabel(result) {
        if(result.judgement_status === 'WA')
          return 'wrong-answer'
        else if(result.judgement_status === 'CE')
          return 'compile-error'
        else if(result.judgement_status === 'AC')
          return 'accepted'
      },
      nextPage(){
        if ((this.page + 1) * 5 + 1 <= this.true_submissions.length)
          this.page++
      },
      pervPage(){
          if(this.page >= 1)
              this.page--
      },
      problemLink(id){
          return `/problem/${id}`
      },
      plus_one(index){
          return index + 1
      },
      getIndexByPage(index, page){
          return page*5 + index + 1
      }
    },
    computed: {
      ...mapState(['backendUrl', 'problems']),
      computeIndex() {
          this.parted_submissions = this.true_submissions.slice(this.page*5, this.page*5+5)
          return this.parted_submissions
      }
    },
    mounted() {
      var jwt = this.$cookie.get('auth')
      axios.get(this.backendUrl + '/user/submission/individual', {
        headers: {
          Authorization: jwt
        }
      }).then(response => {
        this.submissions = response.data
      }).catch(error => {
        // console.log(error.response)
      })
    },
    watch: {
      submissions: function() {
        // get all problems
        this.getProblems().then(done => {
          // get submissions results
          this.submissions.forEach(element => {
              this.getSubmissionResult(element)
          })
        })
      }
    }
}
</script>

<style scoped>
/* font-awesome styling */
.fa-check {
  color: var(--greenest);
}

.fa-times {
  color: red;
}

/* submit-history header */
.submit-history-view-header{
    direction: rtl;
    color: var(--dark-blue);
    background-color: var(--light-gray);
    border-radius: 5px;
    padding: 5px 20px;
    margin-bottom: 20px;
}
/* end of submit-history header */

/* submit-history */
.submit-history-view {
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
    cursor: default !important;
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

/* submit statuses */
.wrong-answer {
  background-color: red;
  border-radius: 5px;
}

.accepted {
  background-color: var(--greenest);
  border-radius: 5px;
}

.compile-error {
  background-color: orange;
  border-radius: 5px;
}
/* end of submit statuses */
/* end of submit-history */


</style>