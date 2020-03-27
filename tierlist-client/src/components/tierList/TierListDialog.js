import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from '../../util/MyButton';
import { Link } from 'react-router-dom';
import LikeButton from "./LikeButton";
import Comments from './Comments';
import CommentForm from './CommentForm';

// MUI stuff
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

// Icons
import ChatIcon from '@material-ui/icons/Chat';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import UnfoledMore from '@material-ui/icons/UnfoldMore';

// Redux stuff
import { connect } from 'react-redux';
import { getUserTierItems, refreshTierItems, clearErrors } from '../../redux/actions/dataActions';

const styles = theme => ({
    ...theme.spreadThis,
    profileImage: {
        maxWidth: '200px',
        height: '200px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    dialog: {
        "& .MuiDialog-paper": {
            backgroundColor: theme.palette.primary.main,
            height: 700,
        }
    },
    dialogContent: {
        margin: '10px 0px 20px 15px',
        padding: '20px',
    },
    dialogTitle: {
        color: theme.palette.text.primary,
        fontSize: '20px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    closeButton: {
        float: 'right',
        color: theme.palette.text.primary
    },
    expandButton: {
        position: 'fixed',
        marginLeft: '115px',
        marginTop: '550px',
    },
    selectionContainer: {
        borderRight: '2px solid',
        borderBottom: '2px solid',
        borderLeft: '6px solid',
        borderTop: '6px solid',
        borderColor: theme.palette.text.primary,
        height: '595px',
        maxHeight: '625px',
        overflow: 'auto',
    },
    clickTierItem: {
        backgroundColor: theme.palette.primary.dark,
        width: '100%',
        minHeight: '295px',
        borderRadius: '10px',
        paddingBottom: '6px',
        border: '2px solid',
        borderColor: theme.palette.text.primary,
        cursor: 'pointer',
    },
    tierItem: {
        backgroundColor: theme.palette.primary.dark,
        width: '100%',
        minHeight: '295px',
        borderRadius: '10px',
        paddingBottom: '6px',
        border: '2px solid transparent',
        cursor: 'pointer',
        "&:hover": {
            borderColor: theme.palette.text.primary,
        },
    },
    tierItemImage: {
        width: '100%',
        left: '-2px',
        height: '250px',
        borderTopRightRadius: '10px',
        borderTopLeftRadius: '10px',
        objectFit: 'cover',
    },
    tierItemName: {
        textAlign: 'center',
        margin: '10px 6px 2px 6px',
        overflow: 'hidden',
    },
    selectedTierItem: {
        backgroundColor: theme.palette.primary.dark,
        width: '280px',
        minHeight: '395px',
        marginTop: '15px',
        marginLeft: '25px',
        borderRadius: '10px',
        paddingBottom: '6px',
    },
    selectedTierItemImage: {
        width: '100%',
        height: '350px',
        borderTopRightRadius: '10px',
        borderTopLeftRadius: '10px',
        objectFit: 'cover',
    },
    selectedTierItemName: {
        textAlign: 'center',
        margin: '10px 6px 2px 6px',
    },
    addButton: {
        marginLeft: '60px',
        width: '200px',
    },
    nextButton: {
        marginLeft: '68px',
        marginTop: '60px',
        width: '200px',
    }
});

class TierListDialog extends Component {
    state = {
        open: false,
        open2: false,
        isAddTierItem: false,
        selectedIndex: -1,
        selectedImage: 'https://firebasestorage.googleapis.com/v0/b/tierlist-57d59.appspot.com/o/tierItemImages%2Fno-img.png?alt=media',
        selectedName: 'name',
        selectedTab: 0,
    }
    handleOpen = () => {
        this.setState({ open: true });
    }
    handleClose = () => {
        this.setState({ open: false });
        this.props.clearErrors();
    }
    handleSelected(index, name, imageUrl) {
        this.setState({ 
            selectedIndex: index,
            selectedName: name,
            selectedImage: imageUrl,
        });
    }
    handleAllTierItemsClick = () => {
        this.props.refreshTierItems();
        this.setState({ 
            isAddTierItem: false,
            selectedTab: 0 
        });
    }
    handleUserTierItemsClick = (userId) => {
        this.props.getUserTierItems(userId);
        this.setState({ 
            isAddTierItem: false,
            selectedTab: 1 
        });
    }
    handleAddTierItemClick = () => {
        this.setState({ 
            isAddTierItem: true,
            selectedTab: 2 
        });
    }
     
    render(){
        const { classes, user: { credentials: { userId }}, UI: { loading }, data: { viewTierItems }} = this.props;
        
        const tierItemMarkup = (
            viewTierItems.map((tierItem, index) => (
                <Grid key={index} item xs={3}>
                    <Paper onClick={this.handleSelected.bind(this, index, tierItem.name, tierItem.imageUrl)} className={ this.state.selectedIndex === index ? classes.clickTierItem : classes.tierItem}>
                        <img src={tierItem.imageUrl} className={classes.tierItemImage} alt="Tier Item Picture" />
                        <Typography className={classes.tierItemName}>{tierItem.name}</Typography>
                    </Paper>
                </Grid>
            ))
        );
        return(
            <Fragment>
                <Button className={classes.expandButton} variant="contained" onClick={this.handleOpen}>
                    Add stuff!
                </Button>
                <Dialog  className={classes.dialog} open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="lg">
                    <DialogTitle className={classes.dialogTitle} >
                        <AppBar position="static">
                            <Grid container>
                                <Grid item xs={11}>
                                <Tabs value={this.state.selectedTab} indicatorColor="secondary" aria-label="simple tabs example">
                                    <Tab label="Tier Items" onClick={this.handleAllTierItemsClick} value={0}/>
                                    <Tab label="Your Tier Items" onClick={this.handleUserTierItemsClick.bind(this,userId)} value={1}/>
                                    <Tab label="Add Tier Items" onClick={this.handleAddTierItemClick} value={2}/>
                                </Tabs>
                                </Grid>
                                <Grid item xs={1}>
                                    <MyButton tip="close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                                        <CloseIcon></CloseIcon>
                                    </MyButton>
                                </Grid>
                            </Grid>
                        </AppBar>
                    </DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        <Grid container spacing={3}>
                            <Grid className={classes.selectionContainer} container item xs={9} spacing={3}>
                                {!this.state.isAddTierItem ? (tierItemMarkup) : (
                                    <Fragment></Fragment>
                                )}
                            </Grid>
                            <Grid item xs={3}>
                                <Paper className={classes.selectedTierItem}>
                                    <img src={this.state.selectedImage} className={classes.selectedTierItemImage} alt="Tier Item Picture" />
                                    <Typography className={classes.selectedTierItemName}>{this.state.selectedName}</Typography>
                                </Paper>
                                <Button color="secondary" className={classes.nextButton} variant="contained">Next</Button>
                            </Grid>  
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

TierListDialog.propTypes = {
    clearErrors: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    getUserTierItems: PropTypes.func.isRequired,
    refreshTierItems: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
    data: state.data,
    UI: state.UI,
})

const mapActionsToProps = {
    getUserTierItems,
    refreshTierItems,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(TierListDialog));