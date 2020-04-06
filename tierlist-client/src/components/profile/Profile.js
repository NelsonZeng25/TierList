import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import EditDetails from "./EditDetails";
import MyButton from "../../util/MyButton";
import ProfileSkeleton from '../../util/ProfileSkeleton';
import PostTierList from '../tierList/PostTierList';

// MUI Stuff
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';

// Redux stuff
import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../../redux/actions/userActions";

// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ImageIcon from '@material-ui/icons/Image';

const styles = theme => ({
  ...theme.spreadThis,
});

class Profile extends Component {
    handleImageChange = (event) => {
        const image = event.target.files[0];
        const formData = new FormData();
        formData.append('image', image, image.name);
        this.props.uploadImage(formData);
    }
    handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    }
    handleLogout = () => {
        this.props.logoutUser();
    }
    render() {
        const {
        classes,
        user: {
            credentials: {
              userId,
              userName,
              createdAt,
              imageUrl,
              bio,
              website,
              location
            },
            loading,
            authenticated
        }
        } = this.props;
        let profileMarkup = !loading ? (
        authenticated ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img className="profile-image" src={imageUrl} alt="profile" />
                        <input
                            type="file"
                            id="imageInput"
                            hidden="hidden"
                            onChange={this.handleImageChange}
                        />
                        <MyButton tip="Edit Profile picture" placement="top" onClick={this.handleEditPicture} btnClassName="button">
                            <ImageIcon color="secondary"/>
                        </MyButton>
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
                    </div>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        {/* <MyButton tip="Logout" placement="top" onClick={this.handleLogout}>
                            <ExitToAppIcon color="secondary"/>
                        </MyButton> */}
                        <Grid item xs={5} />
                        <Grid item xs={2}> 
                            <EditDetails/>
                        </Grid>
                        <Grid item xs={5} />
                    </Grid>
                </div>
            </Paper>
        ) : (
            <Paper className={classes.paper}>
            <Typography style={{color: 'white'}}variant="body2" align="center">
                No Profile found, login or sign up here!
            </Typography>
            <div className={classes.buttons}>
                <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/login"
                >
                Login
                </Button>
                <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/signup"
                >
                Sign Up
                </Button>
            </div>
            </Paper>
        )
        ) : (
          <ProfileSkeleton/>
        );
        return profileMarkup;
    }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = { logoutUser, uploadImage };

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));
