import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LikeButton from './LikeButton';
import DeleteButton from '../../util/DeleteButton';

// Icons
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

// Mui Stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux Stuff
import { connect } from 'react-redux';
import { getComment } from '../../redux/actions/dataActions';

const styles = theme => ({
    ...theme.spreadThis,
    replyInputGrid: {
        marginTop: '12px',
        maxWidth: '86%',
    },
    replyUserName: {
        overflow: 'auto',
        fontWeight: 'bold',
    },
    replyCreatedAt: {
        fontWeight: '100',
        marginLeft: '10px',
        color: theme.palette.text.primary
    },
    replyContent: {
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        color: theme.palette.text.primaryStrong,
        marginTop: '5px',
    },
    tierListCount: {
        marginTop: '5px',
        "& span": {
            color: theme.palette.text.primary
        }
    },
    replyAvatar: {
        width: '30px',
        height: '30px',
        marginTop: '15px',
        marginRight: '20px',
    },
    progress: {
        marginLeft: '30px',
        marginTop: '15px',
    }
});

class Reply extends Component {
    state = {
        viewReplies: false,
    }
    handleToggle = () => {
        this.props.handleCommentClick();
        this.props.getComment(this.props.comment.commentId);
        this.setState({ viewReplies: !this.state.viewReplies });
    }
    render() {
        dayjs.extend(relativeTime);
        const { classes, UI: {loading}, user: {authenticated, credentials: { userId, isManager}}, comment: {replyCount, replies}} = this.props;
        const verb = this.state.viewReplies ? 'Hide' : 'View';

        const replyMarkup = replies.map(reply => (
            <Grid key={reply.replyId} container item xs={12}>
                <Grid item>
                    <Avatar className={classes.replyAvatar} alt={reply.userName} src={reply.userImage} />
                </Grid>
                <Grid item className={classes.replyInputGrid} container xs={12}>
                    <Grid item xs={11}>
                        <Typography color="secondary" className={classes.replyUserName} variant="body1" component={Link} to={`/users/${userId}`} color="secondary">{reply.userName}</Typography>
                        <span className={classes.replyCreatedAt}>{dayjs(reply.createdAt).fromNow()}</span>
                    </Grid>
                    {authenticated && (reply.userId === userId || isManager) && 
                    <Grid item xs={1}>
                        <DeleteButton handleViewClose={this.props.handleViewClose} reply={reply} handleDeleteAlertOpen={this.props.handleDeleteAlertOpen}/>
                    </Grid>}
                    <Grid item xs={12}>
                        <Typography className={classes.replyContent} variant="body1">{reply.body}</Typography>
                    </Grid>
                    <Grid className={classes.tierListCount} container>
                        <Grid item>
                            <LikeButton replyId={reply.replyId} placement="top"></LikeButton>
                            <span>{reply.likeCount} {reply.likeCount === 1 ? 'Like' : 'Likes'}</span>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        ));
        return (
            <Fragment>
                <Grid onClick={this.handleToggle} style={{marginTop:'5px',cursor: 'pointer'}} container>
                    {!this.state.viewReplies ? (<ArrowDropDownIcon color="secondary"/>) : (<ArrowDropUpIcon color="secondary" />)}
                    <Typography color="secondary" variant="body1">{verb} {replyCount} {replyCount > 1 ? 'replies' : 'reply'}</Typography>
                </Grid>
                {this.state.viewReplies && ( (loading && this.props.commentIndexClicked === this.props.index) ? <CircularProgress className={classes.progress} color="secondary" />: replyMarkup)}
            </Fragment>
        )
    }

}

Reply.propTypes = {
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    getComment: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI,
});

const mapActionsToProps = {
    getComment
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Reply));