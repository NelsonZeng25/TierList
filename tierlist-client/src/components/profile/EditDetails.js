import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from '../../util/MyButton';

// Redux stuff
import { connect } from 'react-redux';
import { editUserDetails } from '../../redux/actions/userActions';

// Mui stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';

// Icons
import EditIcon from '@material-ui/icons/Edit';
import PersonIcon from '@material-ui/icons/Person';
import LocationIcon from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import DescriptionIcon from '@material-ui/icons/Description';

const styles = theme => ({
    ...theme.spreadThis,
    button: {},
    dialog: {
        "& .MuiPaper-root": {
            backgroundColor: theme.palette.primary.main,
        }
    },
    textField: {
        width: '100%',
        marginTop: '20px',
        // '& .MuiInputBase-input': {
        //     color: '#fff', // Text color
        // },
        "& .MuiInputLabel-root": {
            color: theme.palette.text.primaryStrong,
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: theme.palette.text.primary, // Semi-transparent underline
        },
        '& .MuiInput-underline:hover:before': {
            borderBottomColor: theme.palette.text.primaryStrong, // Solid underline on hover
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: theme.palette.text.primaryStrong, // Solid underline on focus
        },
    },
});

class EditDetails extends Component {
    state = {
        userName: '',
        bio: '',
        website: '',
        location: '',
        open: false,
    };
    mapUserDetailsToState = (credentials) => {
        this.setState({
            userName: credentials.userName ? credentials.userName: '',
            bio: credentials.bio ? credentials.bio : '',
            website: credentials.website ? credentials.website : '',
            location: credentials.location ? credentials.location : '',
        })
    }
    handleOpen = () => {
        this.setState({
            open: true,
        });
        this.mapUserDetailsToState(this.props.credentials);
    }
    handleClose = () => {
        this.setState({
            open: false,
        })
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleSubmit = () => {
        const userDetails = {
            userName: this.state.userName,
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location,
        };
        this.props.editUserDetails(userDetails);
        this.handleClose();
    }
    componentDidMount(){
        const { credentials } = this.props;
        this.mapUserDetailsToState(credentials);
    }
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton tip="Edit details" placement="bottom" onClick={this.handleOpen} btnClassName={classes.button}>
                    <EditIcon color="secondary"/>
                </MyButton>
                <Dialog className={classes.dialog} open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>Edit your details</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField name="userName" type="text" label="Username" 
                                placeholder={this.state.userName} className={classes.textField}
                                value={this.state.userName} onChange={this.handleChange} fullWidth
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <PersonIcon color="secondary" />
                                      </InputAdornment>
                                    ),
                                  }}
                            ></TextField>
                            <TextField name="bio" type="text" label="Bio" multiline 
                                placeholder="A short bio about yourself" className={classes.textField}
                                value={this.state.bio} onChange={this.handleChange} fullWidth
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <DescriptionIcon color="secondary"/>
                                      </InputAdornment>
                                    ),
                                  }}
                            ></TextField>
                            <TextField name="website" type="text" label="Website" 
                                placeholder="Your personal/professional website" className={classes.textField}
                                value={this.state.website} onChange={this.handleChange} fullWidth
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LinkIcon color="secondary"/>
                                      </InputAdornment>
                                    ),
                                  }}
                            ></TextField>
                            <TextField name="location" type="text" label="Location" 
                                placeholder="Your location" className={classes.textField}
                                value={this.state.location} onChange={this.handleChange} fullWidth
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LocationIcon color="secondary"/>
                                      </InputAdornment>
                                    ),
                                  }}
                            ></TextField>
                            
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                        <Button onClick={this.handleSubmit} color="secondary">Save</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

EditDetails.propTypes ={
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state)=> ({
    credentials: state.user.credentials
})

export default connect(mapStateToProps, { editUserDetails })(withStyles(styles)(EditDetails));
