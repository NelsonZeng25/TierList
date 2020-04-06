import React, { Component } from 'react';
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
            </Grid>
        )
    }
}



export default withStyles(styles)(tierItemDialog);
