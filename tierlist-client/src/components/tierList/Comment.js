import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import LikeButton from './LikeButton';
import MyButton from '../../util/MyButton';
import DeleteButton from '../../util/DeleteButton';

// Icons
import ChatIcon from '@material-ui/icons/Chat';

// Mui Stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';

// Redux Stuff
import { connect } from 'react-redux';
// import {  } from '../redux/actions/dataActions';

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
        marginTop: '12px',
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
        fontWeight: 'bold',
    },
    commentCreatedAt: {
        fontWeight: '100',
        marginLeft: '10px',
        color: theme.palette.text.primary
    },
    commentContent: {
        whiteSpace: 'pre-wrap',
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
    }
});

class Comment extends Component {
    state = {
        replyInput: '',
        replyOpen: false,
    }
    hanldeReplyOpen = () => {
        this.setState({ replyOpen: !this.state.replyOpen });
    }
    hanldeReplyClose = () => {
        this.setState({ 
            replyInput: '',
            replyOpen: false,
        });
    }
    handleReplyInput = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    render() {
        const { classes, user: {authenticated, credentials: {isManager}} ,comment: { userName, userImage, userId, body, createdAt, likeCount, replyCount, commentId }} = this.props;

        return (
            <Grid container item xs={12}>
                <Grid item>
                    <Avatar className={classes.commentAvatar} alt={userName} src={userImage} />
                </Grid>
                <Grid item className={classes.commentInputGrid} container xs={11}>
                    <Grid item xs={11}>
                        <Typography color="secondary" className={classes.commentUserName} variant="body1" component={Link} to={`/users/${userId}`} color="secondary">{userName}</Typography>
                        <span className={classes.commentCreatedAt}>{dayjs(createdAt).fromNow()}</span>
                    </Grid>
                    {authenticated && (userId === this.props.user.credentials.userId || isManager) && <Grid item xs={1}>
                        <DeleteButton comment={this.props.comment}/>
                    </Grid>}
                    <Grid item xs={12}>
                        <Typography className={classes.commentContent} variant="body1">{body}</Typography>
                    </Grid>
                    <Grid className={classes.tierListCount} container>
                        <Grid item>
                            <LikeButton commentId={commentId} placement="top"></LikeButton>
                            <span>{likeCount} Likes</span>
                        </Grid>
                        <Grid item>
                            <MyButton onClick={this.hanldeReplyOpen} btnClassName={classes.commentButton} tip="Reply to comment" placement="top">
                                <ChatIcon color="secondary"></ChatIcon>
                            </MyButton>
                            <span>{replyCount} Replies</span>
                        </Grid>
                    </Grid>
                    {this.state.replyOpen && <Grid container item xs={12}>
                        <Grid item>
                            <Avatar className={classes.replyAvatar} alt={userName} src={userImage} />
                        </Grid>
                        <Grid className={classes.replyInputGrid} item xs={11}>
                            <TextField color="secondary" className={classes.commentInput} multiline placeholder="Reply..." name="replyInput" value={this.state.replyInput} type="text" onChange={this.handleReplyInput}></TextField>
                        </Grid>
                        <Grid container justify="flex-end" style={{ marginTop: '10px', marginLeft: '50px', width: '86%', }} item>
                            <Button className={classes.replyCancelButton} onClick={this.hanldeReplyClose}>Cancel</Button>
                            <Button className={classes.replyReplyButton} disabled={this.state.replyInput.trim() === ''} color="secondary" variant="contained">Reply</Button>
                        </Grid>
                    </Grid>}
                </Grid>
            </Grid>
        )
    }

}

Comment.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapActionsToProps = {
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Comment));