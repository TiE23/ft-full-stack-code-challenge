# Full Stack Code Challenge

![3aaa3278-5f6e-466d-9dc1-6a6a55d8be4d.png](./assets/3aaa3278-5f6e-466d-9dc1-6a6a55d8be4d.png)

### Goals

This project is designed to show off your capabilities as a Full Stack TS/JS engineer.  The Flashtract team will be assessing this project to assist in the determination of team compatibility.

This project aims to exhibit how you approach a problem starting from the high level solution to the low level implementation details and code quality. **You will not be penalized for asking questions, so don't hesitate to ask us if you need any clarification.**

### Description

For this challenge, you will be building a basic Kanban board.  In this app, a user will be able to create Categories and then add Tasks to each individual Category.  As work progresses, the user should be able to move their tasks from one stage to another.  Additionally, the user should be able to delete a task.

![ezgif-5-0a87dd9f668a.gif](./assets/ezgif-5-0a87dd9f668a.gif)

<aside>
💡 This GIF is just an example of what the functionality may look like. It's not required for it to look exactly like this.

</aside>

### Tech

We have provided some starter Frontend and Backend code.  The frontend and backend are held in this monorepo (using NX). 

**Front-end**

The frontend of the application uses React and TypeScript.  We have preinstalled a couple libraries that we use in our apps to help accelerate development.

- React Query
- Axios
- Chakra UI

Feel free to use this or use your own favorite libraries.

**Back-end**

For the backend, we have scaffolded out a NestJS application.  We've preconfigured it to use sqlite3, which should be enough for this exercise.

For ORMs, we have set the application up using TypeORM.

Feel free to use the Nest CLI to generate new resources. 

### Commands

- Start frontend: `yarn start:fe`
- Start backend: `yarn start:fe`
- Run both in a single termina: `yarn start`

### Functionality Requirements:

- Backend should have at least 2 entities: Category and Task
- User should be able to create a new Category for the Kanban Board
- User should be able to add Tasks into a Category
- User should be able to delete a Task
- User should be able to move a task from one category to another.
- Information in the README about how you went about solving problems is always a huge plus.  We love to learn more about your thought process and how you reached conclusions.

 

### Stretch Goals (Not Required)

- Use drag & drop to move tasks from one category to another.
- Add tags to the tasks and allow to filter by tag.
- Add additional fields to Tasks like description, date added, etc and make it viewable on click in the UI.

### Important Notes
You do not need to deploy this application. When you complete the exercise, please push the application to Gitlab and notify your recruiter with the link. They will then pass the code along to the engineering team.

Default Front-end URL: http://localhost:4200

Default Back-end URL: http://localhost:3333/api

### Grading Criteria

|  | 0 - 1 | 2 - 3 | 4 - 5 | Score |
| --- | --- | --- | --- | --- |
| Completion
Were the project requirements met? | Very few of the requirements were met | Some of the requirements were met | Most or all of the requirements were met |  |
| Language & Framework Knowledge
Was the candidate able to use the language & framework to its full potential and justify their decisions? | The candidate made basic or incorrect language/framework implementation decisions that they could not justify | The candidate made basic to moderate language/framework implementation decisions and justified them | The candidate made moderate to advanced language/framework implementation decisions and justified them thoroughly |  |
| Code Style & Readability
Was a consistent and clean style used throughout the project? | The code was not clean or readable.
The code style was not consistent. | The code style was consistent, but not clean or readable / The code was clean and readable, but not consistent | The code was clean and readable, and the style was mostly or very consistent |  |
| Bonus
Bonus points are awarded for anything that may separate the candidate from others. Things like clever implementation, good documentation, quality test cases, extra functionality, and much more will be rewarded. | The candidate completed the minimum requirements | The candidate made an effort to demonstrate extra care & commitment to the project | The candidate went above and beyond to demonstrate extra care & commitment to the project |  |


