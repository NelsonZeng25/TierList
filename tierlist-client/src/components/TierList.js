import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';

// MUI
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Typography } from '@material-ui/core';

const styles = {
    card: {
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

export class TierList extends Component {
    render() {
        const { classes, tierList: { name, userId, userImage, userName, tierListId, likeCount, commentCount }} = this.props;
        return (
            <Card className={classes.card}>
                <CardMedia 
                image={userImage}
                title={"Profile Image"}
                className={classes.image}/>
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${userId}`} color="primary">{userName}</Typography>
                    <Typography variant="body2" color="textSecondary">{tierListId}</Typography>
                    <Typography variant="body1">{name}</Typography>
                </CardContent>
            </Card>
        )
    }
}

export default withStyles(styles)(TierList);