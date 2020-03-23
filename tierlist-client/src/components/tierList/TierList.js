import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import DeleteTierList from './DeleteTierList';
import TierListDialog from './TierListDialog';
import LikeButton from './LikeButton';

// MUI
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Typography } from '@material-ui/core';

// Icons
import ChatIcon from '@material-ui/icons/Chat';

// Redux
import { connect } from 'react-redux';

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
    render() {
        const { classes, 
                tierList: { name, userId, userImage, userName, tierListId, likeCount, commentCount },
                user : { authenticated },
        } = this.props;
        const id = this.props.user.credentials.userId;
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
                    <LikeButton tierListId={tierListId}></LikeButton>
                    <span>{likeCount} Likes</span>
                    <MyButton tip="comments">
                        <ChatIcon color="secondary"></ChatIcon>
                    </MyButton>
                    <span>{commentCount} Comments</span>
                    <TierListDialog tierListId={tierListId} userId={userId} openDialog={this.props.openDialog}></TierListDialog>
                </CardContent>
            </Card>
        )
    }
}

TierList.propTypes = {
    user: PropTypes.object.isRequired,
    tierList: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool,
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps)(withStyles(styles)(TierList));