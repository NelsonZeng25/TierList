import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import TierList from '../components/tierList/TierList';
import StaticProfile from '../components/profile/StaticProfile';
import TierListSkeleton from '../util/TierListSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';
import Profile from '../components/profile/Profile';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography'

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
    }
});

export class user extends Component {
    state = {
        tierListIdParam: null,
        profile: null,
    }
    componentDidMount(){
        const userId = this.props.match.params.userId;
        this.props.getUserData(userId);
        axios.get(`/users/${userId}`)
            .then(res => {
                this.setState({
                    profile: res.data.user,
                })
            })
            .catch(err => console.log(err))
    }
    render() {
        const { classes, user: {credentials: { userId }}} = this.props;
        const { tierListIdParam } = this.state;
        const { categoriesWithTierLists, viewCategory, loading } = this.props.data;
        const tierListsMarkup = (category) => (
            viewCategory[category].map(tierList => (
                <Grid className={classes.gridTierList} key={tierList.tierListId} item xs={6}>
                    <TierList key={tierList.tierListId} tierList={tierList} />
                </Grid>
        )));
        const categoryMarkup = (category) => (
            <Grid item xs={12}>
                <Typography variant="h5" key={category} className={classes.categoryName}>{category}</Typography>
            </Grid>
        );
        const categoryWithTierListsMarkup = loading ? (
            <Fragment>
                <Typography variant="h5" className={classes.categoryName}>Category</Typography>
                <hr className={classes.visibleSeperator}/>
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
                <Fragment>
                    {viewCategory.hasOwnProperty(category) && viewCategory[category].length > 0 && categoryMarkup(category)}
                    {viewCategory.hasOwnProperty(category) && viewCategory[category].length > 0 && <hr className={classes.visibleSeperator}/>}
                    {tierListsMarkup(category)}
                </Fragment>
            ))
        ));
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
                    </Grid>
                </Grid>
                <Grid className={classes.gridTierLists} container item xs={9} spacing={3} justify="center">
                    {categoryWithTierListsMarkup}
                </Grid>

                {/* <Grid item sm ={8} xs={12}>
                    {tierListsMarkup}
                </Grid> */}
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
