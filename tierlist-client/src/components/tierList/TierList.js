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
import Grid from '@material-ui/core/Grid';

// Icons
import ChatIcon from '@material-ui/icons/Chat';

// Redux
import { connect } from 'react-redux';

const styles = theme => ({
    ...theme.spreadThis,
    
    image: {
        margin: '0 0 auto 0',
        display: 'block',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
    },
    content: {
        padding: '0 16px 24px 16px',
        "&:last-child": {
            paddingBottom: 0
        }
    },
    commentButton: {
        padding: '5px 5px 5px 10px',
        marginLeft: '15px',
    },
});

class TierList extends Component {
    render() {
        const { classes, 
                tierList: { name, userId, userImage, userName, category, tierListId, likeCount, commentCount },
                user : { authenticated, credentials: { isManager } },
        } = this.props;
        const id = this.props.user.credentials.userId;
        const deleteButton = (authenticated && userId === id) || isManager ? (
            <DeleteTierList tierList={this.props.tierList}/>
        ) : null
        return (
            <Card id="card">
                <CardMedia 
                image={userImage}
                title={"Profile Image"}
                className={classes.image}/>
                <CardContent className={classes.content}>
                    <div style={{overflow: "hidden", textOverflow: "ellipsis", width: '13rem'}}> 
                        <Typography nowrap="true" variant="h5" component={Link} to={`/users/${userId}/tierLists/${tierListId}`} color="secondary">{name}</Typography>
                    </div>
                    {deleteButton}
                    <Typography variant="body2" >Created by <Link className={classes.login_signup_link} to={`/users/${userId}`}>{userName}</Link></Typography>
                    <Typography variant="body2" >Category: {category}</Typography>
                    <Grid className={classes.tierListCount} container>
                        <Grid item>
                            <LikeButton tierListId={tierListId}></LikeButton>
                            <span>{likeCount} Likes</span>
                        </Grid>
                        <Grid item>
                            <MyButton btnClassName={classes.commentButton} tip="comments">
                                <ChatIcon color="secondary"></ChatIcon>
                            </MyButton>
                            <span>{commentCount} Comments</span>
                        </Grid>
                    </Grid>
                    
                    {/* <TierListDialog tierListId={tierListId} userId={userId} openDialog={this.props.openDialog}></TierListDialog> */}
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