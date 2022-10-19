/*
 * File: NavigationUser.js
 * Version: 1.01
 * Date: 2020-03-07
 * Description: Sets and displays usernames and a logout button on the top right.
 */
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

const styles = {
    username: {
        marginRight: 10,
    },
};

class NavigationUser extends Component {
    state = {
        anchorEl: null,
    };

    componentDidMount() {}

    handleMenu = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
        this.props.signout();
    };

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        return (
            <div>
                <IconButton
                    aria-owns={open ? 'menu-appbar' : null}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                    color="inherit"
                >
                    <Typography variant="h6" color="inherit" className={classes.username}>
                        {this.props.username}
                    </Typography>
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleClose}>Logout</MenuItem>
                </Menu>
            </div>
        );
    }
}

export default withStyles(styles)(NavigationUser);
