const fetch = require('node-fetch');

const gqlQuery = (type) => `query($query: String!) {
  search(query: $query, type: USER, ${type}) {
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

exports.handler = async function (event) {
  const variables = {
    query: event.queryStringParameters.q
  }

  const endpoint = 'https://api.github.com/graphql';
  
  const options = {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.TOKEN}`
    },
    body: JSON.stringify({ query: gqlQuery(event.queryStringParameters.type), variables })
  };

  const userData = await fetch(endpoint, options)
    .then(res => res.json())
    .then(users => {
      const fullData = users.data.search;
      const overview = {
        userCount: fullData.userCount,
        pageInfo: {...fullData.pageInfo}
      }

      const usersInfo = users.data.search.edges.map(user => user.node);

      return {overview, usersInfo};
    })
    .catch(err => console.error(err))

  return {
    statusCode: 200,
    body: JSON.stringify(userData),
  }
}