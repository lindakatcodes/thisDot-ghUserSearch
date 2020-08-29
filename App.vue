<template>
  <div class="main-wrapper">
    <h1>GitHub User Search</h1>
    <section class="search-section">
      <Label for="search-bar"> 🔍 Who would you like to search for?</Label>
      <div class="form-wrapper">
        <input type="text" name="search-bar" class="search" placeholder="GitHub user name" v-model="queryText" v-on:keypress.enter="sendAPIcall()">
        <button class="search-button" type="button" v-on:click="sendAPIcall()">Search</button>
      </div>
    </section>
    <section class="results-wrapper">
      <h2 v-show="userCount > 0">Found {{ userCount }} results!</h2>
      <div class="result-item" v-for="person in users" :key="person.cursor">
        <img :src="person.node.avatarUrl" class="result-img">
        <div class="result-names">
          <a :href="person.node.url" class="display">{{ person.node.name }}</a>
          <a :href="person.node.url" class="username">{{ person.node.login }}</a>
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
          <div class="repo-wrapper" v-for="(repo, index) in person.node.pinnedItems.edges" :key=index>
            <a :href="repo.node.url" class="repo-name">{{ repo.node.name }}</a>
            <p class="repo-desc">{{ repo.node.description }}</p>
            <ul class="repo-lang" v-if="repo.node.languages.edges.length > 0">
              <li v-for="(lang, index) in repo.node.languages.edges" :key="index">{{ lang.node.name }}</li>
            </ul>
          </div>
        </div>
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
      userCount: 0
    }
  },
  methods: {
    // functionality for API call - sets GraphQL query, variables and header options, sends API call to GitHub, and updates data with the returned object
    sendAPIcall() {
      console.info('Prepping API call...')

      // gql query
      const gqlQuery = `query($query: String!) {
        search(query: $query, type: USER, first: 100) {
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
          this.userCount = userData.data.search.userCount;
          const results = userData.data.search.edges;
          this.users = results;
        })
        .catch(err => console.error(err));
    }
  }
})
</script>
