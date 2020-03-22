import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.png';
import axios from 'axios';
import { Link } from 'react-router-dom';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
    form: {
        textAlign: 'center',
    },
    image: {
        margin: '1rem auto 1rem auto',
        maxWidth: '5rem'
    },
    pageTitle: {
        margin: '0.5rem auto 0.5rem auto',
    },
    textField: {
      margin: '0.5rem auto 0.5rem auto',
    },
    button: {
      marginTop: '1rem',
      position: 'relative',
    },
    customError: {
      color: 'red',
      fontSize: '0.8rem',
      marginTop: '0.5rem',
    },
    progress: {
      position: 'absolute'
    },
    signup: {
        marginTop: '1rem'
    },
};

export class login extends Component {
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            loading: false,
            errors: {},
        }
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        const userData = {
            email: this.state.email,
            password: this.state.password
        }
        axios.post('/login', userData)
            .then(res => {
                console.log(res.data);
                localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`);
                this.setState({ loading: false });
                this.props.history.push('/');
            })
            .catch(err => {
                this.setState({
                    errors: err.response.data,
                    loading: false
                })
            })
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    render() {
        const { classes } = this.props;
        const { errors, loading } = this.state;
        return (
            <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm>
                    <img src={AppIcon} alt="Monkey" className={classes.image}></img>
                    <Typography variant="h2" className={classes.pageTitle}>
                        Login
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id="email" name="email" type="email" label="Email" className={classes.textField}
                            helperText={errors.email} error={errors.email ? true : false} value={this.state.email} 
                            onChange={this.handleChange} fullWidth/>
                        <TextField id="password" name="password" type="password" label="Password" className={classes.textField}
                            helperText={errors.password} error={errors.password ? true : false} value={this.state.password} 
                            onChange={this.handleChange} fullWidth/>
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
                        <Typography variant="subtitle1" className={classes.signup}>Don't have an account? Sign up <Link to="/signup">here</Link></Typography>
                    </form>
                </Grid>
                <Grid item sm/>
            </Grid>
        )
    }
}

login.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(login);
