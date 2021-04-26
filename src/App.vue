<template>
  <main class="main-wrapper">
    <h1>GitHub User Search</h1>
    <section class="search-wrapper">
        <Label for="search-bar" class="search-label"> <img src="../static/icons/search.svg" class="icons" aria-hidden="true"> Who would you like to search for?</Label>
        <input type="text" name="search-bar" class="search-input" placeholder="GitHub user name" v-model="queryText" v-on:keypress.enter="getData(null, 'first')">
        <button class="search-button" type="button" v-on:click="getData(null, 'first')">Search</button>
    </section>
    <section class="results">
      <p class="loading" v-show="loading">Loading results...</p>
      <h2 v-show="noUsers">Sorry, it looks like there's no results for that search! Please try a new name or check your spelling.</h2>
      <h2 v-show="userCount > 0">Found {{ userCount }} results!</h2>
      <Sample v-if="showSamples"></Sample>
      <div class="results-wrapper">
        <UserCard v-for="person in users" :key="person.cursor" :person="person" />
      </div>
    </section>
    <section class="navigation" v-if="pageInfo.prev || pageInfo.next">
      <button type="button" class="prev-arrow" v-if="pageInfo.prev" v-on:click="getData(pageInfo.firstUser, 'backward')"><img src="../static/icons/chevron-left.svg" class="icons icons-arrows" aria-hidden="true"> Prev Page</button>
      <button type="button" class="next-arrow" v-if="pageInfo.next" v-on:click="getData(pageInfo.lastUser, 'forward')">Next Page <img src="../static/icons/chevron-right.svg" class="icons icons-arrows" aria-hidden="true"></button>
    </section>
  </main>
</template>

<script>
import Vue from "vue";
import UserCard from "./components/userCard.vue";
import Sample from "./components/sample.vue";

export default Vue.extend({
  components: {
    UserCard,
    Sample,
  },
  data() {
    return {
      showSamples: true,
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
    clearData() {
      this.showSamples = false;
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
    async getData(cursor, direction) {
      this.loading = true;

      // only needed if we already have data showing
      if (direction !== 'first') {
        window.scroll({
          top: 0,
        left: 0,
        behavior: 'smooth'
      });
      }

      // only desired if we're performing a new search
      if (direction === 'first') {
        this.clearData();
      }

      this.queryType = this.setQueryType(cursor, direction);

      const userData = await fetch(`https://github-search-td.netlify.app/.netlify/functions/githubApiCall?q=${this.queryText}&type=${this.queryType}`).then(res => res.json());

      this.userCount = userData.overview.userCount;
      
      // provides user with informational text if no results found, so it's different from a starting screen
      if (this.userCount === 0) {
        this.noUsers = true;
        return;
      }

      const pageData = userData.overview.pageInfo;
      this.pageInfo.prev = pageData.hasPreviousPage;
      this.pageInfo.next = pageData.hasNextPage;
      this.pageInfo.firstUser = pageData.startCursor;
      this.pageInfo.lastUser = pageData.endCursor;

      // to keep userCards more interesting, filtered out any items that only have a name and nothing else
      const results = userData.usersInfo;
      const legitUsers = results.filter(user => {
        return Object.keys(user).length > 0;
      });

      this.userCount -= legitUsers.length;
      this.loading = false;
      this.users = legitUsers;
    },
    // allows use of the same graphql query, just adding in the first / last and before / after params as necessary, depending on the type of search
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