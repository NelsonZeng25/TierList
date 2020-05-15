import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles/';
import PropTypes from 'prop-types';
import axios from 'axios';
import dayjs from "dayjs";
import { Link } from 'react-router-dom';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';

// Redux stuff

// Icons


const styles = theme => ({
    ...theme.spreadThis,
    itemGrid: {
        margin: '0 auto',
        maxWidth: '400px',
    },
    search: {
        "& div": {
            height: '40px',
            width: '300px',
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.text.primary,
        },
        "& .MuiFormLabel-root": {
            color: theme.palette.text.primary,
        },
        "& .MuiFormLabel-root.Mui-focused": {
            color: theme.palette.text.primary,
        },
        "& .Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.text.primaryStrong,
            }
        },
    },
    userPaper: {
        backgroundColor: theme.palette.primary.main,
        padding: '10px',
        width: '100%',
        marginTop: '30px',
    },
    avatar: {
        height: '60px',
        width: '60px',
    },
    userName: {
        width: 'fit-content',
    }
});

export class users extends Component {
    state = {
        search: '',
        allUsers: [],
        viewUsers: [],
        loading: true,
    }
    componentDidMount() {
        axios.get('/users')
            .then(res => {
                this.setState({ 
                    allUsers: res.data,
                    viewUsers: res.data,
                    loading: false,
                });
            })
            .catch(err => console.log(err))
    }
    handleSearchChange = (event) => {
        const search = event.target.value;
        this.setState({ [event.target.name]: search });
        if (search.trim() !== '') {
            this.setState({ viewUsers: this.state.allUsers.filter(user => user.userName.toUpperCase().substring(0, search.length) === search.toUpperCase()) });
        } else {
            this.setState({ viewUsers: this.state.allUsers})
        }
    }
    render() {
        const { classes } = this.props;
        const userMarkup = (this.state.loading ? (
            <Fragment></Fragment>
        ) : (
            this.state.viewUsers.map(user => (
                <Paper className={classes.userPaper}>
                    <Grid container>
                        <Grid item>
                            <Avatar src={user.imageUrl} alt={user.userName} className={classes.avatar} component={Link} to={`/users/${user.userId}`}/>
                        </Grid>
                        <Grid item style={{padding: '5px 10px'}}>
                            <Typography variant="h5" color="secondary" className={classes.userName}><Link className={classes.login_signup_link} to={`/users/${user.userId}`}>{user.userName}</Link></Typography>
                            <Typography variant="body1" color="textPrimary" className={classes.userName}>Joined {dayjs(user.createdAt).format("MMM YYYY")}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            ))
        ));
        return (
            <Grid container className={classes.form}>
                <Grid className={classes.itemGrid} item sm>
                    <Typography style={{color: 'white'}} variant="h2" className={classes.pageTitle}>
                        Users
                    </Typography>
                    <TextField name="search" type="text" className={classes.search} autoComplete='off' onChange={this.handleSearchChange} value={this.state.search} variant="outlined" placeholder="Search Username"/>
                    {userMarkup}
                </Grid>
            </Grid>
        )
    }
}

users.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(users);
