<template>
  <div class="problems-view">
    <!-- problems-view-header -->
    <div class="problems-view-header">
        <span>سوالات</span>
    </div>
    <!-- end of problems-view-header -->
    
    <!-- problems table head -->
    <div class="p-head">
        <span class="p-thin-item">
            #
        </span>

        <span class="p-wide-item">
            عنوان
        </span>

        <span class="p-thin-item"></span>
    </div>
    <!-- end of problems table head -->

    <!-- problems table body -->
    <div class="p-body">
        <div class="p-row" v-for="(problem, index) in computeIndex" :key="problem.problemID">
            <span class="p-thin-item">{{ getIndexByPage(index, page) }}</span>

            <span class="p-wide-item">
                <router-link :to="problemLink(problem.problemID)"> {{ problem.name }}</router-link>
            </span>

            <span class="p-thin-item">
                <font-awesome-icon icon="check"></font-awesome-icon>
            </span>
        </div>

        <div class="p-row pagination-container">
            <div class="pagination-btns-container">
                <div class="pagination-btn pagination-arrow" :class="[(page + 1) * 5 + 1 > problems.length ? 'disabled': '']" @click="nextPage">
                    <font-awesome-icon icon="angle-right"></font-awesome-icon>
                </div>

                <div class="pagination-btn selected-number">{{ plus_one(page) }}</div>
                <div class="pagination-btn pagination-arrow" @click="pervPage" :class="{disabled: page === 0}">
                    <font-awesome-icon icon="angle-left"></font-awesome-icon>
                </div>
            </div>
        </div>
    </div>
    <!-- end of problems table body -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    name: "problems",
    data() {
        return {
            page: 0,
            local_problems: [],
            has_next: true
        }
    },
    props: {
        type: String
    },
    computed: {
        ...mapState(['problems', 'myProblems']),
        computeIndex(){
            if(this.type === 'all')
                this.local_problems = this.problems.slice(this.page*5, this.page*5+5)
            else if(this.type === 'user')
                this.local_problems = this.myProblems.slice(this.page*5, this.page*5+5)
            
            return this.local_problems
        }
    },
    methods: {
        ...mapActions(['getProblems']),
        nextPage(){
            if ((this.page +1)*5 + 1 <= this.problems.length)
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
    mounted(){
        if(this.type === undefined)
            this.type = 'all'
        
        if(this.type === 'all')
            this.getProblems()
        else{
            var jwt = this.$cookie.get('auth')
            this.getProblems('user')
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

/* problems header */
.problems-view-header{
    direction: rtl;
    color: var(--dark-blue);
    background-color: var(--light-gray);
    border-radius: 5px;
    padding: 5px 20px;
    margin-bottom: 10px;
}
/* end of problems header */

/* problems */
.problems-view {
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

/* end of problems */

</style>