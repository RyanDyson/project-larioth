# Personal Apps

An assortment of personal apps built to track my daily life and to experiment with hosting my own stuff on a home server

## Features

### Auth

Basic auth, single account, my account, using better-auth.

### Fitness Tracker

Personal workout tracking, inspired by Hevy

- Should be able to add routines that correspond to a specific day of the week
- Active routine for that day should be highlighted, and have a calendar for all the routines
- Each routine should be able to be edited or updated, and each routine is a set of exercises, with each exercise having a target rep
- I can start a routine that would track how many reps ive gone in the workout
- Routines can also be sports, so if a routine is "bouldering", there shouldn't be any reps inside the routine.

### Finance Tracker

Personal finance tracking, customized and simplified cuz I was sick of notion

- Default view should aggregate over current month, have a time picker to pick all time, per-month, etc.
- Should be simple, have a pie chart for expenses and income
- Have a button that opens a dialog that i could input an expense or income, each cashflow item should be taggable with a tag like "grocery" or "gym".
- Have a table for expenses and income based on date added, descending
- Be able to edit and delete cashflow items
- Aggregate view should update upon any changes

### Chatbot

Powered by local llm hosted on LM Studio

- should have a history of previous chat i've made and i could make a new chat
- should be able to handle markdown, latex, or code blocks
- if i dont like the answer, should be able to easily resend the same prompt and get a different result
- thumbs-up and thumbs-down on chat response
- have a pop-up in the chat area to load, eject, and switch models

### Media Server

Custom Front-end UI to host jellyfin media server

- Should be able to connect to jellyfin
- Should be able to upload file/folder like cloud drive
- should be able to categorize into folders files like cloud drive
- right click, should open custom context menu depending on the item it is right clicked on
- should have 2 different views i can switch from, a list, or tiles with thumbnails.

## Infra

### Front-end

My typical front-end webslop stack

### Back-end

My typical back-end webslop stack with some tweaks

### CI/CD

Hosted on my homeserver via docker and exposed via TailScale to the internet.
