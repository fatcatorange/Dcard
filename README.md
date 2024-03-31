# Dcard 2024 Frontend Intern Homework

## Introduction

Developed using React.js + TypeScript, and a simple server written in Node.js for deployment in an online environment using ngrok.

* Authenticate through GitHub OAuth and store the token in localStorage.
* Load 10 items of data each time; load another 10 when scrolling to the bottom.
* Display the title, number of reactions, and the most used reaction for each post on the page.
* Clicking on a post in the display page should navigate to that post's page, and clicking on "comment" should display comments.
* Only the account logged in as Daniel can add, delete, or modify posts.

## How to use

The project is hosted on GitHub Pages, so you can directly access and use it via the [link](https://fatcatorange.github.io/Dcard/).

## The overall architecture is as follows:

Users must first log in through GitHub to obtain a token, as shown below:

![image](https://github.com/fatcatorange/Dcard/assets/76681700/ccf96d30-199a-4471-aba7-2ff5ab5e1b7e)

The reason for this complex process is to avoid storing CLIENT_SECRET directly on the client side. Therefore, users must request a token from GitHub through the API to the backend.

After logging in, the overall architecture is as follows:

![image](https://github.com/fatcatorange/Dcard/assets/76681700/5a648a65-8a72-47db-9c80-e86a17db0ef8)

* The "Create" page represents the modification page, which only Daniel himself can access.
* The "PostPage" is the article page, where you can view the content of the article and comments after entering.
* "Issue" represents the fields of each article, displaying reactions, comment counts, titles, etc.
* Only one of the above three pages will be displayed at a time.

When there is an error sending the API (such as network connection issues or server failures), a notification window will appear to inform the user.

![image](https://github.com/fatcatorange/Dcard/assets/76681700/14c57345-5313-4bed-857c-43a7cf68c612)

When the input is too short or the title is empty, it is not possible to modify or add a new article.

![image](https://github.com/fatcatorange/Dcard/assets/76681700/e2ac14c5-369b-4d9c-bbe8-6dc6b0828730)

The score of web vitals in the program.

![image](https://github.com/fatcatorange/Dcard/assets/76681700/707fb561-702a-46fc-a9cc-3f67a05ec048)




