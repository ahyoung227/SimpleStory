# SimpleStory

SimpleStory is a full-stack web application inspired by Twitter. 
It uses Node.js, Express, Sequelize in the backend, and Vue, Vuex, Nuxt and Vuetify in the frontend.

[Live Site](https://simplestory.ga/)

## Features
* Authentication
* Post/edit/delete posts
* Like/unlike and comment
* Following/follower
* Image uploads
* Search posts by tags
* Search posts by username
* Repost the post

## Implementation

### Authentication
SimpleStory uses Passport.js and sessions for user authentication. Rather than using token-based authentication, SimpleStory saves logged-in user information in an Express.js session. This decision was made in anticipation of future implementation of a feature that will allow all logged-in users to be displayed, enabling them to communicate in real-time with each other. To support the use of sessions, serialize and deserialize features provided by Passport.js have been implemented.

```
    passport.serializeUser((user, done)=> {
        return done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await db.User.findOne({
                where: { id },
                attributes: ['id', 'nickname'],
                include: [{
                    model: db.Post,
                    attributes: ['id'],
                }, {
                    model: db.User,
                    as: 'Followings',
                    attributes: ['id'],
                }, {
                    model: db.User,
                    as: 'Followers',
                    attributes: ['id'],
                }],
            });
            return done(null, user); // req.user, req.isAuthenticated() === true,
        } catch (err) {
            console.error(err);
            return done(err);
        }
    });
```
By using sessions instead of JWTs, SimpleStory will be able to easily access and display information about all logged-in users. This can be helpful for facilitating communication between users in real-time. Additionally, the use of Passport.js's serialize and deserialize features will make it easy to manage user sessions and ensure that user information is secure.

To further improve performance, SimpleStory could use AWS Redis to store Passport.js sessions instead of using the built-in session management provided by Express.js. Redis is an in-memory data store that is designed for high-performance, low-latency applications, making it a great choice for managing user sessions.


### infinite scrolling and throttling
SimpleStory uses an API request to load more posts from the database when a user scrolls down the screen. Each request fetches 10 posts, starting from the last ID. To avoid sending multiple loadPosts requests, the lodash package's throttling feature is used, which prevents the loadPosts function from being called twice for the same scrolling event within a 2-second (2000ms) period.

In the Vuex mutation function, the loadPosts function is implemented to enable this throttling behavior.

Overall, this approach helps to optimize the performance of SimpleStory by reducing the number of unnecessary API requests and improving the user experience by providing a smoother scrolling experience with fewer interruptions.
```
    loadPosts: throttle(async function ({ commit, state }, payload) {
        try {
            if (payload && payload.reset) {
                const res = await this.$axios.get(`/posts?limit=10`);
                commit('loadPosts', {
                    data: res.data,
                    reset: true,
                });
                return;
            }
            if (state.hasMorePost) {
                const lastPost = state.mainPosts[state.mainPosts.length - 1];
                const res = await this.$axios.get(`/posts?lastId=${lastPost && lastPost.id}&limit=10`);
                commit('loadPosts', {
                    data: res.data,
                });
                return;
            }
        } catch (err) {
            console.error(err);
        }
    //Throttling will be valid for 2 seconds    
    }, 2000)
```
To handle scrolling, I created an onScroll() function that triggers a post/loadPosts mutation in Vuex store. However, the mutation will only be dispatched if there are additional posts to load in order to prevent infinite requests from the client side.
```
    onScroll() {
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (this.hasMorePost) {
          this.$store.dispatch('posts/loadPosts');
        }
      }
    }
```

### Server-side rendering (SSR) capabilities
technique that allows web pages to be rendered on the server and then sent to the client, 
which can improve page load times and provide a better user experience.
SimpleStory has faster loading times, improved SEO, and better performance by using code-splitting technology that Nuxt provides.

### Uploading images to S3 with lambda
Node.js uses a "Single Threaded Event Loop Model" architecture to handle multiple concurrent clients. However, tasks such as uploading and resizing images can be heavy and may block other relatively light requests in Node.js. To avoid this bottleneck, AWS Lambda functions can be used to optimize Node.js server performance.

To take advantage of this, SimpleStory uses a Lambda function provided by AWS to handle the resizing and uploading of images. The Lambda function receives uploaded images from S3, resizes them, and uploads them to a designated "thumb" folder. If the upload is successful, the function returns the image path.

By using Lambda functions to offload resource-intensive tasks, SimpleStory can improve the overall performance of the Node.js server and ensure that it remains responsive to all clients. This can enhance the user experience and help to prevent requests from being blocked by resource-intensive tasks.
```
    try {
      //Recieved images
      const s3Object = await S3.getObject({ 
        Bucket,
        Key,
      }).promise();
      //Image resize
      const resizedImage = await Sharp(s3Object.Body)
        .resize(800, 800, {
          fit: 'inside',
        })
        .toFormat(requiredFormat)
        .toBuffer();

      await S3.putObject({
        Body: resizedImage,
        Bucket,
        Key: `thumb/${filename}`,
      }).promise();
      //if it is successful, return an image path
      return callback(null, `thumb/${filename}`);
    } catch (error) {
      return callback(error);
    }
```





