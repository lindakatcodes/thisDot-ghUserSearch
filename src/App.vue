<template>
  <div class="main-wrapper">
    <h1>GitHub User Search</h1>
    <section class="search-section">
      <Label for="search-bar" class="search-bar-label"> <img src="../static/icons/search.svg" class="icons"> Who would you like to search for?</Label>
      <div class="search-wrapper">
        <input type="text" name="search-bar" class="search" placeholder="GitHub user name" v-model="queryText" v-on:keypress.enter="getInitData()">
        <button class="search-button" type="button" v-on:click="getInitData()">Search</button>
      </div>
    </section>
    <section class="results">
      <p class="loading" v-show="loading">Loading results...</p>
      <h2 v-show="noUsers">Sorry, it looks like there's no results for that search! Please try a new name or check your spelling.</h2>
      <h2 v-show="userCount > 0">Found {{ userCount }} results!</h2>
      <div class="results-wrapper">
        <div class="result-item" v-for="person in users" :key="person.cursor">
          <img :src="person.node.avatarUrl" class="result-img">
          <div class="result-names">
            <a :href="person.node.url" class="username" target="_blank">{{ person.node.login }}</a>
            <a :href="person.node.url" v-if="person.node.name" class="display" target="_blank">{{ person.node.name }}</a>
          </div>
          <div class="result-info">
            <div class="result-tidbits">  
              <p class="hireable" v-if="person.node.isHireable"><img src="../static/icons/exclamation-circle.svg" class="icons-hire"> For Hire!</p>
              <p class="followers"><img src="../static/icons/user.svg" class="icons-tidbits"> {{ person.node.followers.totalCount }} followers</p>
              <p class="starred"><img src="../static/icons/star.svg" class="icons-tidbits"> {{ person.node.starredRepositories.totalCount }} starred repos</p>
            </div>
            <p class="result-bio">{{ person.node.bio }}</p>
          </div>
          <div class="result-repos" v-if="person.node.pinnedItems.edges.length > 0">
            <div class="repo-wrapper" v-for="(repo, index) in person.node.pinnedItems.edges" :key="index">
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
        <button type="button" class="prev-arrow" v-if="pageInfo.prev" v-on:click="loadPage('backward')"><img src="../static/icons/chevron-left.svg" class="icons-arrows"> Prev Page</button>
        <button type="button" class="next-arrow" v-if="pageInfo.next" v-on:click="loadPage('forward')">Next Page <img src="../static/icons/chevron-right.svg" class="icons-arrows"></button>
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
      testData: {},
    }
  },
  methods: {
    // this call is for initial searches - will get the first 9 results for the query
    async getInitData() {
      this.loading = true;

      this.testData = await fetch(`.netlify/functions/githubApiCall?q=${this.queryText}`);
    },
    getPaginatedData(cursor, direction) {
      // this call works for prev/next searches, providing the cursor to grab the next or prev 9 results
      this.loading = true;
      //scrolls user to top of page
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      // if prev clicked, gets last 9 results before the first cursor
      
    },
    loadPage(direction) {
      // checks which direction we're going and sending in the correct cursor and direction
      if (direction === "backward") {
        this.getPaginatedData(this.pageInfo.firstUser, "backward")
      }
      else {
        this.getPaginatedData(this.pageInfo.lastUser, "forward")
      }
    }
  }
})
</script>
