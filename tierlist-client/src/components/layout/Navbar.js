import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import PostTierList from '../tierList/PostTierList';
import Notifications from './Notifications';
import Sidebar from './Sidebar';

//MUI stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

// Icons
import HomeIcon from '@material-ui/icons/Home';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
    appbar: {
        backgroundColor: theme.palette.primary.dark,
       
    }
});

export class Navbar extends Component {
    render() {
        const { classes, authenticated } = this.props
        return (
            <Fragment>
                <AppBar className={classes.appbar}>
                    <Toolbar className="nav-container">
                        {authenticated ? (
                            <Fragment>
                                <PostTierList />
                                <Link to='/'>
                                    <MyButton tip="Home">
                                        <HomeIcon color="secondary"></HomeIcon>
                                    </MyButton>
                                </Link>
                                <Notifications />
                            </Fragment>
                        ) : (
                            <Fragment>
                                <Button color="inherit" component={Link} to="/login">Login</Button>
                                <Button color="inherit" component={Link} to="/">Home</Button>
                                <Button color="inherit" component={Link} to="/signup">Signup</Button>
                            </Fragment>
                        )}
                    </Toolbar>
                </AppBar>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated,
})

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(withStyles(styles)(Navbar));
