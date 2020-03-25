import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.png';
import { Link } from 'react-router-dom';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import Typography  from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';

// Icons
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

// Redux stuff
import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';

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

export class signup extends Component {
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            userName: '',
            errors: {},
        }
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.UI.errors)
            this.setState({ errors: nextProps.UI.errors });
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            userName: this.state.userName,
        }
        this.props.signupUser(newUserData, this.props.history);
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
                        Sign Up
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id="userName" name="userName" type="text" placeholder="Username" className={classes.textField}
                            helperText={errors.userName} error={errors.userName ? true : false} value={this.state.userName} 
                            onChange={this.handleChange} fullWidth variant="filled"
                            color="secondary" 
                            InputProps={{
                                classes: {
                                    root: classes.cssInput,
                                    underline: classes.underline,
                                },
                                startAdornment: (
                                    <InputAdornment className={classes.inputAdornment} position="start">
                                      <PersonIcon className={classes.inputIcon}/>
                                    </InputAdornment>
                                  ),
                            }}/>
                        <TextField id="email" name="email" type="email" placeholder="Email" className={classes.textField}
                            helperText={errors.email} error={errors.email ? true : false} value={this.state.email} 
                            onChange={this.handleChange} fullWidth variant="filled"
                            color="secondary" 
                            autoComplete='off'
                            InputLabelProps={{
                                classes: { root: classes.cssLabel }
                            }}
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
                            }}/>
                        <TextField id="password" name="password" type="password" placeholder="Password" className={classes.textField}
                            helperText={errors.password} error={errors.password ? true : false} value={this.state.password} 
                            onChange={this.handleChange} fullWidth variant="filled"
                            color="secondary" 
                            InputLabelProps={{
                                classes: { root: classes.cssLabel }
                            }}
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
                        <TextField id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password" className={classes.textField}
                            helperText={errors.confirmPassword} error={errors.confirmPassword ? true : false} value={this.state.confirmPassword} 
                            onChange={this.handleChange} fullWidth variant="filled"
                            color="secondary" 
                            InputLabelProps={{
                                classes: { root: classes.cssLabel }
                            }}
                            InputProps={{
                                classes: {
                                    root: classes.cssInput,
                                    underline: classes.underline,
                                },
                                startAdornment: (
                                    <InputAdornment className={classes.inputAdornment} position="start">
                                      <VpnKeyIcon className={classes.inputIcon}/>
                                    </InputAdornment>
                                  ),
                            }}/>
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button type="submit" variant="contained" color="secondary" className={classes.button} disabled={loading}>
                            Sign up
                            {loading && (
                                <CircularProgress size={"1.5rem"} className={classes.progress}/>
                            )}
                        </Button>
                        <br />
                        <Typography variant="subtitle1" className={classes.login_signup_text}>Already have an account? Login <Link className={classes.login_signup_link} to="/login">here</Link></Typography>
                    </form>
                </Grid>
            </Grid>
        )
    }
}

signup.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
})


export default connect(mapStateToProps, { signupUser })(withStyles(styles)(signup));
