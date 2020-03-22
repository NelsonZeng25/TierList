import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';

import Comment from '../components/Comment';
export class comment extends Component {
    state = {
        comments: null,
    }
    componentDidMount(){
        axios.get('/comments')
            .then(res =>{
                this.setState({
                    comments: res.data,
                })
            })
            .catch(err => console.log(err));
    }
    render() {
        let recentCommentMarkup = this.state.comments ? (
        this.state.comments.map(comment => <Comment key={comment.commentId} comment={comment}/>)
        ) : <p>Loading...</p>
        return (
            <Grid container spacing={2}>
                <Grid item sm ={8} xs={12}>
                    {recentCommentMarkup}
                </Grid>
                <Grid item sm ={4} xs={12}>
                    <p>Profile...</p>
                </Grid>
            </Grid>
        )
    }
}

export default comment;
