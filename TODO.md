# TODO

- [ ] Create repo for functionality shared between the pwa and the desktop data manager.
- [ ] Make it possible to search by individual fields in the data manager.
- [ ] Update CSV export functionality
  - [x] Make project dropdown in `ExportModal` use a local project variable instead of the current global state. It can be initialized with the project selected in global state.
  - [ ] Exported CSV files should be named as follows where `<project>` is the name of the project, `<critter>` is the name of the critter, `environment` is the name of the environment (`live` or `test`) and `<date>` is the date of the export:
    - **Quick Export**: Exports the data in the current table view.
      - [ ] Session Data: `<environment>-<project>-sessions-<date>.csv`
      - [ ] Critter Data: `<environment>-<project>-<critter>-<date>.csv`
    - **Export Modal**: Exports all session or critter data in the database for the selected project.
      - [ ] Session Data: `<environment>-<project>-sessions-all-<date>.csv`
      - [ ] Critter Data: `<environment>-<project>-<critter>-all-<date>.csv`
        - [ ] When more than one critter is selected in the `ExportModal`, each critter's data should be exported to a separate CSV file.
- [ ] Add a project selection dropdown to the `MergeSessionModal`
  - [ ] It should operate on a local project variable instead of the current global state.
  - [ ] It should be initialized with the project selected in global state.

### 🖼️ UI/UX

- [ ] Redesign the `FormBuilderModal`
- [ ] Add tooltips to all UI controls.
- [ ] Add new icon for quick export button to distinguish it from the `ExportModal` button. Perhaps a lightning bolt?
- [ ] Add slideshow of images to the `HomePage`

### 🪲 Bug Fixes

- [ ] Add bug reporting feature to the desktop data manager. (Open a GitHub issue)
  - https://github.com/Field-Day-2022/desktop-data-manager/issues/new

### 📝 Documentation

- [ ] Write a privacy policy for field day and provide a link to google cloud console [here](https://console.cloud.google.com/apis/credentials/consent/edit;verificationMode=true?authuser=1&project=asu-field-day).
- [ ] Choose a license for the desktop data manager.
- [ ] Add instructions for setting up Firebase.
- [ ] Document that Google cloud console is required for managing Google OAuth.
- [ ] Document that to access Firebase, Firestore, and Google Cloud features, the developer must be added to the Google Cloud project by the project owner (Dr. Heather Bateman)
- [ ] Document the need to add test deployment URLs to the Firebase project authorized domains.

### 📋 Data Integrity

- [ ] Add edit history to firestore
- [ ] Create a backup database for the desktop data manager.
  - [ ] The backup database should be updated manually by the project owner (Dr. Heather Bateman) on a regular basis. This won't be automated to ensure that the backup database is not accidentally overwritten with bad data.
- [ ] Add date/time picker to the entry items in the table view.
- Genus and species should not be directly editable in the table view.
  - [ ] Instead, species code should be selected from a dropdown and genus and species should be automatically populated based on the species code.


### 🛡️ Security

- [ ] Switch to username/password authentication for the desktop data manager.
  - https://firebase.google.com/docs/reference/js/auth.user
  - https://firebase.google.com/docs/auth/web/manage-users
  - [ ] Only add necessary users per Dr. Bateman's request.
  - [ ] Add a password reset feature.
  - [ ] Add a password change feature.
  - [ ] Require a password change on first login and once per year.
- [ ] Add roles with different permissions.
  - [ ] Admin: Can add, edit, and delete live and test data.
  - [ ] Editor: Can add edit live and test data.
  - [ ] Viewer: Can view live and test data but cannot edit or delete it.
  - [ ] Developer: Can view live and test data, edit test data, and delete test data.
- [ ] Hide all app secrets from the client.
- [ ] Issue new API keys and secrets on an as-needed basis.
- [ ] Implement remaining security dependabot recommendations.

## Completed

- [x] Add favicon to the desktop data manager.
- [x] Fix the edit feature for the `Year` column in any table.
  - One of the following solutions are acceptable:
	- [x] Remove the edit feature for the `Year` column.
	- [x] Make it so that editing the `Date` column automatically updates the `Year` column.
- [x] Fix the approach taken to icons in icons.jsx. Something about it feels like a smell.
- [x] Rename `WebUI` to `Desktop Data Manager`.
- [x] Update meta data in `package.json` and `package-lock.json`.
- [x] Add instructions for setting up Google Auth for test deployments.
- [x] Fix authentication on test deployments.
	- Users of test deployments are currently unable to sign in.
	- Dr. Bateman needs to be able to test new features before they are deployed to production.