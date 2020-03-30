import React, { Component, Fragment } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import TierList from '../components/tierList/TierList';
import Profile from '../components/profile/Profile';
import TierListSkeleton from '../util/TierListSkeleton';
import withStyles from '@material-ui/core/styles/withStyles';
import ProfileSkeleton from '../util/ProfileSkeleton';
import StaticProfile from '../components/profile/StaticProfile';
import TierListDialog from '../components/tierList/TierListDialog';
import TierItem from  '../components/tierItem/TierItem';
import TierItemUpdateDialog from '../components/tierItem/TierItemUpdateDialog';

// MUI Stuff
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';

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
        "@media (max-width:900px)": {
            maxWidth: '100%',
            flexBasis: '100%',
        }
    },
    STierName: {
        marginTop: '10px',
        textAlign: 'center',
        color: theme.palette.text.primaryStrong
    },
    ATierName: {
        marginTop: '10px',
        textAlign: 'center',
        color: theme.palette.text.primaryStrong
    },
    BTierName: {
        marginTop: '10px',
        textAlign: 'center',
        color: theme.palette.text.primaryStrong
    },
    CTierName: {
        marginTop: '10px',
        textAlign: 'center',
        color: theme.palette.text.primaryStrong
    },
    DTierName: {
        marginTop: '10px',
        textAlign: 'center',
        color: theme.palette.text.primaryStrong
    },
    ETierName: {
        marginTop: '10px',
        textAlign: 'center',
        color: theme.palette.text.primaryStrong
    },
    FTierName: {
        marginTop: '10px',
        textAlign: 'center',
        color: theme.palette.text.primaryStrong
    },
});

export class tierList extends Component {
    state = {
        profile: null,
        open: false,
    }
    componentDidMount() {
        // let category = '';
        // let tierItems = {};
        
        // Get the Tier List
        const tierListId = this.props.match.params.tierListId;
        this.props.getTierList(tierListId);
        // axios.get(`/tierLists/${tierListId}`)
        //     .then(res => {
        //         category = res.data.category;
        //         tierItems = res.data.tierItems;
        //     })
        //     .then(() => {
        //         // Set up the view
        //         let temp = this.state.viewTierList;
        //         Object.values(tierItems).forEach(tierItem => {
        //             temp[tierItem.tier].push(tierItem);
        //         });
        //         this.setState({ viewTierList: temp });
        //     })
        //     .catch(err => console.log(err))

        // Get the user associated to Tier List
        const userId = this.props.match.params.userId;
        axios.get(`/users/${userId}`)
            .then(res => {
                this.setState({ profile: res.data.user })
            })
            .catch(err => console.log(err))
        
    }
    render() {
        const { classes, user: { credentials: { userId } }, data: { viewTierList } } = this.props;
        const { loading } = this.props.data;

        const tierItemsMarkup = (tier) => (
            viewTierList[tier].map(tierItem => (
                <Grid className={classes.gridTierList} key={tierItem.tierItemId} item xs={6}>
                    <TierItem key={tierItem.tierItemId} tierItem={tierItem} />
                </Grid>
        )));
        const tierMarkup = (tier) => (
            <Grid item xs={12}>
                <Typography variant="h2" key={tier} className={classes[`${tier}TierName`]}>{tier} TIER</Typography>
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
                <Grid className={classes.gridProfile} container item xs={3} spacing={0}>
                    <Grid item xs={12}>
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
