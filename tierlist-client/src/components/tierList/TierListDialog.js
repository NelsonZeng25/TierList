import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from '../../util/MyButton';
import { Link } from 'react-router-dom';
import LikeButton from "./LikeButton";
import Comments from './Comments';
import CommentForm from './CommentForm';

// MUI stuff
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons
import ChatIcon from '@material-ui/icons/Chat';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import UnfoledMore from '@material-ui/icons/UnfoldMore';

// Redux stuff
import { connect } from 'react-redux';
import { getTierList, clearErrors } from '../../redux/actions/dataActions';

const styles = theme => ({
    ...theme.spreadThis,
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
        oldPath: '',
        newPath: '',
    }
    componentDidMount(){
        if (this.props.openDialog) {
            this.handleOpen();
        }
    }
    handleOpen = () => {
        let oldPath = window.location.pathname;

        const { userId, tierListId } = this.props;
        const newPath = `/users/${userId}/tierList/${tierListId}`;

        if (oldPath === newPath) oldPath = `/users/${userId}`;

        window.history.pushState(null, null, newPath);

        this.setState({ open: true, oldPath, newPath });
        this.props.getTierList(this.props.tierListId);
    }
    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath);
        this.setState({ open: false });
        this.props.clearErrors();
    }

    render(){
        const { 
            classes, 
            tierList: { tierListId, tierItems, userName, userImage, userId, name, category, comments, commentCount, likeCount },
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
                    <LikeButton tierListId={tierListId}></LikeButton>
                    <span>{likeCount} likes</span>
                    <MyButton tip="comments">
                        <ChatIcon color="secondary"></ChatIcon>
                    </MyButton>
                    <span>{commentCount} Comments</span>
                </Grid>
                <hr className={classes.visibleSeperator} />
                <CommentForm tierListId={tierListId}/>
                <Comments comments={comments} />
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
    clearErrors: PropTypes.func.isRequired,
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
    getTierList,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(TierListDialog));