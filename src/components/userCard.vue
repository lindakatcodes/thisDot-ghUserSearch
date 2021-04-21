<template>
  <div class="result-item">
    <img :src="person.avatarUrl" class="result-img">
    <div class="result-names">
      <a :href="person.url" class="username" target="_blank">{{ person.login }}</a>
      <a :href="person.url" v-if="person.name" class="display" target="_blank">{{ person.name }}</a>
    </div>
    <div class="result-info">
      <div class="result-tidbits">  
        <p class="hireable" v-if="person.isHireable"><img src="../../static/icons/exclamation-circle.svg" class="icons-hire"> For Hire!</p>
        <p class="followers"><img src="../../static/icons/user.svg" class="icons-tidbits"> {{ person.followers.totalCount }} followers</p>
        <p class="starred"><img src="../../static/icons/star.svg" class="icons-tidbits"> {{ person.starredRepositories.totalCount }} starred repos</p>
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
</template>

<script>
  export default {
    props: {
      person: Object,
    }
  }
</script>

<style scoped>

</style>