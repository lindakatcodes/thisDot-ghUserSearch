(function () {
  'use strict';

  // Using dotenv to access personal GitHub auth token; token is stored on Netlify for production site
  const dotenv = require('dotenv/config');

  // variables for DOM elements I'll need
  const searchText = document.querySelector('.search');
  const searchButton = document.querySelector('.send-button');
  const resultsBlock = document.querySelector('.results-wrapper');

  /* result names:
    result-img
    result-name
    result-username
    result-bio
    result-repos
    */

  // will trigger the API call if user presses enter in input box
  searchText.addEventListener('keypress', (e) => {
    debugger;
    if (e.key === 'Enter') {
      sendAPIcall();
    }
  });

  // of if user clicks the search button, will also trigger API call
  searchButton.addEventListener('click', () => sendAPIcall());

  // functionality for API call - sets GraphQL query and header options, sends API call to GitHub, and preps the result for handling in the browser
  function sendAPIcall() {
    console.info('Prepping API call...');
    // gql query
  const gqlQuery = `
{
  search(query: "tom", type: USER, first: 100) {
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
          avatarUrl
          name
          login
          bio
          isHireable
          url
          followers {
            totalCount
          }
          pinnedItems(first: 6) {
            edges {
              node {
                ... on Repository {
                  name
                  description
                  homepageUrl
                  stargazers {
                    totalCount
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
`;

  const endpoint = 'https://api.github.com/graphql';

  const options = {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.TOKEN}`
    },
    body: JSON.stringify({ gqlQuery })
  };

    fetch(endpoint, options)
    .then(res => res.json())
    .then(userData => {
      const data = document.createElement('div');
      console.log(userData);
    })
    .catch(err => console.error(err));
  }

}());
