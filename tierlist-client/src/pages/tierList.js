import React, { Component, Fragment } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Profile from '../components/profile/Profile';
import TierListSkeleton from '../util/TierListSkeleton';
import withStyles from '@material-ui/core/styles/withStyles';
import ProfileSkeleton from '../util/ProfileSkeleton';
import StaticProfile from '../components/profile/StaticProfile';
import TierListDialog from '../components/tierList/TierListDialog';
import TierItem from  '../components/tierItem/TierItem';

// MUI Stuff
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';

// Redux Stuff
import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/userActions';
import { getTierList, getTierItemsForOneCategory } from '../redux/actions/dataActions';


const styles = theme => ({
    ...theme.spreadThis,
    gridProfile: {
        "@media (max-width:1200px)": {
            maxWidth: '100%',
            flexBasis: '100%',
        }
    },
    gridTierLists: {
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
    },
    commentInputGrid: {
        "@media (max-width: 1355px)": {
            maxWidth: '82%',
        }
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
        marginRight: '20px',
    }
});

export class tierList extends Component {
    state = {
        profile: null,
        open: false,
        commentInput: '',
    }
    componentDidMount() {
        // Get the Tier List
        const tierListId = this.props.match.params.tierListId;
        this.props.getTierList(tierListId);

        // Get the user associated to Tier List
        const userId = this.props.match.params.userId;
        axios.get(`/users/${userId}`)
            .then(res => {
                this.setState({ profile: res.data.user })
            })
            .catch(err => console.log(err))
        
    }
    handleCommentInput = (event) => {
        this.setState({ [event.target.name]: event.target.value});
    }
    handleCancelComment = () => {
        this.setState({ commentInput: ''});
    }
    render() {
        const { classes, user: { authenticated, credentials: { userId, imageUrl, userName } }, data: { viewTierList, tierList: {comments}} } = this.props;
        const { loading } = this.props.data;

        const tierItemsMarkup = (tier) => (
            viewTierList[tier].map(tierItem => (
                <Grid className={classes.gridTierList} key={tierItem.tierItemId} item xs={6}>
                    <TierItem key={tierItem.tierItemId} tierItem={tierItem} />
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
                <Typography variant="h5" className={classes.categoryName}>S-Rank</Typography>
                <hr className={classes.visibleSeperator}/>
                {Array.from({ length: 10 }).map((item, index) => (
                    <Grid className={classes.gridTierList} key={index} item xs={6}>
                        <TierListSkeleton />
                    </Grid>
                ))}
            </Fragment>
        );
        return (
            <Grid className="grid-container" container spacing={3}>
                <Grid className={classes.gridProfile} container direction="column" item xs={3} spacing={0}>
                    <Typography variant="h3" className={classes.pageName}>TIER LIST:</Typography>
                    <Typography variant="h4" className={classes.pageName}>{this.props.data.tierList.name}</Typography>
                    <Grid item>
                        {this.state.profile === null ? (
                            <ProfileSkeleton/>
                        ): ( this.state.profile.userId === userId ? (
                            <Profile/>
                        ) : (
                            <StaticProfile profile={this.state.profile} />
                        ))}
                        <TierListDialog handleEditTierItem={this.handleEditTierItem}/>
                    </Grid>
                </Grid>
                <Grid className={classes.gridTierLists} container item xs={9} spacing={3} justify="center">
                    {tierWithTierItemsMarkup}
                    <hr className={classes.commentSeperator} />
                    <Grid item xs={12}>
                        <Typography variant="h5" color="textPrimary">{comments ? (comments.length) : 0} Comments</Typography>
                    </Grid>
                    {authenticated && <Grid container item xs={12}>
                        <Grid item>
                            <Avatar className={classes.commentAvatar} alt={userName} src={imageUrl} />
                        </Grid>
                        <Grid className={classes.commentInputGrid} item xs={11}>
                            <TextField color="secondary" className={classes.commentInput} multiline placeholder="Write a comment..." name="commentInput" value={this.state.commentInput} type="text" onChange={this.handleCommentInput}></TextField>
                        </Grid>
                        <Grid container justify="flex-end" item={2}>
                            <Button className={classes.commentCancelButton} onClick={this.handleCancelComment}>Cancel</Button>
                            <Button className={classes.commentCommentButton} disabled={this.state.commentInput.trim() === ''} color="secondary" variant="contained">Comment</Button>
                        </Grid>
                    </Grid>}
                </Grid>
            </Grid>
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
}

const mapStateToProps = (state) => ({
    data: state.data,
    user: state.user,
});

const mapActionsToProps = {
    getUserData,
    getTierList,
    getTierItemsForOneCategory,
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(tierList));
