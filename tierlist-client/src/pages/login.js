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

// Redux stuff
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

const styles = theme => ({
    ...theme.spreadThis,
    cssLabel: {
        color: theme.palette.primary.contrastText
    },
    underline: {
        "&::before": {
            borderBottom: `1px solid ${theme.palette.primary.contrastText}`
          },
          "&:hover:not(.Mui-disabled):before": {
            borderBottom: `2px solid ${theme.palette.primary.contrastText}`
          },
          "&::after": {
            borderBottom: `2px solid ${theme.palette.primary.contrastText}`
          }
    },
    cssInput: {
        color: 'white'
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
                <Grid item sm/>
                <Grid className={classes.itemGrid} item sm>
                    <img src={AppIcon} alt="Monkey" className={classes.image}></img>
                    <Typography variant="h2" className={classes.pageTitle}>
                        Login
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id="email" name="email" type="email" label="Email" className={classes.textField}
                            helperText={errors.email} error={errors.email ? true : false} value={this.state.email} 
                            onChange={this.handleChange} fullWidth 
                            color="secondary" 
                            autoComplete='off'
                            InputLabelProps={{
                                classes: { root: classes.cssLabel }
                            }}
                            InputProps={{
                                classes: {
                                    input: classes.cssInput,
                                    underline: classes.underline,
                                }
                            }}
                            />
                        <TextField id="password" name="password" type="password" label="Password" className={classes.textField}
                            helperText={errors.password} error={errors.password ? true : false} value={this.state.password} 
                            onChange={this.handleChange} fullWidth color="secondary"
                            InputLabelProps={{
                                classes: { root: classes.cssLabel }
                            }}
                            InputProps={{
                                classes: {
                                    input: classes.cssInput,
                                    underline: classes.underline,
                                }
                            }}/>
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button type="submit" variant="contained" color="secondary" className={classes.button} disabled={loading}>
                            Login
                            {loading && (
                                <CircularProgress size={"1.5rem"} className={classes.progress}/>
                            )}
                        </Button>
                        <br />
                        <Typography variant="subtitle1" className={classes.login_signup_text}>Not a member? <Link className={classes.login_signup_link} to="/signup">Signup now</Link></Typography>
                    </form>
                </Grid>
                <Grid item sm/>
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
