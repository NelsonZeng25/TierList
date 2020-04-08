import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

// MUI stuff
import MuiLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";

const styles = theme => ({
    ...theme.spreadThis,
  });

const StaticProfile = (props) => {
    const { classes, profile: { userName, userId, imageUrl, createdAt, bio, website, location} } = props;

    return (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img className="profile-image" src={imageUrl} alt="profile" />
                </div>
                <hr />
                <div className="profile-details">
                <MuiLink
                    component={Link}
                    to={`/users/${userId}`}
                    color="secondary"
                    variant="h5"
                    style={{overflowWrap: 'break-word'}}
                >
                    @{userName}
                </MuiLink>
                <hr />
                {bio && <Typography color="textPrimary" variant="body2" style={{whiteSpace: 'pre-wrap', letterSpacing: 0, overflowWrap: 'break-word'}}>{bio}</Typography>}
                <hr />
                {location && (
                    <Fragment>
                        <LocationOn color="secondary" /> <span style={{overflowWrap: 'break-word'}}>{location}</span>
                        <hr />
                    </Fragment>
                )}
                {website && (
                    <Fragment>
                    <LinkIcon color="secondary" />
                    <a href={website} className="website" target="_blank" rel="noopener noreferrer" style={{overflowWrap: 'break-word'}}>
                        {" "}
                        {website}
                    </a>
                    <hr />
                    </Fragment>
                )}
                <CalendarToday color="secondary" />{" "}
                <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
                <hr />
                </div>
            </div>
            </Paper>
    )
}

StaticProfile.propTypes = {
    profile: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(StaticProfile);