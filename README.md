# My Book Shelf

## What it is:
An app that allows users to track books they have read and books they want to read.

## How to use it:
Create an account to search for books and add them to your "have read" or "want to read" lists. Once you read a title, move it from the "want to read" to "have read" list.

## Technical specifications: 
This is a MySQL application that runs using Open Library's Search API and the Axios promise-based HTTP client for node.JS. User login data is stored after log out ensuring data is retained between sessions. User data can be added, moved, or deleted. Middleware on the project includes Auth.js authentication library. 

## Developer notes:
Issue noted with account creation--when creating a new account and logging in for the first time, user is unable to edit their reading lists. However, after user logs out and then logs back in, they are able to add titles to their lists. 

_Version 1.0_ 
_(created by John Caudill)_