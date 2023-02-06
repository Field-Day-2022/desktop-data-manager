/*
 * File: SessionDetailCard.js
 * Version: 1.01
 * Date: 2020-03-07
 * Description: Provides a container for the rows on the datatable for the title of Session ID.
 */
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const styles = {
    container: {
        marginBottom: 20,
        padding: `10px 20px`,
    },
    detailHeader: {
        marginTop: 10,
        fontSize: 26,
    },
    detailLine: {
        fontSize: 14,
    },
    detailTitle: {
        fontWeight: 700,
    },
};

export default withStyles(styles)(
    class SessionDetailCard extends Component {
        render() {
            const { classes, title, row } = this.props;

            return (
                <Paper className={classes.container}>
                    <h3
                        className={classes.detailHeader}
                    >{`${title} - Entry ${row['Session ID']}`}</h3>
                    {Object.entries(row).map((entry, index) => {
                        return typeof entry[1] !== 'object' ? (
                            <p className={classes.detailLine} key={index}>
                                <span className={classes.detailTitle}>{`${entry[0]}: `}</span>
                                {entry[1]}
                            </p>
                        ) : null;
                    })}
                </Paper>
            );
        }
    }
);
