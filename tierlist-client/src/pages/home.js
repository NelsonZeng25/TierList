import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import TierList from '../components/tierList/TierList';
import Profile from '../components/profile/Profile';
import TierListSkeleton from '../util/TierListSkeleton';
import withStyles from '@material-ui/core/styles/withStyles';

import { connect } from 'react-redux';
import { getTierLists } from '../redux/actions/dataActions';

import useMediaQuery from '@material-ui/core/useMediaQuery';

const styles = theme => ({
    ...theme.spreadThis,
    gridProfile: {
        "@media (max-width:1165px)": {
            maxWidth: '100%',
            flexBasis: '100%',
        }
    },
    gridTierLists: {
        "@media (max-width:1165px)": {
            maxWidth: '100%',
            flexBasis: '100%',
        },
    },
    gridTierList: {
        "@media (max-width:900px)": {
            maxWidth: '100%',
            flexBasis: '100%',
        }
    }
});

export class home extends Component {
    state = {
        profileSize: 3,
        tierListSize: 9,
    }
    componentDidMount(){
        this.props.getTierLists();
    }
    render() {
        const { classes } = this.props;
        const { tierLists, loading } = this.props.data;
        let recentTierListMarkup = !loading ? (
          tierLists.map(tierList => (
            <Grid className={classes.gridTierList} key={tierList.tierListId} item xs={6}>
                <TierList key={tierList.tierListId} tierList={tierList} />
            </Grid>
          ))
        ) : (
          <TierListSkeleton />
        );
        return (
            <Grid className="grid-container" container spacing={3}>
                <Grid className={classes.gridProfile} container item xs={3} spacing={0}>
                    <Grid item xs={12}>
                        <Profile />
                    </Grid>
                </Grid>
                <Grid className={classes.gridTierLists} container item xs={9} spacing={3} justify="center">
                    {recentTierListMarkup}
                </Grid>
            </Grid>
        );
    }
}

home.propTypes = {
    getTierLists: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    data: state.data
})

export default connect(mapStateToProps, { getTierLists })(withStyles(styles)(home));
