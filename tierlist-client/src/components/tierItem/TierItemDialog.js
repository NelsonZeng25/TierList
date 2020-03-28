import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from '../../util/MyButton';
import DeleteButton from '../../util/DeleteButton';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

// Icons
import EditIcon from '@material-ui/icons/Edit';

// Redux stuff
import { connect } from 'react-redux';
import { deleteTierItem } from '../../redux/actions/dataActions';

const styles = theme => ({
    clickTierItem: {
        backgroundColor: theme.palette.primary.dark,
        width: '100%',
        minHeight: '295px',
        borderRadius: '10px',
        paddingBottom: '6px',
        border: '2px solid',
        borderColor: theme.palette.text.primaryStrong,
        cursor: 'pointer',
    },
    tierItem: {
        backgroundColor: theme.palette.primary.dark,
        width: '100%',
        minHeight: '295px',
        borderRadius: '10px',
        paddingBottom: '6px',
        border: '2px solid transparent',
        transition: '600ms',
        cursor: 'pointer',
        "&:hover": {
            borderColor: theme.palette.text.primaryStrong,
        },
    },
    tierItemImage: {
        width: '100%',
        position: 'relative',
        marginTop: '-48px',
        height: '250px',
        borderTopRightRadius: '7px',
        borderTopLeftRadius: '7px',
        objectFit: 'cover',
    },
    tierItemName: {
        textAlign: 'center',
        margin: '10px 6px 2px 6px',
        overflow: 'auto',
    },
    updateButton: {
        position: 'relative',
        zIndex: 3,
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

export class TierItemDialog extends Component {
    handleTierItemDelete = (tierItem) => {
        this.props.deleteTierItem(tierItem);
    }
    render() {
        const { authenticated, credentials: { isManager, userId }} = this.props.user;
        const { classes, tierItem, index } = this.props;
        return (
            <Grid className={classes.tierItemGrid} key={index} item xs={3}>
                <Paper onClick={this.props.handleSelected.bind(this, index, tierItem.name, tierItem.imageUrl, tierItem.tierItemId)} className={this.props.selectedIndex === index ? classes.clickTierItem : classes.tierItem}>
                    {(authenticated && userId === tierItem.userId) || isManager ?
                        (
                            <Fragment>
                                <DeleteButton handleTierItemDelete={this.handleTierItemDelete.bind(this, tierItem)} tierItem={tierItem} />
                                <MyButton tip="Update Tier Item" placement="top" onClick={this.props.handleUpdateTierItemClick} btnClassName={classes.updateButton}>
                                    <EditIcon color="secondary" />
                                </MyButton>
                            </Fragment>
                        ) : null}
                    <img src={tierItem.imageUrl} className={classes.tierItemImage} alt="Tier Item Picture" style={!(authenticated && userId === tierItem.userId) && !isManager ? { marginTop: '0px' } : {}} />
                    <Typography className={classes.tierItemName}>{tierItem.name}</Typography>
                </Paper>
            </Grid>
        )
    }
}

TierItemDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    deleteTierItem: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
})

const mapActionsToProps = {
    deleteTierItem,
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(TierItemDialog));