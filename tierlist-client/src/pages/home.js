import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import TierList from '../components/TierList';
import Profile from '../components/Profile';

import { connect } from 'react-redux';
import { getTierLists } from '../redux/actions/dataActions';

export class home extends Component {
    componentDidMount(){
        this.props.getTierLists();
    }
    render() {
        const { tierLists, loading } = this.props.data;
        let recentTierListMarkup = !loading ? (
            tierLists.map(tierList => <TierList key={tierList.tierListId} tierList={tierList}/>)
        ) : (
            <p>Loading...</p>
        )
        return (
            <Grid container spacing={2}>
                <Grid item sm ={8} xs={12}>
                    {recentTierListMarkup}
                </Grid>
                <Grid item sm ={4} xs={12}>
                    <Profile />
                </Grid>
            </Grid>
        )
    }
}

home.propTypes = {
    getTierLists: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    data: state.data
})

export default connect(mapStateToProps, { getTierLists })(home);
