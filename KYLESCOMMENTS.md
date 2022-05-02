# Kyle's Comments

Hey Jamie and the rest of the Flashtract family! I just wanted to grab this challenge and treat it like a personal project of mine. To, in short amount of time, build it in such a way that I feel would provide a full impression of how I work. I told Jamie that I like to create solutions that aren't just hacks or quick "good-enoughs", so even with just a take-home project I wanted to build it at a professional level... if said professional was trying to speedrun the build of a good app. 😆

Here's just some of my own notes.

## Progress Summary

- On Tueday I was given the assignment and read the general description and little else.
- On Wednesday I studied up on NestJS, TypeORM, SQLite, and React-Query.
- On Thursday I started writing the backend. I ran into a lot of friction just trying to get TypeORM to behave within NestJS but by the end of the day I was starting to stretch my legs
- On Friday I finished the backend and made some design changes. Then started writing unit tests for the backend.
- On Saturday I spent most of the day figuring out how to correctly run e2e tests for the backend. It was a pretty amazing learning experience to be honest. Discovered in-memory sqlite instances was just a string away. Figured out how to manipulate internal tables to reset auto-increment counts for tables I clear. In general it was a ton of interesting work. I also went back and made some fixes to the backend as I wrote tests and went "oh, right, I didn't consider that case!"
- On Sunday it was a blitz to the finish in the frontend. Oh man, this was a lot of fun to do quickly.

## About the Backend

I wrote this app using Node v16.13.0. So, if something goes wrong, please try adjusting your nvm first.

Knowing what I wanted to build on the frontend I just went whole-hog and dove into 100% exclusively back-end development. Learning to build it with your team's style of using Nest and TypeORM proved to be a real learning experience as I haven't encountered them before. But as a result, I think they both have a new fan (me).

I used Postman (folder config committed to root) for most of my fiddling.

I didn't maybe build the most production-ready solution, and I might've chosen to use params more often than some might like (yes, I will admit that moving and repositioning a Task from one Category to another with an endpoint of `':taskId/moveto/:categoryId/:newPosition'` is maybe weird - I just went with it!), and I chose a fun but weird ordering solution involving "lexical sorting", but I really just had a lot of fun with it.

Oh, and yes, I wrote a full suite of e2e test using a test database. Every Taska and Category endpoint is covered.

## Daily Notes

These aren't important to read, they were mostly for myself. This was a learning experience where I used a number of new libraries, after all!

### Thursday Notes

1. Trying to get SQLite to build on my Apple Silicon MBP as a dependency of the **Sqlite3** module was a pain. Nothing like starting a project that could get you a job and the simply running yarn install results in ugly, ugly errors. Turns out I never did install XCode on this laptop when I first got it 2 months ago. As a result the build process that used Python wouldn't work and it took me some research to find my solution.
2. Woah, **NestJS** is pretty cool. I like the structure it gives you. Lets you not have to answer for your design choices as you get to just go "because NestJS said so!"
3. Took me a bit to realize that **TypeORM**'s documentation was changed. 0.3.0 of that module seriously changed a lot of things and as a result the documentation was a bit too new for the version (0.2.44) that we are using here. It's important to use 0.2.44 because the documentation for NestJS's guidance on using TypeORM uses the older verison. Support is probably weeks - if not months - away.
4. I spent some time looking up how to automatically delete Tasks that belonged to a Category that was deleted and it lead to some back configurations that I was only able to figure out by looking up the like [5th GitHub task](https://github.com/typeorm/typeorm/issues/1460#issuecomment-383715715) that mentioned the error I was getting. Turns out you need to use `onDelete: 'CASCADE'` option in a @ManyToOne relation.
5. lol the first time I ran my PATCH route to move a Task from one Category to another worked flawlessly the first time I tried it. Nothing but net on that one, buddy!
6. I want to figure out validation and more friendly and informative exception handling. First stop is checking out Pipes in NestJS. ParseIntPipe is a good first step.
7. Oh, wait. What's better than writing ParseIntPipe for every route in the Controllers? Using global pipes and setting [transform to true](https://docs.nestjs.com/techniques/validation#transform-payload-objects), of course!
8. Figuring out validation for my DTO classes using class-validator decorators. Now I can whitelist (or as they say nowadays, allowlist). Tried to use the node module `config` to define the max lengths of Task/Category titles but ran into problems with module exports whose fixes started killing my TypeScript server so I gave up on that.
9. Added some basic exception throwing for when Categories and Tasks aren't available when the user needs them.
10. Before bed implemented my lexical ordering solution. I know this isn't a real-world solution but I wanted to give some odd idea a try.
11. Made sure to comment the lexical ordering algorithm a whole bunch and provide exhaustive testing for it.

### Friday Notes

1. Started my day realizing there were a lot of improvements I could make to lexical ordering.
2. Started moving repeated code into their own utility files.
3. More unit testing for the "business logic" end of things. This is the kind of stuff that made me really believe in unit testing as not just "something you have to do" but as something that actually helps development.
4. Taking more chances to genericize utility functions and just having general fun with TypeScript. (Yes, I literally find TypeScript to be fun, no joke.)
5. Further stripping down the routes available to the API, designing to what we'll actually need.
6. Combining the "move Tasks between Categories" and "reposition Task in Tasks array" into a single controller and service named `moveAndReposition` that combines the two actions. This follows real-world UX, where if we allow full drag-and-drop abilities we should be able to drag a Task to a new Category and position it correctly.
7. Oh snap, I discovered an issue with repositioning Entities while manually testing things out in Postman. I realize the issue and devise a solution and write unit tests to confirm my fix and make sure it didn't mess anything up.
8. The Backend is pretty much finished (discounting any "oh, I didn't think of that" adjustments after the fact when working on the Frontend). Now, time to write some tests... let's see how this goes...
9. Oh wow, this is proving to be really annoying. Finding sample solutions online and consulting documentation and everything isn't yielding the secret as I try and just prepare a TestingModule in the Category controller. This is disheartening...
10. Thank you to a random dude on StackOverflow. Turns out I needed to fully mock out the CategoryService otherwise TypeORM would try and get to the database despite the fact I wasn't attempting to do e2e.
11. Trying to configure e2e tests for Categories now. Was stuck for a long time until Googling around long enough left me to attempt a seemingly [unrelated fix](https://stackoverflow.com/a/68080829/3120546) that ended up working to unblock me. Now I just need to deal with the fact that apparently my API routes aren't working and can't be tested with supertest.
12. Oh my god, I managed to get through all the issues. What a learning experience! Now I have working e2e tests for Categories. Will finish writing them later and then write them for Tasks, which shouldn't take any time at all.

### Saturday Notes

1. Running into an issue where the auto increment of ids doesn't reset when I clear the Category table in the database. So when I write a test that looks for a Category by their ID it won't find it. Seeing if I might be able to manually run a query to [nuke the sqlite_sequence](https://www.designcise.com/web/tutorial/how-to-reset-autoincrement-number-sequence-in-sqlite) table...
2. Yep, that worked. Now, when I clear the table, I also run a custom query to reset the autoincrement count back to 0. God, that felt good. I left my findings for others [here](https://github.com/typeorm/typeorm/issues/4533#issuecomment-1114010392).
3. Oh, also, it turns out that Jest's `beforeEach()` and `afterEach()` functions don't pay attention to `describe()` blocks. So even if attempt to nest sets of `it()`'s under `describe()` blocks and strategically place `beforeEach()` and `afterEach()` above the `describe()` blocks it will still run before and after each `it()`, not the `describe()`. Just running some console.log() statements lead me to look into this and [found confirmation](https://joshua-toth.medium.com/jests-beforeeach-may-not-be-running-the-way-you-think-it-does-c81599d83649).
4. Spent good amount of time working on e2e tests and got it to where I want.
5. Initial front end work. Just tossing to things up and using react-query for the first time just to get Categories from the server. Had to further configured CORS rules in the backend to get it to work correctly.

### Sunday Notes

1. Blitz time for the front end! I've already learned a lot for this challenge on the backend so I'm just going to skip ChakraUI and just go with home-grown styled-components and a theme.
2. Defining API functions using Axios immediately. Just taking care of the basic things I can just do right away.
3. Hey, using NX to generate new components is pretty fun.
4. Practicing "composable" styling where I do not define positioning or padding for a component and instead only let components position and space child components. This is something I learned from the creator of [Bedrock-Layouts](https://github.com/Bedrock-Layouts/Bedrock)
5. Custom hook to focus on input element on appearance.
6. Another custom hook to hide a component when there is a click outside the component.
7. Ran into an issue with TypeScript not being happy with react-query's optimistic updates. Seeing some [others talking about it](https://github.com/tannerlinsley/react-query/discussions/3434) it appears to be a limitation with TypeScript and I need to explicitly define the return type from getQueryData(). Neat info is this [might be fixed in TypeScript 4.7](https://tkdodo.eu/blog/react-query-and-type-script#optimistic-updates).
8. Hoo, mutation args threw me off. Very thankful for [this excellent guide](https://medium.com/swlh/how-to-use-multiple-parameters-in-usemutation-from-react-query-with-typescript-7e2aeec51446).
9. I love TypeScript. I swear it makes JavaScript fun. Discriminating unions, when they fit perfect, feel so good.
10. I have grand plans to add drag-and-drop abilities to the project but for now I'm working on the simple left/right buttons.
11. I love JavaScript in general. With nullish coalescing you can just throw indicies at an array and if it doesn't exist not only do you not get some exception like you would get in pretty much every other language but you can then check, without fear of error, if a property is available on a particular object in said array.
12. Lost some time when I forgot which array functions mutated their arrays and which ones did not, requiring me to re-write (and improve greatly) some of the mutations and their optimistic updates.
13. Oh wow, note to self: In a component don't accidentally write `const queryClient = new QueryClient()` instead of `const queryClient = useQueryClient()`. TypeScript won't save you there, buddy!
14. Had to dive back into the backend to solve an issue where moving a Task between Categories wouldn't update the updated_at column automatically. Found [a solution utilizing Subscribers](https://github.com/typeorm/typeorm/issues/5378#issuecomment-632435566) that was flawed (it caused my e2e tests to fail - woo, thank you e2e tests!) but made the adjustment that was needed and left a comment for future poor souls who run into this issue themselves.
15. Discovered and fixed a nasty bug involving accidentally ignoring a 0 with `||` when I should've used `??` to detect an undefined property.
16. Using `react-use-measure` to do some nice fitting to the Task expand transition.
