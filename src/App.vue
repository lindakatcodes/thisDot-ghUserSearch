<template>
  <main class="main-wrapper">
    <h1>GitHub User Search</h1>
    <section class="search-wrapper">
        <Label for="search-bar" class="search-label"> <img src="../static/icons/search.svg" class="icons"> Who would you like to search for?</Label>
        <input type="text" name="search-bar" class="search-input" placeholder="GitHub user name" v-model="queryText" v-on:keypress.enter="getData(null, 'first')">
        <button class="search-button" type="button" v-on:click="getData(null, 'first')">Search</button>
    </section>
    <section class="results">
      <p class="loading" v-show="loading">Loading results...</p>
      <h2 v-show="noUsers">Sorry, it looks like there's no results for that search! Please try a new name or check your spelling.</h2>
      <h2 v-show="userCount > 0">Found {{ userCount }} results!</h2>
      <div class="results-wrapper">
        <UserCard v-for="person in users" :key="person.cursor" :person="person" />
      </div>
    </section>
    <section class="navigation" v-if="pageInfo.prev || pageInfo.next">
      <button type="button" class="prev-arrow" v-if="pageInfo.prev" v-on:click="getData(pageInfo.firstUser, 'backward')"><img src="../static/icons/chevron-left.svg" class="icons icons-arrows"> Prev Page</button>
      <button type="button" class="next-arrow" v-if="pageInfo.next" v-on:click="getData(pageInfo.lastUser, 'forward')">Next Page <img src="../static/icons/chevron-right.svg" class="icons icons-arrows"></button>
    </section>
  </main>
</template>

<script>
import Vue from "vue";
import UserCard from "./components/userCard.vue";

export default Vue.extend({
  components: {
    UserCard,
  },
  data() {
    return {
      queryText: '',
      queryType: '',
      users: {},
      noUsers: false,
      userCount: 0,
      loading: false,
      pageInfo: {
        prev: false,
        next: false,
        firstUser: '',
        lastUser: '',
      },
    }
  },
  methods: {
    // clear any previously set data, to ensure we don't get mixed up info
    clearData() {
      this.queryType = '';
      this.users = {};
      this.noUsers = false;
      this.userCount = 0;
      this.pageInfo = {
        prev: false,
        next: false,
        firstUser: '',
        lastUser: '',
      };
    },
    // call GH GraphQL API to get user data & update state
    async getData(cursor, direction) {
      this.loading = true;

      //if this is a paginated call, scroll user to top of page
      if (direction !== 'first') {
        window.scroll({
          top: 0,
        left: 0,
        behavior: 'smooth'
      });
      }

      // if this is a first call, clear any previous data
      if (direction === 'first') {
        this.clearData();
      }

      // determine which type of query params we need to send our gql query - is this the first search, or are we paginating forwards or backwards?
      this.queryType = this.setQueryType(cursor, direction);

      // make the actual API call
      const userData = await fetch(`.netlify/functions/githubApiCall?q=${this.queryText}&type=${this.queryType}`).then(res => res.json());

      // set the number of users
      this.userCount = userData.overview.userCount;
      
      // logic so if no results return, user will see informational data
      if (this.userCount === 0) {
        this.noUsers = true;
        return;
      }

      // set info for cursors and pagination
      const pageData = userData.overview.pageInfo;
      this.pageInfo.prev = pageData.hasPreviousPage;
      this.pageInfo.next = pageData.hasNextPage;
      this.pageInfo.firstUser = pageData.startCursor;
      this.pageInfo.lastUser = pageData.endCursor;

      // filtering user data to remove anyone who has a name but nothing else
      const results = userData.usersInfo;
      const legitUsers = results.filter(user => {
        return Object.keys(user).length > 0;
      });

      // update userCount, remove loading state, then show users
      this.userCount -= legitUsers.length;
      this.loading = false;
      this.users = legitUsers;
    },
    // determines what needs to be added to the search query to get the right results
    setQueryType(cursor, direction) {   
      const firstQuery = `first: 9`;
      const backQuery = `last: 9, before: "${cursor}"`;
      const fwdQuery = `first: 9, after: "${cursor}"`;

      switch(direction) {
        case "first":
          return firstQuery;
          break;
        case "forward":
          return fwdQuery;
          break;
        case "backward":
          return backQuery;
          break;
        default:
          return firstQuery;
      }
    },
  }
})
</script>