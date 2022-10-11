/*
* File: About.js
* Version: 1.01 US167
* Date: 2020-03-01
* Description: Allows users to view information about each aspect of the app.
*/
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  container: {},
  aboutContainer: {
    display: 'inline',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    fontWeight: '400',
    paddingBottom: 10,
  },
  headlineText: {
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    height: 60,
    fontWeight: 400,
  },
  bodyPaper: {
    height: '-webkit-fill-available',
    minHeight: 500,
    padding: 15,
    position: 'relative',
    backgroundColor: '#e0e0e0',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  aboutButtons: {
    marginTop: 80,
  },
  expansionRoot: {
    width: '100%',
  },
  expansionHeading: {
    fontSize: theme.typography.pxToRem(20),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  footnoteText: {
    position: 'absolute',
    bottom: 20,
  },
  descriptionPaper: {},
});

class About extends Component {
  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classes.container}>
        <div className={classes.aboutContainer}>
          <Paper square={false} className={classes.bodyPaper}>
            <Typography variant="h2" className={classes.title}>
              About
            </Typography>
            <Typography variant="h4" className={classes.headlineText}>
              Documentation for the Web and Mobile Application
            </Typography>
            <div className={classes.expansionRoot}>
              <ExpansionPanel
                expanded={expanded === 'panel1'}
                onChange={this.handleChange('panel1')}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.expansionHeading}>Form Builder</Typography>
                  <Typography className={classes.secondaryHeading}>How to create forms</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Paper elevation={0} className={classes.descriptionPaper}>
                    <Typography variant="body1">
                      <b>Data Forms</b> are used for each unique item to be tracked. Let's say we
                      would to collect data for mammals. We start by creating a form to capture all
                      of the information about the mammals we want to track. For each mammal
                      attribute, we add a field to record information about that attribute.
                      <b> Prompts</b> are the name of the field. So to measure the mammal's length,
                      we would have a prompt called "Length". Then we can define the
                      <b> Field Type</b>. The field type could be a number, text field (single
                      line), text area (multiline) or another option from the drop down menu.
                      Finally, for each field we can indicate if that field is unique, identifying
                      or required when entering the data in the mobile application.
                    </Typography>
                    <br />
                    <Typography variant="body1">
                      <b>Session Forms</b> are used to define fields that are applicable to an
                      entire data collection outing. <b>Starting Form Fields</b> define information
                      to capture at the start of an outing (such as the recorders name/id).
                      <b> Ending Form Fields </b>
                      are displayed at the end of the mobile session. An example would be to leave
                      final comments about the data collection session.
                    </Typography>
                    <br />
                    <Typography variant="body1">
                      <b>Answer Sets</b> are used to generate lists to quickly pick from when
                      entering data in the mobile app. A list of species could be generated as an
                      answer set. Then that answer set can be used in a <b>combo box</b> field type
                      for "species". This will help make sure that valid data is easily entered by
                      the recorder on the mobile application.
                    </Typography>
                  </Paper>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel
                expanded={expanded === 'panel3'}
                onChange={this.handleChange('panel3')}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.expansionHeading}>Manage Data</Typography>
                  <Typography className={classes.secondaryHeading}>
                    View and edit data entries
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography variant="body1">
                    To <b>view</b> specific entries for sessions or data form entities, click on the
                    corresponding item on the left navigation menu. Individual entities (data forms)
                    or sessions can be edited or removed with the proper access level. This level is
                    indicated by the presence of a pencil icon (edit) and a trash icon (delete).
                    <br />
                    <br />
                    To <b>delete</b> an entire entry, click the trash icon and confirm removal of
                    this entry.
                    <br />
                    <br />
                    To<b> edit </b>data, click the edit icon on the row of data to enter edit mode.
                    Then data can be changed. Certain sensitive data, such as dates and times are
                    not able to be modified without corrupting the data. Therefore, if this
                    information is incorrect, it is recommended to delete the entire entry and add a
                    new one with the correct information. The remaining fields are able to be edited
                    in place. Once the desired changes have been made, click the check mark to save
                    the edits made. <br />
                    <br />
                    To <b>cancel</b> the changes, simply click the "X" icon to return to view mode.{' '}
                    <br />
                    <br />
                    To export <b>data</b>, click on the download icon located on the upper right
                    corner of the table view. This will begin a download in csv format.
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel
                expanded={expanded === 'panel4'}
                onChange={this.handleChange('panel4')}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.expansionHeading}>Mobile App</Typography>
                  <Typography className={classes.secondaryHeading}>
                    Syncing with Android App
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography variant="body1">
                    The first time syncing with the server, tap <b>Sync</b> in the Android app and
                    enter the server information. After the server information is entered, the
                    mobile app can be synced with the web server.
                    <br />
                    <br />
                    <i>
                      * As a best practice, it is recommended to sync the mobile application before
                      and after data collection to make sure information is up to date.
                    </i>
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(About);
