import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';

// MUI
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// Icons
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import StarIcon from '@material-ui/icons/Star';

// Redux
import { connect } from 'react-redux';

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
        width: '225px',
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
        const detailGrid = (content, isPros) => (
            <div className={classes.wrapper}>
                <Grid container spacing={0}>
                    <Grid item xs={2}>
                        {isPros ? (<AddIcon className={classes.add} />) : (<RemoveIcon className={classes.remove}/>)}
                    </Grid>
                    <Grid item xs={10}>
                        <span>{content}</span>
                    </Grid>
                </Grid>
            </div>
        );
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
                {/* <Card  className={classes.tierItem}>
                    <CardMedia 
                    image={imageUrl}
                    title={"Tier Item Image"}
                    className={classes.tierItemImage}
                    onClick={this.handleOpen}
                    ></CardMedia>
                    {authenticated && userId === id && <DeleteButton tierItemInTierList={this.props.tierItem} currentTierList={this.props.data.tierList} handleDeleteAlertOpen={this.props.handleDeleteAlertOpen}/>}
                    <CardContent onClick={this.handleOpen} className={classes.content}>
                        <div className={classes.scoreWrapper}>
                            <span style={{fontSize: '25px'}}>{score}   </span>
                            <StarIcon style={{color: '#ffb400'}}/>
                        </div>
                        <Typography className={classes.tierItemName} nowrap="true" variant="h5">{name}</Typography>
                        {pros.length > 0 && <Typography variant="body1" >Pros:</Typography>}
                            {Array.from({ length: pros.length }).map((item, index) => (
                                <Fragment key={index}>
                                    {detailGrid( pros[index], true)}
                                </Fragment>
                            ))}
                        {cons.length > 0 && <Typography variant="body1" >Cons:</Typography>}
                            {Array.from({ length: cons.length }).map((item, index) => (
                                <Fragment key={index}>
                                    {detailGrid( cons[index], false)}
                                </Fragment>
                            ))}
                    </CardContent>
                </Card> */}
            </Fragment>
        )
    }
}

export default (withStyles(styles)(TierItem));