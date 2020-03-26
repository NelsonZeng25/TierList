import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import PostTierList from '../tierList/PostTierList';
import Notifications from './Notifications';
import { refreshCategoriesWithTierLists, getTierListsWithOneCategory } from '../../redux/actions/dataActions';

//MUI stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

// Icons
import HomeIcon from '@material-ui/icons/Home';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
    appbar: {
        backgroundColor: theme.palette.primary.dark,
    },
});

export class Navbar extends Component {
    state = {
        search: '',
    }
    handleInputSelected = (event, value, reason) => {
        console.log(reason);
        if (reason === 'select-option')  {
            this.setState({ search: value.name });
            this.props.getTierListsWithOneCategory(value.name);
        } else if (reason === 'clear') {
            this.props.refreshCategoriesWithTierLists();
        }
    }
    render() {
        const { classes, authenticated, data: { categories } } = this.props;
        return (
            <Fragment>
                <AppBar className={classes.appbar}>
                    <Toolbar className="nav-container">
                        {authenticated ? (
                            <Fragment className={classes.navItems}>
                                <Autocomplete
                                    id="search"
                                    name="search"
                                    options={categories}
                                    getOptionLabel={option => option.name}
                                    classes={{ option: classes.option, select: classes.select }}
                                    style={{ width: 250 }}
                                    autoHighlight
                                    onInputChange={this.handleInputChange}
                                    onChange={this.handleInputSelected}
                                    renderInput={params => 
                                        <TextField {...params} placeholder="Search" variant="outlined"/>
                                        }/>
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
    data: state.data,
    authenticated: state.user.authenticated,
})

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    categories: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
}

const mapActionsToProps = {
    refreshCategoriesWithTierLists,
    getTierListsWithOneCategory,
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Navbar));
