<template>
  <div class="main-wrapper">
    <h1>GitHub User Search</h1>
    <section class="search-section">
      <Label for="search-bar" class="search-bar-label"> <img src="../static/icons/search.svg" class="icons"> Who would you like to search for?</Label>
      <div class="search-wrapper">
        <input type="text" name="search-bar" class="search" placeholder="GitHub user name" v-model="queryText" v-on:keypress.enter="getData(null, 'init')">
        <button class="search-button" type="button" v-on:click="getData(null, 'init')">Search</button>
      </div>
    </section>
    <section class="results">
      <p class="loading" v-show="loading">Loading results...</p>
      <h2 v-show="noUsers">Sorry, it looks like there's no results for that search! Please try a new name or check your spelling.</h2>
      <h2 v-show="userCount > 0">Found {{ userCount }} results!</h2>
      <div class="results-wrapper">
        <div class="result-item" v-for="person in users" :key="person.cursor">
          <img :src="person.avatarUrl" class="result-img">
          <div class="result-names">
            <a :href="person.url" class="username" target="_blank">{{ person.login }}</a>
            <a :href="person.url" v-if="person.name" class="display" target="_blank">{{ person.name }}</a>
          </div>
          <div class="result-info">
            <div class="result-tidbits">  
              <p class="hireable" v-if="person.isHireable"><img src="../static/icons/exclamation-circle.svg" class="icons-hire"> For Hire!</p>
              <p class="followers"><img src="../static/icons/user.svg" class="icons-tidbits"> {{ person.followers.totalCount }} followers</p>
              <p class="starred"><img src="../static/icons/star.svg" class="icons-tidbits"> {{ person.starredRepositories.totalCount }} starred repos</p>
            </div>
            <p class="result-bio">{{ person.bio }}</p>
          </div>
          <div class="result-repos" v-if="person.pinnedItems.edges.length > 0">
            <div class="repo-wrapper" v-for="(repo, index) in person.pinnedItems.edges" :key="index">
              <a :href="repo.node.url" class="repo-name" target="_blank">{{ repo.node.name }}</a>
              <p class="repo-desc">{{ repo.node.description }}</p>
              <ul class="repo-lang" v-if="repo.node.languages && repo.node.languages.edges.length > 0">
                <li v-for="(lang, index) in repo.node.languages.edges" :key="index">{{ lang.node.name }}</li>
              </ul>
              <hr>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination" v-if="pageInfo.prev || pageInfo.next">
        <button type="button" class="prev-arrow" v-if="pageInfo.prev" v-on:click="getData(pageInfo.firstUser, 'backward')"><img src="../static/icons/chevron-left.svg" class="icons-arrows"> Prev Page</button>
        <button type="button" class="next-arrow" v-if="pageInfo.next" v-on:click="getData(pageInfo.lastUser, 'forward')">Next Page <img src="../static/icons/chevron-right.svg" class="icons-arrows"></button>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
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
    // call GH GraphQL API to get user data
    async getData(cursor, direction) {
      this.loading = true;
      this.clearData();

      //scrolls user to top of page
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });

      // determine which type of query params we need to send our gql query
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
      console.log(results)
      const legitUsers = results.filter(user => {
        return Object.keys(user).length > 0;
      });

      // update userCount, remove loading state, then show users
      this.userCount -= legitUsers.length;
      this.loading = false;
      this.users = legitUsers;
    },
    setQueryType(cursor, direction) {   
      // depending on our directional navigation, return the proper query variables we need
      const firstQuery = `first: 9`;
      const backQuery = `last: 9, before: "${cursor}"`;
      const fwdQuery = `first: 9, after: "${cursor}"`;

      switch(direction) {
        case "init":
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
