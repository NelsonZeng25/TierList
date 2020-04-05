import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles/';
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.png';
import { Link } from 'react-router-dom';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';

// Redux stuff
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

// Icons
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';

const styles = theme => ({
    ...theme.spreadThis,
    underline: {
        // "&::before": {
        //     borderBottom: "1px solid #ffffff"
        //   },
        //   "&:hover:not(.Mui-disabled):before": {
        //     borderBottom: "2px solid #ffffff"
        //   },
        //   "&::after": {
        //     borderBottom: "2px solid #ffffff"
        //   }
        "&&&:before": {
            borderBottom: "none"
        },
        "&&:after": {
            borderBottom: "none"
        }
    },
});

export class login extends Component {
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            errors: {},
        }
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.UI.errors)
            this.setState({ errors: nextProps.UI.errors });
    }
    handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        }
        this.props.loginUser(userData, this.props.history);
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    render() {
        const { classes, UI: { loading } } = this.props;
        const { errors } = this.state;
        return (
            <Grid container className={classes.form}>
                <Grid className={classes.itemGrid} item sm>
                    <img src={AppIcon} alt="Monkey" className={classes.image}></img>
                    <Typography variant="h2" className={classes.pageTitle}>
                        Login
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id="email" name="email" type="email" placeholder="Email" className={classes.textField}
                            helperText={errors.email} error={errors.email ? true : false} value={this.state.email} 
                            onChange={this.handleChange} fullWidth variant="filled"
                            color="secondary" 
                            autoComplete='off'
                            InputProps={{
                                classes: {
                                    root: classes.cssInput,
                                    underline: classes.underline,
                                },
                                startAdornment: (
                                    <InputAdornment className={classes.inputAdornment} position="start">
                                      <EmailIcon className={classes.inputIcon}/>
                                    </InputAdornment>
                                  ),
                            }}
                            />
                        <TextField id="password" name="password" type="password" placeholder="Password" className={classes.textField}
                            helperText={errors.password} error={errors.password ? true : false} value={this.state.password} 
                            onChange={this.handleChange} fullWidth color="secondary" variant="filled"
                            InputProps={{
                                classes: {
                                    root: classes.cssInput,
                                    underline: classes.underline,
                                },
                                startAdornment: (
                                    <InputAdornment className={classes.inputAdornment} position="start">
                                      <LockIcon className={classes.inputIcon}/>
                                    </InputAdornment>
                                  ),
                            }}/>
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button type="submit" variant="contained" color='secondary' className={classes.button} disabled={loading}>
                            Sign In
                            {loading && (
                                <CircularProgress size={"1.5rem"} className={classes.progress}/>
                            )}
                        </Button>
                        <br />
                        <Typography variant="subtitle1" className={classes.login_signup_text}>Not a member? <Link className={classes.login_signup_link} to="/signup">Sign up now</Link></Typography>
                    </form>
                </Grid>
            </Grid>
        )
    }
}

login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

const mapActionsToProps = {
    loginUser
};
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login));
