import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Notifications from "./Notifications";
import {
  refreshCategoriesWithTierLists,
  getTierListsWithOneCategory
} from "../../redux/actions/dataActions";

//MUI stuff
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

// Icons
import HomeIcon from "@material-ui/icons/Home";
import { withStyles } from "@material-ui/core";

const styles = theme => ({
  appbar: {
    backgroundColor: theme.palette.primary.dark
  }
});

export class Navbar extends Component {
  handleInputSelected = (event, value, reason) => {
    if (reason === "select-option") {
      this.props.getTierListsWithOneCategory(value.name);
    } else if (reason === "clear") {
      this.props.refreshCategoriesWithTierLists();
    }
  };
  render() {
    const categories = this.props.data.categories;
    const { classes, authenticated } = this.props;
    return (
      <Fragment>
        <AppBar className={classes.appbar}>
          <Toolbar className="nav-container">
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
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder="Search"
                  variant="outlined"
                />
              )}
            />
            {authenticated && <Notifications />}
          </Toolbar>
        </AppBar>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
    data: state.data,
  categories: state.data.categories,
  authenticated: state.user.authenticated
});

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  categories: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired
};

const mapActionsToProps = {
  refreshCategoriesWithTierLists,
  getTierListsWithOneCategory
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Navbar));
