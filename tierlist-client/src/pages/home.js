import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import TierList from '../components/tierList/TierList';
import Profile from '../components/profile/Profile';
import TierListSkeleton from '../util/TierListSkeleton';
import withStyles from '@material-ui/core/styles/withStyles';
import SnackbarAlert from '../util/SnackbarAlert';

import { connect } from 'react-redux';
import { getTierLists, getCategories, getCategoriesWithTierLists } from '../redux/actions/dataActions';
import { Typography } from '@material-ui/core';

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
});

export class home extends Component {
    state = {
        deleteTierListAlertOpen: false,
    }
    componentDidMount(){
        this.props.getCategoriesWithTierLists();
    }
    handleDeleteAlertOpen = () => {
        this.setState({ deleteTierListAlertOpen: true });
    }
    handleDeleteAlertClose = (event, reason) => {
        if (reason === 'clickaway') return;
        this.setState({ deleteTierListAlertOpen: false });
    }
    render() {
        const { classes } = this.props;
        const { viewCategory, loading } = this.props.data;
        
        const tierListsMarkup = (category) => (
            viewCategory[category].map(tierList => (
                <Grid className={classes.gridTierList} key={tierList.tierListId} item xs={6}>
                    <TierList key={tierList.tierListId} tierList={tierList} handleDeleteAlertOpen={this.handleDeleteAlertOpen.bind(this)}/>
                </Grid>
        )));
        const categoryMarkup = (category) => (
            <Grid item xs={12}>
                <Typography variant="h5" key={category} className={classes.categoryName}>{category}</Typography>
                <hr className={classes.visibleSeperator}/>
            </Grid>
        );
        const categoryWithTierListsMarkup = !loading ? (
            Object.keys(viewCategory).map(category => (
                <Fragment key={category}>
                    {viewCategory.hasOwnProperty(category) && viewCategory[category].length > 0 && categoryMarkup(category)}
                    {tierListsMarkup(category)}
                </Fragment>
            ))
        ) : (
            <Fragment>
                <Typography variant="h5" className={classes.categoryName}>Category</Typography>
                <hr className={classes.visibleSeperator}/>
                {Array.from({ length: 10 }).map((item, index) => (
                    <Grid className={classes.gridTierList} key={index} item xs={6}>
                        <TierListSkeleton />
                    </Grid>
                ))}
            </Fragment>
        );
        return (
            <Fragment>
                <Grid className="grid-container" container spacing={3}>
                    <Grid className={classes.gridProfile} container direction="column" item xs={3} spacing={0}>
                        <Typography variant="h3" className={classes.pageName}>HOME</Typography>
                        <Grid item >
                            <Profile />
                        </Grid>
                    </Grid>
                    <Grid className={classes.gridTierLists} container item xs={9} spacing={3} justify="center">
                        {categoryWithTierListsMarkup}
                    </Grid>
                </Grid>
                <SnackbarAlert 
                    tierList={true}
                    delete={true} deleteAlertOpen={this.state.deleteTierListAlertOpen} handleDeleteAlertClose={this.handleDeleteAlertClose}
                />
            </Fragment>
        );
    }
}

home.propTypes = {
    getTierLists: PropTypes.func.isRequired,
    getCategories: PropTypes.func.isRequired,
    getCategoriesWithTierLists: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    data: state.data
});

const mapActionsToProps = {
    getTierLists,
    getCategories,
    getCategoriesWithTierLists
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(home));
