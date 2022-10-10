# Quality Policy

## Sprint

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
### Standup

## Version Control
The team will use git for version control and host the source code on GitHub.

### Repositories

The Field Day project spans multiple repositories.

- All repositories will include a `.gitignore` for all generated files.
- All repositories will include a `README.md` with basic operation information in the top level directory.
- There will be no source files in the top level directory of any repository.

#### [field-day-2022](https://github.com/Field-Day-2022/field-day-2022)
#### [field-day-2022-research](https://github.com/Field-Day-2022/field-day-2022-research)
#### [documentation](https://github.com/Field-Day-2022/documentation)

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

- Pair Programming

## Acknowledgement

By checking the box below that corresponds with my name, I am agreeing to adhere to all policies, standards, 
and practices specified in this document.

- [ ] Jack Norman
- [ ] Isaiah Lathem
- [ ] Denis Grassl
- [ ] Zachary Jacobson
- [ ] Ian Skelskey