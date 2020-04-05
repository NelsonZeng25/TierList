import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LikeButton from './LikeButton';
import DeleteButton from '../../util/DeleteButton';
import MyButton from '../../util/MyButton';

// Icons
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import EditIcon from  '@material-ui/icons/Edit';

// Mui Stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// Redux Stuff
import { connect } from 'react-redux';
import { getComment, updateReply } from '../../redux/actions/dataActions';

const styles = theme => ({
    ...theme.spreadThis,
    replyInputGrid: {
        marginTop: '12px',
        maxWidth: '86%',
    },
    replyUserName: {
        overflowWrap: 'break-word',
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
    },
    editButton: {
        padding: '0 3px 0 0',
        float: 'right',
    },
    replyInput: {
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
    replyCancelButton: {
        marginRight: '10px',
    }
});

class Reply extends Component {
    state = {
        viewReplies: false,
        replyInput: '',
        replyIndex: -1,
    }
    handleToggle = () => {
        this.props.handleCommentClick();
        this.props.getComment(this.props.comment.commentId);
        this.setState({ viewReplies: !this.state.viewReplies });
    }
    handleReplyInput = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    handleEditReplyClick = (body, index) => {
        this.setState({ 
            replyInput: body,
            editMode: true,
            replyIndex: index,
        });
    }
    handleCancelEdit = (body) => {
        this.setState({ 
            replyInput: body,
            editMode: false,
        });
    }
    handleEditReply = (reply, replyData) => {
        this.props.updateReply(reply, replyData);
        this.setState({ editMode: false });
        this.props.handleUpdateAlertOpen();
    }
    render() {
        dayjs.extend(relativeTime);
        const { classes, UI: {loading}, user: {authenticated, credentials: { userId, isManager}}, comment: {replyCount, replies}} = this.props;
        const verb = this.state.viewReplies ? 'Hide' : 'View';

        const replyMarkup = replies.map((reply, index) => (
            <Grid key={reply.replyId} container item xs={12}>
                <Grid item>
                    <Avatar className={classes.replyAvatar} alt={reply.userName} src={reply.userImage} />
                </Grid>
                <Grid item className={classes.replyInputGrid} container xs={12}>
                    <Grid item xs={10}>
                        <Typography color="secondary" className={classes.replyUserName} variant="body1" component={Link} to={`/users/${userId}`} color="secondary">{reply.userName}</Typography>
                        <span className={classes.replyCreatedAt}>{dayjs(reply.createdAt).fromNow()}</span>
                    </Grid>
                    {authenticated  && <Grid item xs={2}>
                        {((userId === reply.userId) || isManager) && 
                            <DeleteButton handleCancelEdit={this.handleCancelEdit} handleViewClose={this.props.handleViewClose} reply={reply} handleDeleteAlertOpen={this.props.handleDeleteAlertOpen}/>
                        }
                        {userId === reply.userId &&
                            <MyButton tip="Edit Reply" placement="top" onClick={this.handleEditReplyClick.bind(this, reply.body, index)} btnClassName={classes.editButton}>
                                <EditIcon color="secondary" />
                            </MyButton>
                        }
                    </Grid>}
                    {!(this.state.editMode && this.state.replyIndex === index) ? (
                        <Grid item xs={12}>
                            <Typography className={classes.replyContent} variant="body1">{reply.body}</Typography>
                        </Grid>
                    ) : (
                        <Fragment>
                            <Grid item xs={12}>
                                <TextField color="secondary" className={classes.replyInput} multiline placeholder="Reply..." name="replyInput" value={this.state.replyInput} type="text" onChange={this.handleReplyInput}></TextField>
                            </Grid>
                            <Grid container justify="flex-end" style={{marginTop:'10px',width: '100%'}} item>
                                <Button className={classes.replyCancelButton} onClick={this.handleCancelEdit.bind(this, reply.body)}>Cancel</Button>
                                <Button className={classes.replyReplyButton} onClick={this.handleEditReply.bind(this, reply, {body: this.state.replyInput})} disabled={this.state.replyInput.trim() === ''} color="secondary" variant="contained">Update</Button>
                            </Grid>
                        </Fragment>
                    )}
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
    updateReply: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI,
});

const mapActionsToProps = {
    getComment,
    updateReply
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Reply));