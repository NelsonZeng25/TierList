import React, { Component, Fragment } from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    tierItem: {
        backgroundColor: theme.palette.primary.dark,
        width: '100%',
        minHeight: '295px',
        borderRadius: '10px',
        paddingBottom: '6px',
        border: '2px solid transparent',
    },
    tierItemImage: {
        backgroundColor: theme.palette.primary.main,
        width: '100%',
        position: 'relative',
        marginTop: '0px',
        height: '250px',
        borderTopRightRadius: '7px',
        borderTopLeftRadius: '7px',
    },
    tierItemName: {
        backgroundColor: theme.palette.primary.main,
        textAlign: 'center',
        margin: '15px 6px 2px 6px',
        overflow: 'auto',
    },
    "@media only screen and (max-width: 800px)": {
        tierItemGrid: {
            maxWidth: '33.33%',
            flexBasis: '33.33%',
        },
    },
    "@media only screen and (max-width: 600px)": {
        tierItemGrid: {
            maxWidth: '50%',
            flexBasis: '50%',
        },
    },
});

export class tierItemDialog extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Grid className={classes.tierItemGrid} item xs={3}>
                <Skeleton variant="rect" className={classes.tierItem}>
                    <Skeleton variant="rect" className={classes.tierItemImage}/>
                    <Skeleton variant="text" className={classes.tierItemName} />
                </Skeleton>
                {/* <Paper onClick={this.handleSelected.bind(this, index, tierItem.name, tierItem.imageUrl, tierItem.tierItemId)} className={this.state.selectedIndex === index ? classes.clickTierItem : classes.tierItem}>
                    {(authenticated && userId === tierItem.userId) || isManager ?
                        (
                            <Fragment>
                                <DeleteButton handleTierItemDelete={this.handleTierItemDelete.bind(this, tierItem)} tierItem={tierItem} />
                                <MyButton tip="Update Tier Item" placement="top" onClick={this.handleUpdateTierItemClick} btnClassName={classes.updateButton}>
                                    <EditIcon color="secondary" />
                                </MyButton>
                            </Fragment>
                        ) : null}
                    <img src={tierItem.imageUrl} className={classes.tierItemImage} alt="Tier Item Picture" style={!(authenticated && userId === tierItem.userId) && !isManager ? { marginTop: '0px' } : {}} />
                    <Typography className={classes.tierItemName}>{tierItem.name}</Typography>
                </Paper> */}
            </Grid>
        )
    }
}



export default withStyles(styles)(tierItemDialog);
