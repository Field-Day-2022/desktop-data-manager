# Quality Policy

## Scrum

The team will use the Scrum framework to govern the management of the Field Day project.

### Sprint Planning

Sprint planning will be done on the first Sunday of each sprint duration.

### Stand Up

Each team member will post in `#field-day-2022-standup` at least **3** times per week. 

#### Standup posts will follow the following format:

1. What's done
2. What's next
3. Obstacles

At the end of each sprint each team member is responsible for moving their standup notes from Slack
to the Google sheet [here](https://docs.google.com/spreadsheets/d/1beFXzJNFcR82lcvSi-tIZXk3Qr86IBEQbFVrCKx_DNw/edit?usp=sharing).

### Sprint Retrospective

Sprint retrospective will be done on or before the due date.

## Communication

Communication for the Field Day project spans multiple applications and channels. The modes of communication and the 
rules that govern their use are as follows.

### Slack Channels

- The `#field-day-2022` is used for general communications and daily huddles.
- The `#field-day-2022-sponsor` channel is used for communication with the team sponsor, Professor Heather Bateman.
- The `#field-day-2022-standup` channel is used for posting standup notes. 


### Discord

Communication with legacy developer, Carlo Pelosi, will occur in the [Field Day](https://discord.gg/qfWDMEdUfr) 
discord channel.

### Google Drive

Google Drive will be used to store and access shared resources. The root of the Capstone folder in Google Drive can be 
found [here](https://drive.google.com/drive/folders/19JDGxjSamYeW-ZXcv5gNdX_IfooPdGxY?usp=sharing).

#### The file structure is as follows:

- Capstone (top level directory)
  - Contains resources that require constant attention and span the life of the project.
- Sprints (Capstone/Sprint #)
  - Contains resources that are specific to one sprint.
- Templates (Capstone/Templates)
  - Contains reusable templates for generating documentation.
- Carlo Pelosi (Capstone/Carlo Pelosi)
  - Contains notes and recordings from meetings with the legacy developer, Carlo Pelosi.
- Bateman (Capstone/Bateman)
  - Contains notes and recordings from meetings with the Sponsor, Dr. Heather Bateman.

## Version Control
The team will use git for version control and host the source code on GitHub.

### Repositories

The Field Day project spans multiple repositories.

1. [field-day-2022](https://github.com/Field-Day-2022/field-day-2022): Main project repository. Contains source code 
and supporting documentation for submission and deployment.
2. [field-day-2022-research](https://github.com/Field-Day-2022/field-day-2022-research): 
3. [documentation](https://github.com/Field-Day-2022/documentation)

- All repositories will include a `.gitignore` for all generated files.
- All repositories will include a `README.md` with basic operation information in the top level directory.
- There will be no source files in the top level directory of any repository.



### Git Workflow:
- The master branch, `main`, will not be pushed to until the end of each sprint.
  - A pull request for merge into main shall require **2** reviews.
- A development branch,`dev`, will be branched from master.
  - The development branch will be used to merge user stories for each sprint.
  - A pull request for merge into development shall require **1** review.
- Each user story will be separated by branch. 
  - Branch name format: `US#-description`
  - User stories will not be merged into Development until all that user story's tasks are complete.
- Developers will pull the corresponding US branch to their local repo and branch for each task.
  - Branch name format: `TS#-description`
  - Task branches will only be merged into their parent user story branch once they are complete.
- Developers are expected to use descriptive commit messages and comments.
#### The process for merging task branches to their corresponding user story branch:
1. Squash the task branch history.
2. Rebase with it's associated US branch.
3. Push to the remote.
4. Create a pull request for merge to the associated US branch.
#### The process for merging user story branches into development:
1. Rebase the US branch with the development branch.
2. Create a pull request for merge to the development branch.

Further information about git steps can be found in the repository [wiki](https://github.com/Field-Day-2022/field-day-2022/wiki).

## Code

- Each team member will commit to a US or TS branch at least once every 3 days.
- Each team member will participate in pair programming at least once per sprint.
  - Pair programming should last between 30 minutes and 1 hour.
  - Two team members write code together live.
  - Half of the time will be spent on each developer's tasks.

## Acknowledgement

By checking the box below that corresponds with my name, I am agreeing to adhere to all policies, standards, 
and practices specified in this document.

- [ ] Jack Norman
- [ ] Isaiah Lathem
- [ ] Denis Grassl
- [ ] Zachary Jacobson
- [ ] Ian Skelskey