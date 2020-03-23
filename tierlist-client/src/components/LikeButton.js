import React, { Component } from 'react';
import MyButton from '../util/MyButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

// Redux
import { connect } from  'react-redux';
import { likeTierList, unlikeTierList } from '../redux/actions/dataActions';

export class LikeButton extends Component {
    likedTierList = () => {
        if (this.props.user.likes && this.props.user.likes.find(like => like.tierListId === this.props.tierListId))
            return true;
        else
            return false;
    }
    likeTierList = () => {
        this.props.likeTierList(this.props.tierListId);
    }
    unlikeTierList = () => {
        this.props.unlikeTierList(this.props.tierListId);
    }
    render() {
        const { authenticated } = this.props.user;
        const likeButton = !authenticated ? (
            <Link to="/login">
                <MyButton tip="Like">
                        <FavoriteBorder color="secondary"></FavoriteBorder>
                </MyButton>
            </Link>
        ) : (
            this.likedTierList() ? (
                <MyButton tip="Undo Like" onClick={this.unlikeTierList}>
                    <FavoriteIcon color="secondary"></FavoriteIcon>
                </MyButton>
            ) : (
                <MyButton tip="Like" onClick={this.likeTierList}>
                    <FavoriteBorder color="secondary"></FavoriteBorder>
                </MyButton>
            )
        );
        return likeButton;
    }
}

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    tierListId: PropTypes.string.isRequired,
    likedTierList: PropTypes.func.isRequired,
    unlikedTierList: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = {
    likeTierList,
    unlikeTierList,
}

export default connect(mapStateToProps, mapActionsToProps)(LikeButton)
