/*
 * File: CSVImport.js
 * Version: 1.01 US169
 * Date: 2020-03-02
 * Description: This code allows a user to import CSV data if they have that type of data filled out already.
 */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Papa from 'papaparse';

const styles = (theme) => ({
    csvImport: {
        position: 'relative',
        //padding: theme.spacing.unit * 3,
    },
    browseButton: {
        marginRight: theme.spacing.unit * 3,
        marginLeft: 15,
    },
    uploadButton: {
        marginRight: 15,
    },
});

class CSVImport extends React.Component {
    state = {
        csvfile: undefined,
        set: [],
    };

    handleChange = (event) => {
        if (event.target.files[0]) {
            this.setState({
                csvfile: event.target.files[0],
            });
        }
    };

    importCSV = () => {
        const { csvfile } = this.state;
        if (csvfile) {
            Papa.parse(csvfile, {
                complete: this.updateData,
                header: false,
            });
        }
    };

    updateData = (result) => {
        const parsedData = result.data[0];
        let answerData = [];
        parsedData.forEach(function (answer, index) {
            answerData[index] = { primary: answer };
        });
        this.setState({ set: answerData });
        this.props.onImport(this.state.set);
    };

    render() {
        const { csvfile } = this.state;
        const { classes } = this.props;

        return (
            <div className={classes.csvImport}>
                <Typography variant="h6">Import Answer Set (CSV)</Typography>
                <Button
                    variant="contained"
                    component="label"
                    color="secondary"
                    className={classes.browseButton}
                >
                    Browse
                    <input
                        className={classes.csvInput}
                        type="file"
                        accept=".csv"
                        name="file"
                        placeholder={null}
                        style={{ display: 'none' }}
                        onChange={this.handleChange}
                    />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.importCSV}
                    className={classes.uploadButton}
                >
                    Upload
                </Button>
                {csvfile ? csvfile.name : null}
            </div>
        );
    }
}

export default withStyles(styles)(CSVImport);
