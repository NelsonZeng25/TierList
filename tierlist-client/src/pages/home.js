import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';

import TierList from '../components/TierList';
export class home extends Component {
    state = {
        tierLists: null,
    }
    componentDidMount(){
        axios.get('/tierLists')
            .then(res =>{
                this.setState({
                    tierLists: res.data,
                })
            })
            .catch(err => console.log(err));
    }
    render() {
        let recentTierListMarkup = this.state.tierLists ? (
        this.state.tierLists.map(tierList => <TierList key={tierList.tierListId} tierList={tierList}/>)
        ) : <p>Loading...</p>
        return (
            <Grid container spacing={2}>
                <Grid item sm ={8} xs={12}>
                    {recentTierListMarkup}
                </Grid>
                <Grid item sm ={4} xs={12}>
                    <p>Profile...</p>
                </Grid>
            </Grid>
        )
    }
}

export default home;
