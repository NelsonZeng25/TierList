import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import TierList from '../components/tierList/TierList';
import StaticProfile from '../components/profile/StaticProfile';
import TierListSkeleton from '../util/TierListSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';
import Profile from '../components/profile/Profile';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

// Icons
import ListAltIcon from '@material-ui/icons/ListAlt';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SettingsIcon from '@material-ui/icons/Settings';

// Redux stuff
import { connect } from 'react-redux';
import { getUserData, refreshCategories } from '../redux/actions/dataActions';

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
        "@media (max-width:900px)": {
            maxWidth: '100%',
            flexBasis: '100%',
        }
    },
    categoryName: {
        marginTop: '10px',
        textAlign: 'center',
        color: theme.palette.text.primaryStrong
    },
    appBar: {
        margin: 'auto',
        width: '95%',
        zIndex: 1,
    },
    tab1: {
        width: '50%'
    },
    tab2: {
        width: '33.33%'
    }
});

export class user extends Component {
    state = {
        tierListIdParam: null,
        profile: null,
        selectedTab: 0,
    }
    componentDidMount(){
        const userId = this.props.match.params.userId;
        this.props.getUserData(userId);
        // axios.get(`/users/${userId}`)
        //     .then(res => {
        //         this.setState({
        //             profile: res.data.user,
        //         })
        //     })
        //     .catch(err => console.log(err))
    }
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            const userId = this.props.match.params.userId;
            this.props.getUserData(userId);
            this.setState({ selectedTab: 0 });
        }
    }
    handleTierItemsClick = () => {
        this.setState({ selectedTab: 0 });
    }
    handleLikesClick = () => {
        this.setState({ selectedTab: 1 });
    }
    handleSettingsClick = () => {
        this.setState({ selectedTab: 2 });
    }
    render() {
        const { classes, user: { credentials: { userId }}} = this.props;
        const { categoriesWithTierLists, viewCategory, loading, likes } = this.props.data;
        const Id = this.props.match.params.userId;
        const tierListsMarkup = (category) => (
            viewCategory[category].map(tierList => (
                <Grid className={classes.gridTierList} key={tierList.tierListId} item xs={6}>
                    <TierList key={tierList.tierListId} tierList={tierList} />
                </Grid>
        )));
        const categoryMarkup = (category) => (
            <Grid item xs={12}>
                <Typography variant="h5" key={category} className={classes.categoryName}>{category}</Typography>
                <hr className={classes.visibleSeperator}/>
            </Grid>
        );
        const categoryWithTierListsMarkup = loading ? (
            <Fragment>
                <Grid item xs={12}>
                    <Typography variant="h5" className={classes.categoryName}>Category</Typography>
                    <hr className={classes.visibleSeperator}/>
                </Grid>
                {Array.from({ length: 10 }).map((item, index) => (
                    <Grid className={classes.gridTierList} key={index} item xs={6}>
                        <TierListSkeleton />
                    </Grid>
                ))}
            </Fragment>
        ) : ( categoriesWithTierLists === null ? (
            <p>No Tier Lists from this user</p>
        ) : (
            Object.keys(viewCategory).map(category => (
                <Fragment key={category}>
                    {viewCategory.hasOwnProperty(category) && viewCategory[category].length > 0 && categoryMarkup(category)}
                    {tierListsMarkup(category)}
                </Fragment>
            ))
        ));

        const likedTierListMarkup = (
            <Fragment>
                <Grid item xs={12}>
                    <Typography variant="h5" className={classes.categoryName}>Liked Tier Lists</Typography>
                    <hr className={classes.visibleSeperator}/>
                </Grid>
                {likes.map(like => (
                    <Grid className={classes.gridTierList} key={like.tierListId} item xs={6}>
                        <TierList tierList={{
                            name: like.tierListName, tierListId: like.tierListId,
                            userId: like.recipientId, userImage: like.recipientImage, userName: like.recipientName, 
                            category: like.category,
                        }}/>
                    </Grid>
                ))}
            </Fragment>
        );
        return (
            <Grid className="grid-container" container spacing={3}>
                <AppBar className={classes.appBar} position="static">
                    <Tabs value={this.state.selectedTab} indicatorColor="secondary">
                        <Tab className={userId === Id ? classes.tab2 : classes.tab1} label="Tier Lists" icon={<ListAltIcon/>} onClick={this.handleTierItemsClick} value={0}/>
                        <Tab className={userId === Id ? classes.tab2 : classes.tab1} label="Likes" icon={<FavoriteIcon/>} onClick={this.handleLikesClick} value={1}/>
                        {userId === Id && <Tab className={classes.tab2} label="Settings" icon={<SettingsIcon/>} onClick={this.handleSettingsClick} value={2}/>}
                    </Tabs>
                </AppBar>
                <Grid className={classes.gridProfile} container direction="column" item xs={3} spacing={0}>
                    <Typography variant="h3" className={classes.pageName}>Profile</Typography>
                    {/* <Typography variant="h4" className={classes.pageName} style={{textDecoration: 'unset'}}>{this.props.user.credentials.userName}</Typography> */}
                    <Grid item>
                        {loading ? (
                            <ProfileSkeleton/>
                        ): ( this.props.match.params.userId === userId ? (
                            <Profile/>
                        ) : (
                            <StaticProfile userId={this.props.match.params.userId} />
                        ))}
                    </Grid>
                </Grid>
                {this.state.selectedTab === 0 && 
                    <Grid className={classes.gridTierLists} container item xs={9} spacing={3} justify="center">
                        {categoryWithTierListsMarkup}
                    </Grid>}
                {this.state.selectedTab === 1 && 
                    <Grid className={classes.gridTierLists} container item xs={9} spacing={3} justify="center">
                        {likedTierListMarkup}
                    </Grid>}
                {this.state.selectedTab === 2 && 
                    <Grid className={classes.gridTierLists} container item xs={9} spacing={3} justify="center">
                    </Grid>}
            </Grid>
        )
    }
}

user.propTypes = {
    user: PropTypes.object.isRequired,
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
    data: state.data
})

const mapActionsToProps = {
    getUserData,
    refreshCategories
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(user));;
