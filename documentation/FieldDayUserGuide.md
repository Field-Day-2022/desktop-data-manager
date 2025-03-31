# Field Day App User Guide

Welcome to the Field Day App User Guide. This guide will help you understand how to use the Field Day application to its full potential.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
    - [Creating an Account](#creating-an-account)
    - [Logging In](#logging-in)
3. [Application Features](#application-features)
    - [Dashboard Overview](#dashboard-overview)
    - [Data Source Tab](#data-source)
    - [Managing Entries](#managing-entries)
    - [Editing The Table View](#editing-the-table-view)
    - [Searching For Entries](#searching-for-entries)
4. [Detailed instructions for Data Handling](#detailed-instructions-for-data-handling)
    - [Exporting Reports](#exporting-reports)
    - [What is a Session?](#what-is-a-session)
    - [Merging Sessions](merging-sessions)
5. [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
    - [FAQs](#faqs)
6. [Feedback](#support--feedback)
    - [Providing Feedback](#providing-feedback)

---

# Introduction

Welcome to Field Day! Field Day is an application sponsored by Dr. Heather Bateman, a biologist and researcher at Arizona State University (ASU).

The app is developed and maintained by ASU Software Engineering students as part of their Capstone course (SER 401 and 402).

Field Day consists of two platforms:

- Field Day Desktop App
- Field Day PWA (mobile application)

This guide focuses on the Desktop application.

# Getting Started

### Creating an Account

Field Day is currently set up to only allow ASU emails to log in. Please sign in with your ASURITE ID.
Our desktop application also requires a password to access the data once you are authenticated through ASU.
Please reach out to Dr. Bateman for this password to access the site.

### Logging In

The Desktop Field Day app is located at : [Field Day Desktop](https://asu-field-day-webui.web.app/login)

Sign in to this portal with your ASU-affiliated Google account.

# Application Features

### Dashboard Overview

Once authenticated, you'll see the main dashboard. Each tab represents a different category of critter data collected in the field.

![img_10.png](FieldDayGuideImages/mainpage.png)
Currently, there are 7 different tabs:

1. **Turtle**
2. **Lizard**
3. **Mammal**
4. **Snake**
5. **Arthropod**
6. **Amphibian**
7. **Session**

Each tab is self-describing, as it contains the data for each critter species.

The Session tab is for the entries created during the current session. More on sessions [here](#sessions).

### Data Source

One of the most important things to take note here is the Data Source Tab:

![img_1.png](FieldDayGuideImages/datasource.png)

This tab switches between which set of data to use. There are two selections: Live and Test

- Live is the live database. This is the most up-to-date data and the live data being collected in the field. Be careful when editing this data!
- Test is a test environment. These entries are mostly the development team testing out different features on the application to make sure they work. Change these entries to your heart's desire.

### Managing Entries

All entries are available to be viewed on the desktop application. To edit/delete/alter in any way these entries, you can click the edit or delete button on the side of each entry under the "Actions" column.

![img_2.png](FieldDayGuideImages/editcolumns_beforebutton.png)

For example, this Lizard entry has the edit button and delete button next to it. Clicking the edit button makes these fields editable:

![img_3.png](FieldDayGuideImages/editcolumns_active.png)

Now you can edit whatever information you need. To save or discard these changes, hit the check or X button, respectively.

## Editing the Table View

If a certain page is too crowded, or has information you don't need to take into consideration at a certain point in time, fields are able to be removed from the table using the editor in the top right corner:

![img_7.png](FieldDayGuideImages/projectdropdown.png)

Clicking the three-card button, it shows this menu: (not all shown for image size purposes):

![img_8.png](FieldDayGuideImages/columnselector.png)

As an example, if you only wanted to view Year, Date & Time, and Site, you can deselect all options. This is what the page would look like after:

![img_9.png](FieldDayGuideImages/selectedColumns.png)

### Searching For Entries

Searching for different critters is now easier than ever. Using the search bar, you can search for multiple terms to find the exact entry you need.

For example: In the lizard tab, say you wanted to find lizards of species code ASTI with toe-clip code C1.

First, type ASTI into the search box. For any other term you want to search, add a +. i.e.:
![img.png](FieldDayGuideImages/searchtwoterms.png)

# Detailed Instructions For Data Handling

### Exporting Reports

At the bottom of any page in the Field Day app, you can find 4 buttons:

![img_4.png](FieldDayGuideImages/bottom4buttons.png)

The button that looks like an arrow coming out of a rectangle, or, this one:![img_5.png](FieldDayGuideImages/exportToCSV.png) is the Export button.

Click this button to bring up a dialogue to select which data to convert to a CSV document. This document can easily be opened in Excel or other data applications for further processing.

Any of the data on the Field Day app can be generated into this file, as shown in the menu:

![img_6.png](FieldDayGuideImages/exportToCSVModal.png)

You may also choose to only export from the current session or the data already saved to the database.

After clicking "Generate CSV", the CSV file will be downloaded to your computer.

### What is a Session?

A session is a way to track and organize critical data about individual days collecting data out in the field.

A session holds multiple pieces of information:

1. Date & Time of the recordings
2. Handler and Recoder
3. Site
4. Array
5. Capture status (true / false)
6. Trap Status (OPEN, CHECKED, CHECKED & CLOSED)

A session also holds the data for all the critters caught during its time. That is, you can search critters by session.
Additionally, sessions provide a clear audit trail for field activities, ensuring that all data is organized and easily accessible.

### Merging Sessions

Sometimes Session data can be messy. If entries are ever entered into the wrong session, there is an easy way to fix it.

At the bottom of the page, located amongst the same 4 buttons as the CSV export, is the Merge Sessions button:

![img.png](FieldDayGuideImages/mergesession_button.png)

Clicking this button brings a screen up that allows you to merge two sessions together. Merging a session goes as follows:

- Select the two sessions to merge together
- The session will be merged as follows:
    - The latest session (that is, the session created closest to the present) will be merged into the older session.
- The newer session will be deleted and all data will be preserved in the older session.

To merge a session:

Select the two session you want to merge together using the tool:

![img_1.png](FieldDayGuideImages/mergesession_modal.png)

After that, hit merge!

![img.png](FieldDayGuideImages/mergesession_Selected.png)

The sessions will be merged as described above. Make sure you're sure about what you're merging - there's no undoing this operation!

## Troubleshooting

### Common Issues

To be written. See Note in FAQs.

### FAQs

Frequently Asked Questions about using the Field Day App.

-- TODO: Ask Heather about how her team uses the app and any questions they ask her on the day to day.

- as for task grading, our next meeting is 11/20 so past the deadline. This will get updated in time.

## Support & Feedback

Please reach out to Dr. Bateman with any requests to make this app a better place for all of us!

Any change requests will greatly help out future capstone teams and their work in developing and maintaining this app :)

---

Last Updated: 11/15/2024
