import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from '../util/MyButton';
import { Link } from 'react-router-dom';

// MUI stuff
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import UnfoledMore from '@material-ui/icons/UnfoldMore';

// Redux stuff
import { connect } from 'react-redux';
import { getTierList } from '../redux/actions/dataActions';

const styles = theme => ({
    ...theme.spreadThis,
    invisibleSeperator: {
        border: 'none',
        margin: '4px'
    },
    profileImage: {
        maxWidth: '200px',
        height: '200px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    dialogContent: {
        padding: '20px'
    },
    closeButton: {
        position: 'absolute',
        top: '3%',
        left: '90%',
    },
    expandButton: {
        position: 'absolute',
        left: '90%',
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: '50px',
        marginBottom: '50px',
    }
});

class TierListDialog extends Component {
    state = {
        open: false,
    }
    handleOpen = () => {
        this.setState({ open: true });
        this.props.getTierList(this.props.tierListId);
    }
    handleClose = () => {
        this.setState({ open: false });
    }

    render(){
        const { 
            classes, 
            tierList: { tierListId, tierItems, userName, userImage, userId, name, category, commentCount, likeCount },
            UI: { loading }
        } = this.props;
        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={200} thickness={2}></CircularProgress>
            </div>
        ) : (
            <Grid container spacing={16}>
                <Grid item sm={5}>
                    <img src={userImage} alt="profile" className={classes.profileImage}></img>
                </Grid>
                <Grid item sm={7}>
                    <Typography component={Link} color="primary" variant="h5" to={`/users/${userId}`}>
                        @{userName}
                    </Typography>
                    <hr className={classes.invisibleSeperator}/>
                    <Typography variant="body2" color="textSecondary">
                        {category}
                    </Typography>
                    <hr className={classes.invisibleSeperator} />
                    <Typography variant="body1">
                        {name}
                    </Typography>
                </Grid>
            </Grid>
        )
        return(
            <Fragment>
                <MyButton btnClassName={classes.expandButton} tip="Expand Tier List" onClick={this.handleOpen}>
                    <UnfoledMore color="secondary"></UnfoledMore>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <MyButton tip="close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon></CloseIcon>
                    </MyButton>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

TierListDialog.propTypes = {
    getTierList: PropTypes.func.isRequired,
    tierListId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    tierList: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    tierList: state.data.tierList,
    UI: state.UI,
})

const mapActionsToProps = {
    getTierList
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(TierListDialog));