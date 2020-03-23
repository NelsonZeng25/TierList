import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import EditDetails from "./EditDetails";

// MUI Stuff
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

// Redux stuff
import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../redux/actions/userActions";

// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

const styles = theme => ({
  ...theme.spreadThis,
  paper: {
    background: theme.palette.primary.main,
    padding: 20
  },
  profile: {
    "& .image-wrapper": {
      textAlign: "center",
      position: "relative",
      "& button": {
        position: "absolute",
        top: "80%",
        left: "70%"
      }
    },
    "& .profile-image": {
      width: 200,
      height: 200,
      objectFit: "cover",
      maxWidth: "100%",
      borderRadius: "50%",
      border: '4px solid white'
    },
    "& .profile-details": {
      textAlign: "center",
      "& span": {
        color: theme.palette.primary.contrastText
      },
      "& span, svg": {
        verticalAlign: "middle"
      },
      "& a": {
        color: theme.palette.primary.contrastText
      }
    },
    "& hr": {
      border: "none",
      margin: "0 0 10px 0"
    },
    "& svg.button": {
      "&:hover": {
        cursor: "pointer"
      }
    }
  },
  buttons: {
    textAlign: "center",
    "& a": {
      margin: "20px 10px"
    }
  }
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
                    <Tooltip title="Edit profile picture" placement="top">
                        <IconButton onClick={this.handleEditPicture} className="button">
                            <EditIcon color="secondary"/>
                        </IconButton>
                    </Tooltip>
                </div>
                <hr />
                <div className="profile-details">
                <MuiLink
                    component={Link}
                    to={`/users/${userId}`}
                    color="secondary"
                    variant="h5"
                >
                    @{userName}
                </MuiLink>
                <hr />
                {bio && <Typography style={{color:'white'}} variant="body2">{bio}</Typography>}
                <hr />
                {location && (
                    <Fragment>
                        <LocationOn color="secondary" /> <span>{location}</span>
                        <hr />
                    </Fragment>
                )}
                {website && (
                    <Fragment>
                    <LinkIcon color="secondary" />
                    <a href={website} target="_blank" rel="noopener noreferrer">
                        {" "}
                        {website}
                    </a>
                    <hr />
                    </Fragment>
                )}
                <CalendarToday color="secondary" />{" "}
                <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
                </div>
                <Tooltip title="Logout" placement="top">
                    <IconButton onClick={this.handleLogout}>
                        <KeyboardReturn color="secondary"></KeyboardReturn>
                    </IconButton>
                </Tooltip>
                <EditDetails/>
            </div>
            </Paper>
        ) : (
            <Paper className={classes.paper}>
            <Typography variant="body2" align="center">
                No Profile found, please login again
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
        <p>loading...</p>
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
