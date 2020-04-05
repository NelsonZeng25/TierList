import React, { Fragment } from 'react';
import NoImg from '../images/no-img.png';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

const styles = theme => ({
    card: {
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        padding: '15px',
        height: '110px',
    },
    cover: {
        margin: '0 0 auto 0',
        display: 'block',
        minWidth: '60px',
        height: '60px',
        borderRadius: '50%',
    },
    userName: {
        width: '90px',
        height: '33px',
        backgroundColor: theme.palette.secondary.main,
        marginBottom: '7px',
        marginLeft: '20px',
    },
    user: {
        height: '20px',
        width: '100px',
        backgroundColor: theme.palette.text.primary,
        marginBottom: '10px',
        marginLeft: '20px',
    },
    fullLine: {
        height: '15px',
        width: '200px',
        backgroundColor: '#0B0C17',
        marginLeft: '20px',
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
    return (
        <Fragment>
            <Skeleton variant="rect" className={classes.card}>
                <img src={NoImg} alt="profile" className={classes.cover}/>
                <Grid container spacing={0}>
                    <Grid style={{height: '30px'}} item xs={12}>
                        <Skeleton variant="text" className={classes.userName} />
                    </Grid>
                    <Grid style={{height: '20px'}} item xs={12}>
                        <Skeleton variant="text" className={classes.user} />
                    </Grid>
                    <Grid style={{height: '20px'}} item xs={12}>
                        <Skeleton variant="text" className={classes.user} />
                    </Grid>
                    <Grid style={{height: '20px'}} item xs={12}>
                        <Skeleton variant="text" className={classes.fullLine} />
                    </Grid>
                </Grid>
            </Skeleton>
        </Fragment>
    )
}

TierListSkeleton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TierListSkeleton);