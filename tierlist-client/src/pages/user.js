import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import TierList from '../components/tierList/TierList';
import Grid from '@material-ui/core/Grid';
import StaticProfile from '../components/profile/StaticProfile';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

export class user extends Component {
    state = {
        tierListIdParam: null,
        profile: null,
    }
    componentDidMount(){
        const userId = this.props.match.params.userId;
        const tierListId = this.props.match.params.tierListId;
        if (tierListId) {
            this.setState({
                tierListIdParam: tierListId
            })
        }
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
        const { tierListIdParam } = this.state;
        const { tierLists, loading } = this.props.data;
        const tierListsMarkup = loading ? (
            <p>Loading data...</p>
        ) : tierLists === null ? (
            <p>No Tier Lists from this user</p>
        ) : !tierListIdParam ? (
            tierLists.map(tierList => <TierList key={tierList.tierListId} tierList={tierList}/>)
        ) : (
            tierLists.map(tierList => {
                if (tierList.tierListId !== tierListIdParam)
                    return <TierList key={tierList.tierListId} tierList={tierList}/>
                else
                    return <TierList key={tierList.tierListId} tierList={tierList} openDialog/>
            })
        );
        return (
            <Grid container spacing={2}>
                <Grid item sm ={8} xs={12}>
                    {tierListsMarkup}
                </Grid>
                <Grid item sm ={4} xs={12}>
                    {this.state.profile === null ? (
                        <p>Loading </p>
                    ) : (
                        <StaticProfile profile={this.state.profile} />
                    )}
                </Grid>
            </Grid>
        )
    }
}

user.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    data: state.data
})

export default connect(mapStateToProps, { getUserData })(user);
