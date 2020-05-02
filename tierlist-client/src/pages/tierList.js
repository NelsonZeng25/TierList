import React, { Component, Fragment } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Profile from '../components/profile/Profile';
import TierItemSkeleton from '../util/TierItemSkeleton';
import withStyles from '@material-ui/core/styles/withStyles';
import ProfileSkeleton from '../util/ProfileSkeleton';
import StaticProfile from '../components/profile/StaticProfile';
import TierItem from  '../components/tierItem/TierItem';
import Comment from '../components/tierList/Comment';
import LikeButton from '../util/LikeButton';
import SnackbarAlert from '../util/SnackbarAlert';

import ChatIcon from '@material-ui/icons/Chat';

// MUI Stuff
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux Stuff
import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/userActions';
import { getTierList, getTierItemsForOneCategory, submitComment } from '../redux/actions/dataActions';


const styles = theme => ({
    ...theme.spreadThis,
    gridProfile: {
        "@media (max-width:1200px)": {
            maxWidth: '100%',
            flexBasis: '100%',
        }
    },
    gridTierLists: {
        height: 'fit-content',
        "@media (max-width:1200px)": {
            maxWidth: '100%',
            flexBasis: '100%',
        },
    },
    gridTierList: {
        "@media (max-width:950px)": {
            maxWidth: '100%',
            flexBasis: '100%',
        }
    },
    tierWrapper: {
        "& h2": {
            marginTop: '10px',
            textAlign: 'center',
        }
    },
    S: { color: 'gold' },
    A: { color: '#fa2a2a' },
    B: { color: 'orange' },
    C: { color: 'lawngreen' },
    D: { color: 'deepskyblue' },
    E: { color: 'mediumpurple' },
    F: { color: 'hotpink' },

    commentSeperator: {
        width: '100%',
        borderBottom: '1px solid rgb(0,0,0, 0.1)',
        marginBottom: '20px',
        marginTop: '100px',
        height: 'min-content',
    },
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
    likeCommentGrid: {
        "& svg": {
            marginTop: '-5px',
        }
    },
    chatIcon: {
        marginLeft: '30px', 
        marginRight: '10px',
        marginTop: '0px !important',
    },
    progress: {
        width: '60px',
        height: '60px',
        marginRight: '200px',
    }
});

export class tierList extends Component {
    state = {
        profile: null,
        open: false,
        commentInput: '',
        commentIndexClicked: -1,

        updateTierItemAlertOpen: false,
        deleteTierItemAlertOpen: false,

        addCommentAlertOpen: false,
        updateCommentAlertOpen: false,
        deleteCommentAlertOpen: false,
    }
    componentDidMount() {
        // Get the Tier List
        const tierListId = this.props.match.params.tierListId;
        this.props.getTierList(tierListId);

        // Get the user associated to Tier List
        // const userId = this.props.data.tierList.userId;
        // axios.get(`/users/${userId}`)
        //     .then(res => {
        //         this.setState({ profile: res.data.user })
        //     })
        //     .catch(err => console.log(err))
        
    }
    handleCommentInput = (event) => {
        this.setState({ [event.target.name]: event.target.value});
    }
    handleCancelComment = () => {
        this.setState({ commentInput: ''});
    }
    handleSubmitComment = (tierListId, commentData) => {
        this.props.submitComment(tierListId, commentData);
        this.handleCancelComment();
        this.handleCommentAddAlertOpen();
    }
    handleCommentClick = (index) => {
        this.setState({ commentIndexClicked: index });
    }
    handleUpdateAlertOpen = () => {
        this.setState({ updateTierItemAlertOpen: true });
    }
    handleDeleteAlertOpen = () => {
        this.setState({ deleteTierItemAlertOpen: true });
    }
    handleUpdateAlertClose = (event, reason) => {
        if (reason === 'clickaway') return;
        this.setState({ updateTierItemAlertOpen: false });
    }
    handleDeleteAlertClose = (event, reason) => {
        if (reason === 'clickaway') return;
        this.setState({ deleteTierItemAlertOpen: false });
    }

    handleCommentAddAlertOpen = () => {this.setState({ addCommentAlertOpen: true });}
    handleCommentAddAlertClose = (event, reason) => {
        if (reason === 'clickaway') return;
        this.setState({ addCommentAlertOpen: false });
    }
    handleCommentUpdateAlertOpen = () => {this.setState({ updateCommentAlertOpen: true });}
    handleCommentUpdateAlertClose = (event, reason) => {
        if (reason === 'clickaway') return;
        this.setState({ updateCommentAlertOpen: false });
    }
    handleCommentDeleteAlertOpen = () => {this.setState({ deleteCommentAlertOpen: true });}
    handleCommentDeleteAlertClose = (event, reason) => {
        if (reason === 'clickaway') return;
        this.setState({ deleteCommentAlertOpen: false });
    }
    render() {
        const { classes, user: { authenticated, credentials: { userId, imageUrl, userName } }, data: { loading, viewTierList, tierList: {tierListId, comments, commentCount, likeCount}} } = this.props;

        const tierItemsMarkup = (tier) => (
            viewTierList[tier].map(tierItem => (
                <Grid className={classes.gridTierList} key={tierItem.tierItemId} item xs={6}>
                    <TierItem handleDeleteAlertOpen={this.handleDeleteAlertOpen} handleUpdateAlertOpen={this.handleUpdateAlertOpen} key={tierItem.tierItemId} tierItem={tierItem} />
                </Grid>
        )));
        const tierMarkup = (tier) => (
            <Grid className={classes.tierWrapper} item xs={12}>
                <Typography variant="h2" key={tier} className={classes[tier]}>{tier} TIER</Typography>
                <hr className={classes.visibleSeperator}/>
            </Grid>
        );
        const tierWithTierItemsMarkup = !loading ? (
            Object.keys(viewTierList).map(tier => (
                <Fragment key={tier}>
                    {viewTierList[tier].length > 0 && tierMarkup(tier)}
                    {tierItemsMarkup(tier)}
                </Fragment>
            ))
        ) : (
            <Fragment>
                <Grid className={classes.tierWrapper} item xs={12}>
                    <Typography variant="h2" className={classes.S}>S TIER</Typography>
                    <hr className={classes.visibleSeperator}/>
                </Grid>
                {Array.from({ length: 6 }).map((item, index) => (
                    <Grid className={classes.gridTierList} key={index} item xs={6}>
                        <TierItemSkeleton />
                    </Grid>
                ))}
            </Fragment>
        );
        return (
            <Fragment>
                <Grid className="grid-container" container spacing={3}>
                    <Grid className={classes.gridProfile} container direction="column" item xs={3} spacing={0}>
                        <Typography variant="h3" className={classes.pageName}>TIER LIST</Typography>
                        <Typography variant="h4" className={classes.pageName} style={{textDecoration: 'unset'}}>{this.props.data.tierList.name}</Typography>
                        <Grid item>
                            {loading ? (
                                <ProfileSkeleton/>
                            ): ( this.props.data.tierList.userId === userId ? (
                                <Profile/>
                            ) : (
                                <StaticProfile userId={this.props.data.tierList.userId} />
                            ))}
                        </Grid>
                    </Grid>
                    <Grid className={classes.gridTierLists} container item xs={9} spacing={3} justify="center">
                        {tierWithTierItemsMarkup}
                        <hr className={classes.commentSeperator} />
                        <Grid className={classes.likeCommentGrid} item xs={12} container>
                            <Grid item>
                                <LikeButton fontSize="large" tierListId={tierListId} placement="top" />
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" color="textPrimary">{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</Typography>
                            </Grid>
                            <Grid item>
                                <ChatIcon className={classes.chatIcon} fontSize="large" color="secondary" />
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" color="textPrimary">{commentCount} Comments</Typography>
                            </Grid>
                        </Grid>
                        {authenticated && <Grid container item xs={12}>
                            <Grid item>
                                <Avatar className={classes.commentAvatar} alt={userName} src={imageUrl} />
                            </Grid>
                            <Grid className={classes.commentInputGrid} item xs={11}>
                                <TextField color="secondary" className={classes.commentInput} multiline placeholder="Write a comment..." name="commentInput" value={this.state.commentInput} type="text" onChange={this.handleCommentInput}></TextField>
                            </Grid>
                            <Grid container justify="flex-end" style={{marginTop:'10px',width: '82%',marginLeft:'75px'}} item>
                                <Button className={classes.commentCancelButton} onClick={this.handleCancelComment}>Cancel</Button>
                                <Button className={classes.commentCommentButton} onClick={this.handleSubmitComment.bind(this, tierListId, {body: this.state.commentInput})} disabled={this.state.commentInput.trim() === ''} color="secondary" variant="contained">Comment</Button>
                            </Grid>
                        </Grid>}
                        {!loading && comments !== undefined && comments.map((comment, index) => (
                                <Comment handleCommentClick={this.handleCommentClick.bind(this, index)} key={comment.commentId} commentIndexClicked={this.state.commentIndexClicked} index={index} comment={comment} handleCommentDeleteAlertOpen={this.handleCommentDeleteAlertOpen} handleCommentUpdateAlertOpen={this.handleCommentUpdateAlertOpen}/>
                        ))}
                        {loading && 
                            <CircularProgress className={classes.progress} color="secondary" />
                        }
                    </Grid>
                </Grid>
                <SnackbarAlert 
                    tierItemInTierList={true}
                    update={true} updateAlertOpen={this.state.updateTierItemAlertOpen} handleUpdateAlertClose={this.handleUpdateAlertClose}
                    delete={true} deleteAlertOpen={this.state.deleteTierItemAlertOpen} handleDeleteAlertClose={this.handleDeleteAlertClose}
                />
                <SnackbarAlert 
                    comment={true}
                    add={true} addAlertOpen={this.state.addCommentAlertOpen} handleAddAlertClose={this.handleCommentAddAlertClose}
                    update={true} updateAlertOpen={this.state.updateCommentAlertOpen} handleUpdateAlertClose={this.handleCommentUpdateAlertClose}
                    delete={true} deleteAlertOpen={this.state.deleteCommentAlertOpen} handleDeleteAlertClose={this.handleCommentDeleteAlertClose}
                />
            </Fragment>
        );
    }
}

tierList.propTypes = {
    user: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    getUserData: PropTypes.func.isRequired,
    getTierList: PropTypes.func.isRequired,
    getTierItemsForOneCategory: PropTypes.func.isRequired,
    submitComment: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    data: state.data,
    user: state.user,
});

const mapActionsToProps = {
    getUserData,
    getTierList,
    getTierItemsForOneCategory,
    submitComment,
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(tierList));
