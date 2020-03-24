import React, { Component } from 'react';
import MyButton from '../../util/MyButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

// Redux
import { connect } from  'react-redux';
import { likeTierList, unlikeTierList } from '../../redux/actions/dataActions';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
    likeButton: {
        padding: '5px 5px 5px 0',
    }
})

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
        const { classes } = this.props;
        const { authenticated } = this.props.user;
        const likeButton = !authenticated ? (
            <Link to="/login">
                <MyButton btnClassName={classes.likeButton} tip="Like">
                        <FavoriteBorder style={{color:'red'}}></FavoriteBorder>
                </MyButton>
            </Link>
        ) : (
            this.likedTierList() ? (
                <MyButton btnClassName={classes.likeButton} tip="Undo Like" onClick={this.unlikeTierList}>
                    <FavoriteIcon style={{color:'red'}}></FavoriteIcon>
                </MyButton>
            ) : (
                <MyButton btnClassName={classes.likeButton} tip="Like" onClick={this.likeTierList}>
                    <FavoriteBorder style={{color:'red'}}></FavoriteBorder>
                </MyButton>
            )
        );
        return likeButton;
    }
}

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    tierListId: PropTypes.string.isRequired,
    likeTierList: PropTypes.func.isRequired,
    unlikeTierList: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = {
    likeTierList,
    unlikeTierList,
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(LikeButton));
