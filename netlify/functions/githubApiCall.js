const fetch = require('node-fetch');

const gqlQuery = `query($query: String!) {
  search(query: $query, type: USER, first:9) {
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
    body: JSON.stringify({ query: gqlQuery, variables })
  };

  const userData = await fetch(endpoint, options)
    .then(res => res.json())
    .then(users => {
      users.data.search
    })

  console.log(userData);

  return {
    statusCode: 200,
    body: JSON.stringify(userData)
  }
}





// 
    // clear any existing data, if another search had been done previously
    // this.users = {},
    // this.noUsers = false;
    // this.userCount = 0;
    // this.pageInfo = {
    //   prev: false,
    //   next: false,
    //   firstUser: '',
    //   lastUser: '',
    // };

    // const info = userData.data.search;
    // // logic so if no results return, user will see informational data
    // if (info.userCount === 0) {
    //   this.noUsers = true;
    //   return;
    // }

    // const pageData = info.pageInfo;
    // this.pageInfo.prev = pageData.hasPreviousPage;
    // this.pageInfo.next = pageData.hasNextPage;
    // this.pageInfo.firstUser = pageData.startCursor;
    // this.pageInfo.lastUser = pageData.endCursor;

    // // storing user results in a variable, then filtering it to remove anyone who has a name but nothing else
    // const results = userData.data.search.edges;
    // const legitUsers = results.filter(user => {
    //   const userObj = user.node;
    //   return Object.keys(userObj).length > 0;
    // });
    // this.userCount = info.userCount - legitUsers.length;
    // this.loading = false;
    // this.users = legitUsers;
  // })
  // .catch(err => console.error(err))

  // const backQuery = `query($query: String!) {
  //   search(query: $query, type: USER, last: 9, before: "${cursor}") {`
  // //if next clicked, gets first 9 results after the last cursor
  // const fwdQuery = `query($query: String!) {
  //   search(query: $query, type: USER, first: 9, after: "${cursor}") {`
  
  // const gqlQuery = `${direction === "forward" ? fwdQuery : backQuery}
  //     userCount
  //     pageInfo {
  //       startCursor
  //       endCursor
  //       hasNextPage
  //       hasPreviousPage
  //     }
  //     edges {
  //       cursor
  //       node {
  //         ... on User {
  //           name
  //           login
  //           bio
  //           url
  //           avatarUrl
  //           isHireable
  //           followers {
  //             totalCount
  //           }
  //           starredRepositories {
  //             totalCount
  //           }
  //           pinnedItems(first: 3) {
  //             edges {
  //               node {
  //                 ... on Repository {
  //                   name
  //                   description
  //                   url
  //                   languages(first:3, orderBy: {field: SIZE, direction: DESC} ) {
  //                     edges {
  //                       node {
  //                         name
  //                       }
  //                     }
  //                   }
  //                 }
  //                 ... on Gist {
  //                   name
  //                   description
  //                   url
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }`

  // const variables = {
  //   query: this.queryText,
  // };

  // const endpoint = 'https://api.github.com/graphql';

  // const options = {
  //   method: "POST",
  //   headers: { 
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer ${process.env.TOKEN}`
  //   },
  //   body: JSON.stringify({ query: gqlQuery, variables })
  // };

  // fetch(endpoint, options)
  //   .then(res => res.json())
  //   .then(userData => {
  //     // clear any existing data so new results can go in (just to be sure there's nothing mixed)
  //     this.users = {},
  //     this.userCount = 0;
  //     this.pageInfo = {
  //       prev: false,
  //       next: false,
  //       firstUser: '',
  //       lastUser: '',
  //     };

  //     const pageData = userData.data.search.pageInfo;
  //     this.pageInfo.prev = pageData.hasPreviousPage;
  //     this.pageInfo.next = pageData.hasNextPage;
  //     this.pageInfo.firstUser = pageData.startCursor;
  //     this.pageInfo.lastUser = pageData.endCursor;

  //     const results = userData.data.search.edges;
  //     const legitUsers = results.filter(user => {
  //       const userObj = user.node;
  //       return Object.keys(userObj).length > 0;
  //     });
  //     this.userCount = userData.data.search.userCount - legitUsers.length;
  //     this.loading = false;
  //     this.users = legitUsers;
  //   })
  //   .catch(err => console.error(err));