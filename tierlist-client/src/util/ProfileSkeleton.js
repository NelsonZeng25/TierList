import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import NoImg from '../images/no-img.png';

// MUI stuff
import Paper from '@material-ui/core/Paper';

// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";

const styles = theme => ({
    ...theme.spreadThis,
    userName: {
        height: '20px',
        backgroundColor: theme.palette.text.primary,
        width: '100px',
        margin: '0 auto 7px auto',
    },
    fullLine: {
        height: '15px',
        backgroundColor: 'rgba(0,0,0, 0.6)',
        width: '100%',
        marginBottom: '10px'
    },
    halfLine: {
        height: '15px',
        backgroundColor: 'rgba(0,0,0, 0.6)',
        width: '50%',
        marginBottom: '10px'
    }
});

const ProfileSkeleton = (props) => {
    const { classes } = props;
    return (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img src={NoImg} alt="profile" className="profile-image"></img>
                </div>
                <hr />
                <div className="profile-details">
                    <div className={classes.userName}></div>
                    <hr />
                    <div className={classes.fullLine}></div>
                    <div className={classes.fullLine}></div>
                    <LocationOn color="secondary"/> <span>Location</span>
                    <hr />
                    <LinkIcon color="secondary"/> <span>https://website.com</span>
                    <hr />
                    <CalendarToday color="secondary"/> <span>Joined date</span>
                    <hr />
                    <hr />
                    <hr />
                </div>
            </div>
        </Paper>
    );
};

ProfileSkeleton.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ProfileSkeleton);
