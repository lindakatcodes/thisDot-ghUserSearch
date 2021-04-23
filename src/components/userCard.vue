<template>
<transition name="fade">
  <div class="person-wrapper">
    <img :src="person.avatarUrl" class="person-img" :alt="`Profile photo of ${person.name}`">
    <div class="person-names">
      <a :href="person.url" class="username" target="_blank">{{ person.login }}</a>
      <a :href="person.url" v-if="person.name" class="display-name" target="_blank">{{ person.name }}</a>
    </div>
    <div class="person-about">
      <div class="person-stats">  
        <p class="hireable" v-if="person.isHireable"><img src="../../static/icons/exclamation-circle.svg" class="icons icons-hire" aria-hidden="true"> For Hire!</p>
        <p class="followers"><img src="../../static/icons/user.svg" class="icons icons-follow" aria-hidden="true"> <span class="count">{{ person.followers.totalCount }}</span> <span class="count-text">followers</span></p>
        <p class="starred"><img src="../../static/icons/star.svg" class="icons icons-star" aria-hidden="true"> <span class="count">{{ person.starredRepositories.totalCount }}</span> <span class="count-text"> starred repos</span></p>
      </div>
      <p class="person-bio">{{ person.bio }}</p>
    </div>
    <div class="person-repos" v-if="person.pinnedItems.edges.length > 0">
      <div class="repo-wrapper" v-for="(repo, index) in person.pinnedItems.edges" :key="index">
        <hr>
        <a :href="repo.node.url" class="repo-name" target="_blank">{{ repo.node.name }}</a>
        <p class="repo-desc">{{ repo.node.description }}</p>
        <ul class="repo-lang" v-if="repo.node.languages && repo.node.languages.edges.length > 0">
          <li v-for="(lang, index) in repo.node.languages.edges" :key="index">{{ lang.node.name }}</li>
        </ul>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
  export default {
    props: {
      person: Object,
    }
  }
</script>

<style scoped>
  /* Card wrapper */
  .person-wrapper {
    display: flex;
    flex-flow: column;
    width: 95%;
    margin: 0 auto 4%;
    padding: 1%;
    border: 1px solid var(--lightgray);
    border-radius: 5px;
    box-shadow: 1px 1px 6px 1px var(--lightgray);
  }

  /* Profile Photo */
  .person-img {
    width: 45%;
    margin: 1% auto 0;
    border-radius: 5px;
  }

  /* Names */
  .person-names {
    padding: 2%;
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  .username {
    text-decoration: underline;
    font-weight: bold;
    color: var(--lightblue);
  }

  .username:hover {
    color: var(--darkblue);
  }

  .display-name {
    text-decoration: none;
    margin-top: 1%;
    color: var(--lightgray);
  }

  /* About */
  .person-about {
    padding: 0 1%;
  }

  .person-stats {
    display: flex;
    justify-content: space-around;
    font-size: 0.9rem;
  }

  .person-stats p {
    width: 30%;
  }

  .hireable {
    padding-top: 1%;
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--green);
  }

  .icons-hire {
    width: 12%;
  }

  .followers, .starred {
    display: grid;
    grid-template-areas: 
    'icon count' 'text text';
    place-items: center;
  }
    
  .icons-follow {
    grid-area: icon;
    justify-self: end;
    width: 30%;
  }

  .icons-star {
    grid-area: icon;
    justify-self: end;
    width: 33%;
  }

  .count {
    grid-area: count;
    justify-self: start;
    margin-left: 3%;
    font-size: 1rem;
  }

  .count-text {
    grid-area: text;
  }

  .person-bio {
    height: 65px;
    margin: 1%;
    text-align: center;
  }

  /* Repositories */
  .person-repos {
    margin-top: 1%;
  }

  .repo-wrapper {
    margin: 0 2%;
  }

  .repo-name {
    margin-top: 1%;
    font-weight: bold;
    word-break: break-all;
    color: var(--lightblue);
  }

  .repo-name:hover {
    color: var(--darkblue);
  }

  .repo-desc {
    margin: 0;
  }

  .repo-lang {
    display: flex;
    justify-content: center;
    margin: 2% 0 4%;
    padding: 0;
    font-size: 0.9rem;
  }

  .repo-lang li {
    padding: 0.5% 4%;
    font-weight: bold;
    color: var(--green);
    list-style: none;
    border-radius: 5px;
  }

  hr {
    width: 75%;
    color: var(--lightgray);
  }

  /* Small screens */
  @media screen and (max-width: 620px) {
    .person-bio {
      height: auto;
      margin: 1% 2%;
    }

    .repo-wrapper {
      margin: 0 3%;
    }

    .repo-lang li {
      font-size: 1rem;
    }
  }

  /* Medium screens */
  @media screen and (min-width: 620px) and (max-width: 1280px) {
    .person-about {
      padding: 0 2%;
    }

    .hireable {
      font-size: 1.1rem;
    }

    .icons-hire {
      width: 14%;
    }

    .icons-follow {
      width: 37%;
    }

    .icons-star {
      width: 39%;
    }

    .person-bio {
      margin: 1% 2%;
    }

    .repo-wrapper {
      margin: 0 3%;
    }
  }
</style>