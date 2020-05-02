import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LikeButton from '../../util/LikeButton';
import MyButton from '../../util/MyButton';
import DeleteButton from '../../util/DeleteButton';
import Reply from  './Reply';
import SnackbarAlert from '../../util/SnackbarAlert';

// Icons
import ChatIcon from '@material-ui/icons/Chat';
import EditIcon from  '@material-ui/icons/Edit';

// Mui Stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';

// Redux Stuff
import { connect } from 'react-redux';
import { getComment, submitReply, updateComment } from '../../redux/actions/dataActions';

const styles = theme => ({
    ...theme.spreadThis,
    commentInputGrid: {
        maxWidth: '82%',
        // "@media (max-width: 1355px)": {
        //     maxWidth: '82%',
        // }
    },
    commentInput: {
        width: '100%',
        // '& .MuiInputBase-input': {
        //     color: '#fff', // Text color
        // },
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
    replyInput: {
        width: '100%',
        marginTop: '12px',
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
    commentAvatar: {
        width: '55px',
        height: '55px',
        marginRight: '20px',
    },
    commentCancelButton: {
        marginRight: '10px',
    },
    commentCommentButton: {
    },
    commentUserName: {
        overflowWrap: 'break-word',
        fontWeight: 'bold',
    },
    commentCreatedAt: {
        fontWeight: '100',
        marginLeft: '10px',
        color: theme.palette.text.primary
    },
    commentContent: {
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
    replyCancelButton: {
        marginRight: '10px',
    },
    replyReplyButton: {
    },
    replyInputGrid: {
        maxWidth: '86%'
    },
    editButton: {
        padding: '0 12px 0 0',
        float: 'right',
    },
});

class Comment extends Component {
    state = {
        replyInput: '',
        replyOpen: false,
        viewOpen: false,
        editMode: false,
        commentInput: this.props.comment.body,

        addReplyAlertOpen: false,
        updateReplyAlertOpen: false,
        deleteReplyAlertOpen: false,
    }
    handleReplyOpen = () => {
        this.setState({ replyOpen: !this.state.replyOpen });
    }
    handleReplyClose = () => {
        this.setState({ 
            replyInput: '',
            replyOpen: false,
        });
    }
    handleViewClose = () => {
        this.setState({ viewOpen: false });
    }
    handleReplyInput = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    handleSubmitReply = (commentId, replyData) => {
        this.props.handleCommentClick();
        this.props.submitReply(commentId, replyData);
        this.setState({ viewOpen: true });
        this.handleReplyClose();
        this.handleAddAlertOpen();
    }
    handleCommentInput = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    handleEditCommentClick = () => {
        this.setState({ editMode: true });
    }
    handleCancelEdit = () => {
        this.setState({ 
            commentInput: this.props.comment.body,
            editMode: false,
        });
    }
    handleEditComment = (comment, commentData) => {
        this.props.updateComment(comment, commentData);
        this.setState({ editMode: false });
        this.props.handleCommentUpdateAlertOpen();
    }

    handleAddAlertOpen = () => {
        this.setState({ addReplyAlertOpen: true });
    }
    handleUpdateAlertOpen = () => {
        this.setState({ updateReplyAlertOpen: true });
    }
    handleDeleteAlertOpen = () => {
        this.setState({ deleteReplyAlertOpen: true });
    }
    handleAddAlertClose = (event, reason) => {
        if (reason === 'clickaway') return;
        this.setState({ addReplyAlertOpen: false });
    }
    handleUpdateAlertClose = (event, reason) => {
        if (reason === 'clickaway') return;
        this.setState({ updateReplyAlertOpen: false });
    }
    handleDeleteAlertClose = (event, reason) => {
        if (reason === 'clickaway') return;
        this.setState({ deleteReplyAlertOpen: false });
    }
    render() {
        dayjs.extend(relativeTime);
        const { classes, user: {authenticated, credentials: {isManager, imageUrl}} ,comment: { userName, userImage, userId, body, createdAt, likeCount, replyCount, commentId }} = this.props;

        return (
            <Fragment>
                <Grid container item xs={12}>
                    <Grid item>
                        <Avatar className={classes.commentAvatar} alt={userName} src={userImage} />
                    </Grid>
                    <Grid item className={classes.commentInputGrid} container xs={11}>
                        <Grid className={classes.commentNameGrid} item xs={10}>
                            <Typography color="secondary" className={classes.commentUserName} variant="body1" component={Link} to={`/users/${userId}`}>{userName}</Typography>
                                <span className={classes.commentCreatedAt}>{dayjs(createdAt).fromNow()}</span>
                        </Grid>
                        {authenticated && <Grid className={classes.commentButtonGrid} item xs={2}>
                            {((userId === this.props.user.credentials.userId) || isManager) && 
                                <DeleteButton comment={this.props.comment} handleCancelEdit={this.handleCancelEdit} handleDeleteAlertOpen={this.props.handleCommentDeleteAlertOpen}/>
                            }
                            {userId === this.props.user.credentials.userId &&
                                <MyButton tip="Edit Comment" placement="top" onClick={this.handleEditCommentClick} btnClassName={classes.editButton}>
                                    <EditIcon color="secondary" />
                                </MyButton>
                            }  
                        </Grid>}
                        {!this.state.editMode ? ( 
                            <Grid item xs={12}>
                                <Typography className={classes.commentContent} variant="body1">{body}</Typography>
                            </Grid>
                        ) : (
                            <Fragment>
                                <Grid item xs={12}>
                                    <TextField color="secondary" className={classes.commentInput} multiline placeholder="Write a comment..." name="commentInput" value={this.state.commentInput} type="text" onChange={this.handleCommentInput}></TextField>
                                </Grid>
                                <Grid container justify="flex-end" style={{marginTop:'10px',width: '100%'}} item>
                                    <Button className={classes.commentCancelButton} onClick={this.handleCancelEdit}>Cancel</Button>
                                    <Button className={classes.commentCommentButton} onClick={this.handleEditComment.bind(this, this.props.comment, {body: this.state.commentInput})} disabled={this.state.commentInput.trim() === ''} color="secondary" variant="contained">Update</Button>
                                </Grid>
                            </Fragment>
                        )}
                        <Grid className={classes.tierListCount} container>
                            <Grid item>
                                <LikeButton commentId={commentId} placement="top"></LikeButton>
                                <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
                            </Grid>
                            <Grid item>
                                {authenticated ? (
                                    <MyButton onClick={this.handleReplyOpen} btnClassName={classes.commentButton} tip="Reply to comment" placement="top">
                                        <ChatIcon color="secondary"></ChatIcon>
                                    </MyButton>
                                ) : (
                                    <Link to="/login">
                                        <MyButton btnClassName={classes.commentButton} tip="Reply to comment" placement="top">
                                            <ChatIcon color="secondary"></ChatIcon>
                                        </MyButton>
                                    </Link>
                                )}
                                <span>{replyCount} Replies</span>
                            </Grid>
                        </Grid>
                        {this.state.replyOpen && <Grid container item xs={12}>
                            <Grid item>
                                <Avatar className={classes.replyAvatar} alt={userName} src={imageUrl} />
                            </Grid>
                            <Grid className={classes.replyInputGrid} item xs={11}>
                                <TextField color="secondary" className={classes.replyInput} multiline placeholder="Reply to comment..." name="replyInput" value={this.state.replyInput} type="text" onChange={this.handleReplyInput}></TextField>
                            </Grid>
                            <Grid container justify="flex-end" style={{ marginTop: '10px', marginLeft: '50px', width: '86%', }} item>
                                <Button className={classes.replyCancelButton} onClick={this.handleReplyClose}>Cancel</Button>
                                <Button className={classes.replyReplyButton} onClick={this.handleSubmitReply.bind(this, commentId, {body: this.state.replyInput})} disabled={this.state.replyInput.trim() === ''} color="secondary" variant="contained">Reply</Button>
                            </Grid>
                        </Grid>}
                        {(replyCount > 0 || this.state.viewOpen) && 
                            <Reply handleCommentClick={this.props.handleCommentClick} commentIndexClicked={this.props.commentIndexClicked} index={this.props.index} 
                            handleViewClose={this.handleViewClose} comment={this.props.comment} handleDeleteAlertOpen={this.handleDeleteAlertOpen} handleUpdateAlertOpen={this.handleUpdateAlertOpen}/>}
                    </Grid>
                </Grid>
                <SnackbarAlert 
                    reply={true}
                    add={true} addAlertOpen={this.state.addReplyAlertOpen} handleAddAlertClose={this.handleAddAlertClose}
                    update={true} updateAlertOpen={this.state.updateReplyAlertOpen} handleUpdateAlertClose={this.handleUpdateAlertClose}
                    delete={true} deleteAlertOpen={this.state.deleteReplyAlertOpen} handleDeleteAlertClose={this.handleDeleteAlertClose}
                />
            </Fragment>
        )
    }

}

Comment.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    getComment: PropTypes.func.isRequired,
    submitReply: PropTypes.func.isRequired,
    updateComment: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapActionsToProps = {
    getComment,
    submitReply,
    updateComment,
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Comment));