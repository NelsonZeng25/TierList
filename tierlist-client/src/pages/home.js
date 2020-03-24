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

const styles = theme => ({
    ...theme.spreadThis,
});

export class home extends Component {
    componentDidMount(){
        this.props.getTierLists();
    }
    render() {
        const { classes } = this.props;
        const { tierLists, loading } = this.props.data;
        let recentTierListMarkup = !loading ? (
          tierLists.map(tierList => (
            <Grid key={tierList.tierListId} item xs={4}>
                <TierList key={tierList.tierListId} tierList={tierList} />
            </Grid>
          ))
        ) : (
          <TierListSkeleton />
        );
        return (
            <Grid container spacing={3}>
                <Grid container item xs={3} spacing={0}>
                    <Grid item xs={12}>
                        <Profile />
                    </Grid>
                </Grid>
                <Grid container item xs={9} spacing={3} direction="row" justify="center" alignItems="baseline">
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
