import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import MyButton from '../util/MyButton';
import DeleteTierList from './DeleteTierList';
import TierListDialog from './TierListDialog';

// MUI
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Typography } from '@material-ui/core';

// Icons
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

// Redux
import { connect } from 'react-redux';
import { likeTierList, unlikeTierList, deleteTierList } from '../redux/actions/dataActions';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20,
    },
    image: {
        minWidth: 200,
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
}

class TierList extends Component {
    likedTierList = () => {
        if (this.props.user.likes && this.props.user.likes.find(like => like.tierListId === this.props.tierList.tierListId))
            return true;
        else
            return false;
    }
    likeTierList = () => {
        this.props.likeTierList(this.props.tierList.tierListId);
    }
    unlikeTierList = () => {
        this.props.unlikeTierList(this.props.tierList.tierListId);
    }
    render() {
        const { classes, 
                tierList: { name, userId, userImage, userName, tierListId, likeCount, commentCount },
                user : { authenticated },
        } = this.props;
        const id = this.props.user.credentials.userId;
        const likeButton = !authenticated ? (
            <MyButton tip="Like">
                <Link to="/login">
                    <FavoriteBorder color="secondary"></FavoriteBorder>
                </Link>
            </MyButton>
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
        const deleteButton = authenticated && userId === id ? (
            <DeleteTierList tierListId={tierListId}/>
        ) : null
        return (
            <Card className={classes.card}>
                <CardMedia 
                image={userImage}
                title={"Profile Image"}
                className={classes.image}/>
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${userId}`} color="primary">{userName}</Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">{tierListId}</Typography>
                    <Typography variant="body1">{name}</Typography>
                    {likeButton}
                    <span>{likeCount} Likes</span>
                    <MyButton tip="comments">
                        <ChatIcon color="secondary"></ChatIcon>
                    </MyButton>
                    <span>{commentCount} Comments</span>
                    <TierListDialog tierListId={tierListId} userId={userId}></TierListDialog>
                </CardContent>
            </Card>
        )
    }
}

TierList.propTypes = {
    likeTierList: PropTypes.func.isRequired,
    unlikeTierList: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    tierList: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    likeTierList,
    unlikeTierList
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(TierList));