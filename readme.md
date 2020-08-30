# GitHub User Profile Search!

A project created for This Dot Labs.

This project uses GitHub's GraphQL API to search for users and return interesting information on them! Will show a profile card showing their photo, name, bio (if provided), followers, star count, and their top 3 pinned repositories, if they exist.

This site is hosted on Netlify! You can check it out here:

## To Run the Site

This project uses Vue and Parcel. To run this locally, follow these steps:

1. Install the necessary packages (basically just Vue and Parcel).

    ```bash
    npm install
    ```

2. You'll need to get an OAuth token from GitHub to run this yourself in development. You can find the [steps to get an OAuth token here](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token). Store this token in a `.env` file on your local machine. **Make sure not to add this file to your public repo!**

3. Run the dev server and you're good to go!

    ```bash
    npm run dev
    ```

That should be it! Parcel provides a local dev server that will read the `index.html` page and get all the necessary data.
