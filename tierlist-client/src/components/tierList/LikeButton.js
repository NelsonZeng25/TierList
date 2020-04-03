import React, { Component } from 'react';
import MyButton from '../../util/MyButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

// Redux
import { connect } from  'react-redux';
import { likeTierList, unlikeTierList, likeComment, unlikeComment, likeReply, unlikeReply } from '../../redux/actions/dataActions';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
    likeButton: {
        padding: '5px 5px 5px 0',
    }
})

export class LikeButton extends Component {
    state = {
        class: '',
    }
    componentDidMount() {
        if (this.props.tierListId) this.setState({ class: 'tierList' });
        else if (this.props.replyId) this.setState({ class: 'reply' });
        else if (this.props.commentId) this.setState({ class: 'comment' });
    }
    likedItem = () => {
        switch(this.state.class) {
            case 'tierList':
                return this.props.user.likes && this.props.user.likes.find(like => like.tierListId === this.props.tierListId);
            case 'comment':
                return this.props.user.likes && this.props.user.likes.find(like => like.commentId === this.props.commentId);
            case 'reply':
                return this.props.user.likes && this.props.user.likes.find(like => like.replyId === this.props.replyId);
        }
    }
    likeClick = () => {
        switch(this.state.class) {
            case 'tierList':
                this.props.likeTierList(this.props.tierListId);
                break;
            case 'comment':
                this.props.likeComment(this.props.commentId);
                break;
            case 'reply':
                this.props.likeReply(this.props.replyId);
                break;
        }
    }
    unlikeClick = () => {
        switch(this.state.class) {
            case 'tierList':
                this.props.unlikeTierList(this.props.tierListId);
                break;
            case 'comment':
                this.props.unlikeComment(this.props.commentId);
                break;
            case 'reply':
                this.props.unlikeReply(this.props.replyId);
                break;
        }
    }
    render() {
        const { classes } = this.props;
        const { authenticated } = this.props.user;
        const likeButton = !authenticated ? (
            <Link to="/login">
                <MyButton btnClassName={classes.likeButton} tip="Like" placement={this.props.placement}>
                        <FavoriteBorder style={{color:'red'}}></FavoriteBorder>
                </MyButton>
            </Link>
        ) : (
            this.likedItem() ? (
                <MyButton btnClassName={classes.likeButton} tip="Undo Like" onClick={this.unlikeClick} placement={this.props.placement}>
                    <FavoriteIcon style={{color:'red'}}></FavoriteIcon>
                </MyButton>
            ) : (
                <MyButton btnClassName={classes.likeButton} tip="Like" onClick={this.likeClick} placement={this.props.placement}>
                    <FavoriteBorder style={{color:'red'}}></FavoriteBorder>
                </MyButton>
            )
        );
        return likeButton;
    }
}

LikeButton.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    likeTierList: PropTypes.func.isRequired,
    unlikeTierList: PropTypes.func.isRequired,
    likeComment: PropTypes.func.isRequired,
    unlikeComment: PropTypes.func.isRequired,
    likeReply: PropTypes.func.isRequired,
    unlikeReply: PropTypes.func.isRequired, 
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = {
    likeTierList,
    unlikeTierList,
    likeComment,
    unlikeComment,
    likeReply,
    unlikeReply,
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(LikeButton));
