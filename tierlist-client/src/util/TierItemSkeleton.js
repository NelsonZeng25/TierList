import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Skeleton from '@material-ui/lab/Skeleton';

// MUI
import Grid from '@material-ui/core/Grid';

// Icons
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import StarIcon from '@material-ui/icons/Star';

const styles = theme => ({
    tierItem: {
        backgroundColor: theme.palette.primary.dark,
        width: '100%',
        height: '280px',
        borderRadius: '10px',
        display: 'flex',
        border: '2px solid transparent',
        "& .MuiCardContent-root:last-child": {
            paddingBottom: '12px',
        }
    },
    tierItemImage: {
        backgroundColor: theme.palette.primary.main,
        margin: '0',
        display: 'block',
        width: '69%',
        maxWidth: '223px',
        minWidth: '180px',
        minHeight: '280px',
        position: 'relative',
        borderBottomLeftRadius: '7px',
        borderTopLeftRadius: '7px',
    },
    tierItemName: {
        backgroundColor: theme.palette.primary.main,
        margin: '2px 10px 10px 20px',
        maxWidth: '220px',
        height: '40px',
    },
    ProCon: {
        backgroundColor: theme.palette.primary.main,
        margin: '2px 10px 10px 20px',
        width: '50px',
        height: '30px',
    },
    ProConContent: {
        backgroundColor: theme.palette.primary.main,
        width: '140px',
        height: '30px',
        marginTop: '-3px',
    },
    textGrid: {
        height: '40px',
    },
    proconGrid: {
        height: '30px',
    },
    content: {
        width: '300px',
    },
    wrapper: {
        marginLeft: '35px',
        "& span, svg": {
            verticalAlign: 'middle',
        }
    },
    add: {
        color: 'lawngreen',
    },
    remove: {
        color: 'red',
    },
    scoreWrapper: {
        float: 'right',
        marginLeft: '10px',
        "& span, svg": {
            verticalAlign: 'middle',
        }
    }
});

class TierItem extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <Skeleton variant="rect" className={classes.tierItem}>
                    <Skeleton variant="rect" className={classes.tierItemImage}/>
                    <Grid container>
                        <Grid className={classes.textGrid} item xs={10}>
                            <Skeleton variant="text" className={classes.tierItemName}/>
                        </Grid>
                        <Grid item xs={2}>
                            <StarIcon style={{color: '#ffb400', margin: '15px 15px 0 0', float: 'right'}}/>
                        </Grid>
                        <Grid className={classes.proconGrid} item xs={12}>
                            <Skeleton variant="text" className={classes.ProCon}/>
                        </Grid>
                        {Array.from({ length: 3 }).map((item, index) => (
                            <div key={index} className={classes.wrapper}>
                                <Grid container spacing={0}>
                                    <Grid item xs={2}>
                                        <AddIcon className={classes.add} />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Skeleton variant="text" className={classes.ProConContent}/>
                                    </Grid>
                                </Grid>
                            </div>
                        ))}
                        <Grid className={classes.proconGrid} item xs={12}>
                            <Skeleton variant="text" className={classes.ProCon}/>
                        </Grid>
                        {Array.from({ length: 3 }).map((item, index) => (
                            <div key={index} className={classes.wrapper}>
                                <Grid container spacing={0}>
                                    <Grid item xs={2}>
                                        <RemoveIcon className={classes.remove}/>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Skeleton variant="text" className={classes.ProConContent}/>
                                    </Grid>
                                </Grid>
                            </div>
                        ))}
                    </Grid>
                </Skeleton>
            </Fragment>
        )
    }
}

export default (withStyles(styles)(TierItem));