import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Notifications from "./Notifications";
import { Link, withRouter } from 'react-router-dom';
import SnackbarAlert from '../../util/SnackbarAlert';

//MUI stuff
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// Icons
import HomeIcon from "@material-ui/icons/Home";
import { withStyles } from "@material-ui/core";

// Redux stuff
import {
  refreshCategoriesWithTierLists,
  getTierListsWithOneCategory,
  getCategories,
  postTierList,
  clearErrors
} from "../../redux/actions/dataActions";

const styles = theme => ({
  appbar: {
    backgroundColor: theme.palette.primary.dark
  },
  button: {
    marginRight: '20px',
  },
  "@media only screen and (max-width: 600px)": {
    button: {
      fontSize: '12px',
    }
  },
  dialog: {
    "& .MuiPaper-root": {
      backgroundColor: theme.palette.primary.main,
    }
  },
  dialogTitle: {
    color: theme.palette.text.primaryStrong,
  },
  textField: {
    "& .MuiFormLabel-root": {
      color: theme.palette.text.primary,
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: theme.palette.text.primary,
    },
    "& .Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primaryStrong,
      }
    },
  },
  submitButton: {
    margin: '10px 0px'
  }
});

export class Navbar extends Component {
  state = {
    name: '',
    category: '',
    open: false,
    errors: {},

    addTierListAlertOpen: false,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      })
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({
        name: '',
        category: '',
        open: false,
        errors: {},
      });
    }
  }
  componentDidMount() {
    this.props.getCategories();
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  handleCategorySelected = (event, value, reason) => {
    if (reason === "select-option") {
      this.setState({ category: value });
    }
  }
  handleOpen = () => {
    this.setState({
      open: true,
    })
  }
  handleClose = () => {
    this.props.clearErrors();
    this.setState({
      open: false,
      errors: {},
    })
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.postTierList({
      name: this.state.name,
      category: this.state.category,
    })
    if (Object.keys(this.state.errors).length === 0) {
      this.handleClose();
      this.handleAddAlertOpen();
      setTimeout(() => {
        this.props.history.push(`/users/${this.props.userId}/tierLists/${this.props.tierList.tierListId}`);
      }, 1000);
    }
  }
  handleInputSelected = (event, value, reason) => {
    if (reason === "select-option") {
      this.props.getTierListsWithOneCategory(value);
    } else if (reason === "clear") {
      this.props.refreshCategoriesWithTierLists();
    }
  };

  handleAddAlertOpen = () => {
    this.setState({ addTierListAlertOpen: true });
  }
  handleAddAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    this.setState({ addTierListAlertOpen: false });
  }
  render() {
    const { errors } = this.state;
    const { classes, categories, authenticated, userId, tierList, UI: { loading } } = this.props;
    return (
      <Fragment>
        <AppBar className={classes.appbar}>
          <Toolbar className="nav-container">
            {authenticated ? (
              <Fragment>
                <Button className={classes.button} onClick={this.handleOpen} variant="contained" color="secondary">
                  Create Tier List
                </Button>
                <Dialog className={classes.dialog} open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                  <DialogTitle className={classes.dialogTitle} >Tier List Information</DialogTitle>
                  <DialogContent>
                    <form onSubmit={this.handleSubmit}>
                      <TextField name="name" type="text" label="Tier List Name"
                        className={classes.textField} value={this.state.name} autoComplete='off'
                        onChange={this.handleChange} fullWidth variant="outlined"
                        error={errors.name ? true : false} helperText={errors.name}
                      ></TextField>
                      <Autocomplete
                        freeSolo
                        name="category"
                        options={categories.map(option => option.name)}
                        onChange={this.handleCategorySelected}
                        renderInput={params => (
                          <TextField {...params} className={classes.textField} onChange={this.handleChange}
                            name="category" label="Category" margin="normal" variant="outlined"
                            error={errors.category ? true : false} helperText={errors.category} />
                        )}
                      />
                      <Grid container justify="center">
                        <Button className={classes.submitButton} type="submit" variant="contained" color="secondary" disabled={loading}>Create</Button>
                      </Grid>
                    </form>
                  </DialogContent>
                </Dialog>
              </Fragment>
            ) : (
                <Fragment>
                  <Link to="/login">
                    <Button className={classes.button} variant="contained" color="secondary">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className={classes.button} variant="contained" color="secondary">Sign up</Button>
                  </Link>
                </Fragment>
              )}
            <Autocomplete
              id="search"
              name="search"
              options={categories.map(option => option.name)}
              style={{ width: 250 }}
              autoHighlight
              onChange={this.handleInputSelected}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder="Search category"
                  variant="outlined"
                />
              )}
            />
            {authenticated && <Notifications />}
          </Toolbar>
        </AppBar>
        <SnackbarAlert
          tierList={true}
          add={true} addAlertOpen={this.state.addTierListAlertOpen} handleAddAlertClose={this.handleAddAlertClose}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.data.categories,
  authenticated: state.user.authenticated,
  userId: state.user.credentials.userId,
  tierList: state.data.tierList,
  UI: state.UI,
});

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  tierList: PropTypes.object,
  userId: PropTypes.string,
  categories: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  getTierListsWithOneCategory: PropTypes.func.isRequired,
  refreshCategoriesWithTierLists: PropTypes.func.isRequired,
  getCategories: PropTypes.func.isRequired,
  postTierList: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapActionsToProps = {
  refreshCategoriesWithTierLists,
  getTierListsWithOneCategory,
  getCategories,
  postTierList,
  clearErrors,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(withRouter(Navbar)));
