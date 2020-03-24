import React, { Fragment } from 'react';
import NoImg from '../images/no-img.png';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

// MUI stuff
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

const styles = theme => ({
    card: {
        display: 'flex',
        marginBottom: '20px',
    },
    cardContent: {
        width: '100%',
        flexDirection: 'column',
        padding: '25px',
    },
    cover: {
        minWidth: '200px',
        objectFit: 'cover',
    },
    userName: {
        width: '60px',
        height: '18px',
        backgroundColor: theme.palette.secondary.main,
        marginBottom: '7px',
    },
    date: {
        height: '14px',
        width: '100px',
        backgroundColor: 'rgba(0,0,0, 0.3)',
        marginBottom: '10px',
    },
    fullLine: {
        height: '15px',
        width: '90%',
        backgroundColor: 'rgba(0,0,0, 0.6)',
        marginBottom: '10px'
    },
    halfLine: {
        height: '15px',
        width: '50%',
        backgroundColor: 'rgba(0,0,0, 0.6)',
        marginBottom: '10px'
    }
})

const TierListSkeleton = (props) => {
    const { classes } = props;
    const content = Array.from({ length: 5 }).map((item, index) => (
        <Card className={classes.card} key={index}>
            <CardMedia className={classes.cover} image={NoImg}></CardMedia>
            <CardContent className={classes.cardContent}>
                <div className={classes.userName}></div>
                <div className={classes.date}></div>
                <div className={classes.fullLine}></div>
                <div className={classes.fullLine}></div>
                <div className={classes.halfLine}></div>
            </CardContent>
        </Card>
    ))
    return (
        <Fragment>
            {content}
        </Fragment>
    )
}

TierListSkeleton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TierListSkeleton);