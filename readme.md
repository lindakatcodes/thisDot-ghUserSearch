# GitHub User Profile Search!

A project created for This Dot Labs.

This project uses GitHub's GraphQL API to search for users and return interesting information on them! Will show a profile card showing their photo, name, bio (if provided), followers, star count, and their top 3 pinned repositories, if they exist.

This site is hosted on Netlify! You can check it out here: <https://thisdot-githubsearch.netlify.app/>

## To Run the Site Locally

This project uses Vue and Parcel. To run this locally, follow these steps:

1. Install the necessary packages (basically just Vue and Parcel).

    ```bash
    npm install
    ```

2. You'll need to get an OAuth token from GitHub to run this yourself in development. You can find the [steps to get an OAuth token here](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token). Store this token in a `.env` file on your local machine. **Make sure not to add this file to your public repo!**

3. Run the dev server and you're good to go! The file that contains all the functional code is `App.vue`. Styles are in their own page (because I started out in straight JS and already had them mostly worked out there).

    ```bash
    npm run dev
    ```

That should be it! Parcel provides a local dev server that will read the `index.html` page and get all the necessary data.

## Improvements To Make in the Future

There are some things I'd like to update at some point. Those are:

- Ideally, I'd like to use a serverless function to make the API calls and store my personal token. The way it currently is isn't the most secure, though it works for now! Would not mind restructuring the API calls as well, cleaning them up a little. There's a bit of repetitiveness that could be handled better.
- Some of the styling could use improvements - initially I wanted some horizontal cards for larger screens, I'd like the repo lists to not have the `hr` on the last item, and it would be awesome to have some placeholder cards show on initial load.
- Accessibility checks are needed for screen readers and color contrast, adding proper tags if missing, etc. Tried to fit in what I could, but ran out of time.

### Thanks for checking this out! Please feel free to reach out if you have questions!
