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
        backgroundColor: theme.palette.primary.main,
        position: 'relative',
        display: 'flex',
        padding: '15px',
    },
    cardContent: {
        padding: '0 16px 24px 16px',
        "&:last-child": {
            paddingBottom: 0
        }
    },
    cover: {
        margin: '0 0 auto 0',
        display: 'block',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
    },
    userName: {
        width: '60px',
        height: '18px',
        backgroundColor: theme.palette.secondary.main,
        marginBottom: '7px',
    },
    user: {
        height: '14px',
        width: '100px',
        backgroundColor: 'rgba(0,0,0, 0.3)',
        marginBottom: '10px',
    },
    fullLine: {
        height: '15px',
        width: '200px',
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
    const content = (
        <Card className={classes.card}>
            <CardMedia className={classes.cover} image={NoImg}></CardMedia>
            <CardContent className={classes.cardContent}>
                <div className={classes.userName}></div>
                <div className={classes.user}></div>
                <div className={classes.user}></div>
                <div className={classes.fullLine}></div>
            </CardContent>
        </Card>
    );
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