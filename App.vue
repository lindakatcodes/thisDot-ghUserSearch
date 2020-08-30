<template>
  <div class="main-wrapper">
    <h1>GitHub User Search</h1>
    <section class="search-section">
      <Label for="search-bar"> 🔍 Who would you like to search for?</Label>
      <div class="search-wrapper">
        <input type="text" name="search-bar" class="search" placeholder="GitHub user name" v-model="queryText" v-on:keypress.enter="getInitData()">
        <button class="search-button" type="button" v-on:click="getInitData()">Search</button>
      </div>
    </section>
    <section class="results-wrapper">
      <p class="loading" v-show="loading">Loading results...</p>
      <h2 v-show="noUsers">Sorry, it looks like there's no results for that search! Please try a new name.</h2>
      <h2 v-show="userCount > 0">Found {{ userCount }} results!</h2>
      <div class="result-item" v-for="person in users" :key="person.cursor">
        <img :src="person.node.avatarUrl" class="result-img">
        <div class="result-names">
          <a :href="person.node.url" class="username">{{ person.node.login }}</a>
          <a :href="person.node.url" v-if="person.node.name" class="display">{{ person.node.name }}</a>
        </div>
        <div class="result-info">
          <div class="result-tidbits">  
          <p class="hireable" v-if="person.node.isHireable">✨For Hire!</p>
            <p class="followers">👩‍🎤{{ person.node.followers.totalCount }} followers</p>
            <p class="starred">⭐{{ person.node.starredRepositories.totalCount }} starred repos</p>
          </div>
          <p class="result-bio">{{ person.node.bio }}</p>
        </div>
        <div class="result-repos" v-if="person.node.pinnedItems.edges.length > 0">
          <div class="repo-wrapper" v-for="(repo, index) in person.node.pinnedItems.edges" :key="index">
            <a :href="repo.node.url" class="repo-name">{{ repo.node.name }}</a>
            <p class="repo-desc">{{ repo.node.description }}</p>
            <ul class="repo-lang" v-if="repo.node.languages && repo.node.languages.edges.length > 0">
              <li v-for="(lang, index) in repo.node.languages.edges" :key="index">{{ lang.node.name }}</li>
            </ul>
            <hr>
          </div>
        </div>
      </div>
      <div class="pagination" v-if="pageInfo.prev || pageInfo.next">
        <button type="button" class="prev-arrow" v-if="pageInfo.prev" v-on:click="loadPage('backward')">Prev Page</button>
        <button type="button" class="next-arrow" v-if="pageInfo.next" v-on:click="loadPage('forward')">Next Page</button>
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
    }
  },
  methods: {
    getInitData() {
      this.loading = true;

      const gqlQuery = `query($query: String!) {
        search(query: $query, type: USER, first:10) {
          userCount
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              ... on User {
                name
                login
                bio
                url
                avatarUrl
                isHireable
                followers {
                  totalCount
                }
                starredRepositories {
                  totalCount
                }
                pinnedItems(first: 3) {
                  edges {
                    node {
                      ... on Repository {
                        name
                        description
                        url
                        languages(first:3, orderBy: {field: SIZE, direction: DESC} ) {
                          edges {
                            node {
                              name
                            }
                          }
                        }
                      }
                      ... on Gist {
                        name
                        description
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`

      const variables = {
        query: this.queryText
      }

      const endpoint = 'https://api.github.com/graphql';

      const options = {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.TOKEN}`
        },
        body: JSON.stringify({ query: gqlQuery, variables })
      };

      fetch(endpoint, options)
        .then(res => res.json())
        .then(userData => {
          console.log(userData);
          // clear any existing data
          this.users = {},
          this.noUsers = false;
          this.userCount = 0;
          this.pageInfo = {
            prev: false,
            next: false,
            firstUser: '',
            lastUser: '',
          };

          const info = userData.data.search;
          if (info.userCount === 0) {
            this.noUsers = true;
            return;
          }
          const pageData = info.pageInfo;
  
          this.pageInfo.prev = pageData.hasPreviousPage;
          this.pageInfo.next = pageData.hasNextPage;
          this.pageInfo.firstUser = pageData.startCursor;
          this.pageInfo.lastUser = pageData.endCursor;

          const results = userData.data.search.edges;
          const legitUsers = results.filter(user => {
            const userObj = user.node;
            return Object.keys(userObj).length > 0;
          });
          this.userCount = info.userCount - legitUsers.length;
          this.loading = false;
          this.users = legitUsers;
        })
        .catch(err => console.error(err))
    },
    getPaginatedData(cursor, direction) {
      console.log('getting page data')
      this.loading = true;
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });

      const backQuery = `query($query: String!) {
        search(query: $query, type: USER, last: 10, before: "${cursor}") {`

      const fwdQuery = `query($query: String!) {
        search(query: $query, type: USER, first: 10, after: "${cursor}") {`
      
      const gqlQuery = `${direction === "forward" ? fwdQuery : backQuery}
          userCount
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              ... on User {
                name
                login
                bio
                url
                avatarUrl
                isHireable
                followers {
                  totalCount
                }
                starredRepositories {
                  totalCount
                }
                pinnedItems(first: 3) {
                  edges {
                    node {
                      ... on Repository {
                        name
                        description
                        url
                        languages(first:3, orderBy: {field: SIZE, direction: DESC} ) {
                          edges {
                            node {
                              name
                            }
                          }
                        }
                      }
                      ... on Gist {
                        name
                        description
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`

      const variables = {
        query: this.queryText,
      };

      const endpoint = 'https://api.github.com/graphql';

      const options = {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.TOKEN}`
        },
        body: JSON.stringify({ query: gqlQuery, variables })
      };

      fetch(endpoint, options)
        .then(res => res.json())
        .then(userData => {
          // clear any existing data
          this.users = {},
          this.userCount = 0;
          this.pageInfo = {
            prev: false,
            next: false,
            firstUser: '',
            lastUser: '',
          };

          const pageData = userData.data.search.pageInfo;
  
          this.pageInfo.prev = pageData.hasPreviousPage;
          this.pageInfo.next = pageData.hasNextPage;
          this.pageInfo.firstUser = pageData.startCursor;
          this.pageInfo.lastUser = pageData.endCursor;

          const results = userData.data.search.edges;
          const legitUsers = results.filter(user => {
            const userObj = user.node;
            return Object.keys(userObj).length > 0;
          });
          this.loading = false;
          this.users = legitUsers;
        })
        .catch(err => console.error(err));
    },
    loadPage(direction) {
      console.log('load page function');
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
