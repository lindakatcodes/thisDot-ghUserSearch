# GitHub User Profile Search!

A project created for This Dot Labs.

This project uses GitHub's GraphQL API to search for users and return relevant information on them! Will show a profile card showing their photo, name, bio, followers, star count, and their top 3 pinned repositories, if they exist.

This site is hosted on Netlify! You can check it out here: <https://github-search-td.netlify.app>

## To Run the Site Locally

This project uses Vue and Parcel, with a Netlify serverless function to handle the API call. To run this locally, follow these steps:

1. Install the necessary packages.

    ```bash
    npm install
    ```

2. You'll need to get an OAuth token from GitHub to run this yourself in development. You can find the [steps to get an OAuth token here](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token). Store this token in a `.env` file on your local machine. There's a sample file in the root folder you can use. **Make sure not to add this file to your public repo!**

3. Run the dev server and you're good to go!

    ```bash
    npm run dev
    ```

That should be it! Parcel provides a local dev server that will read the `index.html` page and get all the necessary data.

## Details and Improvements from version 1.0 to 1.1

- **File Structure** - I wanted to make this a little easier to do future maintenance on, so I split the `userCard` info into a separate component, combined with the styles specific for that part. Now future card improvements will be easier to see. I decided to leave the rest of the page layout in the `App` file and keep the styles separate. If this were a larger project, items like the search bar and navigation could also be factored out into components, but it felt like it added too much complexity for a small single-page app. I also added all of the JS files into a `src` folder and moved my main stylesheet and any icons or images to a `static` folder. The API file is in a `netlify/functions` folder so that Netlify can see it. Only the `index.html` page is still in the root folder so that Parcel can easily see it along with any settings-specific files.

- **Serverless API Call** - I wasn't satisfied with having the main API call directly in the `App` file and have wanted to experiment with serverless functions for a while. So I split all that logic into a new file and have it running on Netlify! This worked surprisingly easier than I expected. Now in the `App` file, it's two lines of code to get the user data. Plus, any future changes to the API logic will be easier to find. I also did some refactoring on my previous code. Before, I had two separate calls - one for the initial API call and one for pagination. This lead to some duplicated code that wasn't necessary. Now, all links use the same API call, and the necessary options (first/last or before/after for the quantity and cursor) are subbed in by variables. This makes it much easier to see what's going on and maintain.

- **Accessibility Improvements** - I also ran an AXE audit on my site and made a few improvements. Most of what needed adjusting was a few colors to meet contrast requirements, adding alt text to images, and adding the `aria-hidden` label to my icons, since all of those are in places with other identifying text and are just for visual appeal. I also added a focus state for the search bar.

- **Small Adjustments** - I also slightly adjusted some spacing on the card layouts and text sizes, improved some of the overall page layouts with grid and flexbox, and added some placeholder cards for the initial page load. The placeholder images were created on Figma, with stickers designed by Alice Lee! The cats were too cute to resist.

## Improvements To Make in the Future

Even with the changes I've already made, there's always more that can be better. A few things I'd like to do eventually:

- Testing! I'd love to add some tests to help ensure things are working as expected.
- I'd love to create a dark mode version and a toggle to switch between the two.
- I wanted to add a keyboard shortcut to go to the search bar, but wasn't having any luck getting it working. I think that would be a nice touch to add, if I can figure out how Vue handles those events.
- I'm still not super impressed with the `userCard` design. It still feels like it's too big, though it does need to hold a decent bit of information. Still, something feels a little off about them.
- The scope of this project would make it a great candidate for learning! I'd like to make a REST version and also make a version using React. Then maybe I could have a way to switch between different versions or use the process to write some blog posts on what's different and what's similar between the options.

### Thanks for checking this out! Please feel free to reach out if you have questions!
