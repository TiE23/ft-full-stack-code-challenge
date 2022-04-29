# Kyle's Comments

Hey Jamie and the rest of the Flashtract family. Here's just some of my own notes.

- On Tueday I was given the assignment and read the general description and little else
- On Wednesday I studied up on NestJS, TypeORM, SQLite, and React-Query
- On Thursday I started writing the backend. I ran into a lot of friction just trying to get TypeORM to behave within NestJS but by the end of the day I was starting to stretch my legs
- On Friday I polished the backend and made some design changes

## About the Back End

These aren't important to read, they were mostly for myself. This was a learning experience where I used a number of new libraries, after all!

### Thursday Notes

1. Trying to get SQLite to build on my Apple Silicon MBP as a dependency of the sqlite3 module was a pain. Nothing like starting a project that could get you a job and the simply running yarn install results in ugly, ugly errors. Turns out I never did install XCode on this laptop when I first got it 2 months ago. As a result the build process that used Python wouldn't work and it took me some research to find my solution.
2. Woah, NestJS is pretty cool. I like the structure it gives you. Lets you not have to answer for your design choices as you get to just go "because NestJS said so!"
3. Took me a bit to realize that TypeORM's documentation was changed. 0.3.0 of that module seriously changed a lot of things and as a result the documentation was a bit too new for the version (0.2.44) that we are using here. It's important to use 0.2.44 because the documentation for NestJS's guidance on using TypeORM uses the older verison. Support is probably weeks - if not months - away.
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
