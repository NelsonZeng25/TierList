import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from '../../util/MyButton';
import axios from 'axios';
import TierItemDialog from '../tierItem/TierItemDialog';
import TierItemDialogSkeleton from '../tierItem/TierItemDialogSkeleton';

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
import CloseIcon from '@material-ui/icons/Close';

// Redux stuff
import { connect } from 'react-redux';
import { getUserTierItems, refreshTierItems, uploadTierItemImage, postTierItem, 
    updateTierItem, clearErrors, getTierItemsForOneCategory } from '../../redux/actions/dataActions';
import { TextField } from "@material-ui/core";

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
        maxHeight: '50px',
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
    selectedTierItem: {
        backgroundColor: theme.palette.primary.dark,
        width: '260px',
        minHeight: '395px',
        marginTop: '15px',
        marginLeft: '35px',
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
        overflow: 'auto',
    },
    addTierItem: {
        backgroundColor: theme.palette.primary.dark,
        width: '280px',
        minHeight: '395px',
        margin: '50px auto',
        borderRadius: '10px',
        paddingBottom: '6px',
    },
    addTierItemImage: {
        width: '100%',
        height: '350px',
        borderTopRightRadius: '10px',
        borderTopLeftRadius: '10px',
        objectFit: 'cover',
        cursor: 'pointer',
    },
    addTierItemName: {
        textAlign: 'center',
        margin: '10px 6px 2px 6px',
        overflow: 'auto',
    },
    addTierItemTitle: {},
    addNameTextField: {
        margin: '30px auto 0 auto',
        width: '300px',
        "& .MuiFormLabel-root": {
            color: theme.palette.text.primary,
        },
        "& .MuiFormLabel-root.Mui-focused": {
            color: theme.palette.text.primary,
        },
        "& .Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: 'white',
            }
        },
    },
    addButton: {
        marginTop: '30px',
        width: '200px',
    },
    updateButton: {
        position: 'relative',
        zIndex: 3,
    },
    updateTierItemTitle: {
        marginLeft: '23px',
        marginTop: '100px',
    },
    errorMessage: {
        textAlign: 'center',
        marginTop: '20px',
        marginLeft: '40px',
    },
    nextButton: {
        marginLeft: '35px',
        marginTop: '10px',
        width: '200px',
    },
    "@media only screen and (max-width: 1200px)": {
        expandButton: {
            position: 'relative',
            marginTop: '100px',
            marginLeft: '115px',
        },
        selectionContainer: {
            maxWidth: '100%',
            flexBasis: '100%',
        },
        selectedTierItem: {
            display: 'none',
        },
        selectionGrid: {
            maxWidth: '100%',
            flexBasis: '100%',
        },
        dialog: {
            "& .MuiDialog-paper": {
                height: '780px',
            }
        },
        errorMessage: {
            textAlign: 'center',
            marginTop: '5px',
            marginLeft: '0px',
        },
        nextButton: {
            marginTop: '10px',
            marginLeft: '0px',
        }
    },
    "@media only screen and (max-width: 750px)": {
        editGrid: {
            maxWidth: '100%',
            flexBasis: '100%',
        },
    },
});

class TierListDialog extends Component {
    state = {
        noImg: 'https://firebasestorage.googleapis.com/v0/b/tierlist-57d59.appspot.com/o/tierItemImages%2Fno-img.png?alt=media',
        open: false,
        isAddTierItem: false,
        isUpdateTierItem: false,

        selectedIndex: -1,
        selectedImage: '',
        selectedName: 'name',
        selectedTierItemId: '',
        selectedTab: 0,

        addTierItemImage: '',
        addTierItemImageFile: null,
        addTierItemName: '',

        updateTierItemImage: '',
        updateTierItemImageFile: null,
        updateTierItemName: '',

        loading: false,
        error: '',
        errors: {},
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.UI.errors)
            this.setState({ errors: nextProps.UI.errors });
    }
    handleOpen = () => {
        this.props.getTierItemsForOneCategory(this.props.data.tierList.category);
        this.handleAllTierItemsClick();
        this.setState({ 
            open: true,
            selectedImage: this.state.noImg,
            addTierItemImage: this.state.noImg,
            addTierItemName: '',
            selectedName: 'name',
            selectedTierItemId: '',
        });
    }
    handleClose = () => {
        this.setState({ open: false });
        this.props.clearErrors();
        if (this.state.addTierItemImage !== this.state.noImg)
            URL.revokeObjectURL(this.state.addTierItemImage);
    }
    handleSelected = (index, name, imageUrl, tierItemId) => {
        this.setState({ 
            selectedIndex: index,
            selectedName: name,
            selectedImage: imageUrl,
            selectedTierItemId: tierItemId,
            updateTierItemImage: imageUrl,
            updateTierItemImageFile: null,
            updateTierItemName: name,
            error: '',
        });
    }
    handleAllTierItemsClick = () => {
        this.props.refreshTierItems();
        this.setState({ 
            isAddTierItem: false,
            isUpdateTierItem: false,
            selectedTab: 0 
        });
    }
    handleUserTierItemsClick = (userId) => {
        this.props.getUserTierItems(userId);
        this.setState({ 
            isAddTierItem: false,
            isUpdateTierItem: false,
            selectedTab: 1 
        });
    }
    handleAddTierItemClick = () => {
        this.setState({ 
            isAddTierItem: true,
            isUpdateTierItem: false,
            selectedTab: 2,
            errors: {},
        });
    }
    handleUpdateTierItemClick = () => {
        this.setState({
            isAddTierItem: false,
            isUpdateTierItem: true,
            errors: {},
        })
    }
    handleNameChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    handleImageChange = (event) => {
        if (event.target.files[0]) {
            const imageUrl = URL.createObjectURL(event.target.files[0]);
            if (this.state.addTierItemImage !== this.state.noImg)
                URL.revokeObjectURL(this.state.addTierItemImage);
            this.setState({ 
                addTierItemImage: imageUrl,
                addTierItemImageFile: event.target.files[0],
            });
        }
    }
    handleEditPicture = () => {
        const fileInput = document.getElementById('tierItemImageInput');
        fileInput.click();
    }
    handleAddTierItem = () => {
        this.setState({ loading: true });
        let imageUrl;

        if (this.state.addTierItemImageFile && this.state.addTierItemName.trim() !== '') {
            URL.revokeObjectURL(this.state.addTierItemImage);

            const image = this.state.addTierItemImageFile;
            const formData = new FormData();
            formData.append('image', image, image.name);
            axios.post(`/tierItems/image`, formData)
                .then(res => {
                    this.setState({ addTierItemImage: res.data.imageUrl });
                    imageUrl = res.data.imageUrl;
                    const name = this.state.addTierItemName;
                    const category = this.props.data.tierList.category;
                    this.props.postTierItem({ name, imageUrl, category });

                    this.setState({ 
                        addTierItemName: '', 
                        addTierItemImage: this.state.noImg,
                        addTierItemImageFile: null,
                    });
                    this.handleUserTierItemsClick(this.props.user.credentials.userId);
                })
                .catch(err => console.log(err))
        } else {
            const name = this.state.addTierItemName;
            imageUrl = this.state.noImg;
            const category = this.props.data.tierList.category;
            this.props.postTierItem({ name, imageUrl, category });

            if (this.state.addTierItemName.trim() !== '') {
                this.setState({ 
                    addTierItemName: '', 
                    addTierItemImage: this.state.noImg,
                    addTierItemImageFile: null,
                });
                this.handleUserTierItemsClick(this.props.user.credentials.userId);
            }
        }
    }
    handleUpdateEditPicture = () => {
        const fileInput = document.getElementById('tierItemUpdateImage');
        fileInput.click();
    }
    handleUpdateImageChange = (event) => {
        if (event.target.files[0]) {
            const imageUrl = URL.createObjectURL(event.target.files[0]);
            if (this.state.updateTierItemImage !== this.state.noImg)
                URL.revokeObjectURL(this.state.updateTierItemImage);
            this.setState({ 
                updateTierItemImage: imageUrl,
                updateTierItemImageFile: event.target.files[0],
            });
        }
    }
    handleUpdateTierItem = () => {
        this.setState({ loading: true });
        let imageUrl;
        if (this.state.updateTierItemImageFile && this.state.updateTierItemName.trim() !== '') {
            const image = this.state.updateTierItemImageFile;
            const formData = new FormData();
            formData.append('image', image, image.name);
            axios.post(`/tierItems/image`, formData)
                .then(res => {
                    imageUrl = res.data.imageUrl;
                    const name = this.state.updateTierItemName;
                    this.props.updateTierItem({ name, imageUrl, tierItemId: this.state.selectedTierItemId });
                    this.setState({ 
                        selectedImage: imageUrl,
                        selectedName: name,
                    });

                    this.handleUserTierItemsClick(this.props.user.credentials.userId);
                })
                .catch(err => console.log(err))
        } else {
            const name = this.state.updateTierItemName;
            imageUrl = this.state.updateTierItemImage;
            this.props.updateTierItem({ name, imageUrl, tierItemId: this.state.selectedTierItemId });
            
            if (this.state.updateTierItemName.trim() !== '') {
                this.setState({ selectedName: name });
                this.handleUserTierItemsClick(this.props.user.credentials.userId);
            }
        }
    }
    handleNext = () => {
        if (this.state.selectedTierItemId === '')
            this.setState({ error: 'No Item Selected'});
        else if (this.props.data.tierItems.findIndex((tierItem) => tierItem.tierItemId === this.state.selectedTierItemId) === -1)
            this.setState({ error: 'Item not found'});
        else
            this.setState({ error: ''});
    }

    render(){
        const { classes, user: { credentials: { userId }}, UI: { loading }, data: { viewTierItems }} = this.props;
        const { errors } = this.state;
        const tierItemMarkup = ( !loading ? (
            viewTierItems.map((tierItem, index) => (
                <TierItemDialog tierItem={tierItem} index={index} handleSelected={this.handleSelected} selectedIndex={this.state.selectedIndex} handleUpdateTierItemClick={this.handleUpdateTierItemClick}/>
            ))) : (
                <Fragment>
                    {Array.from({ length: 8 }).map((item, index) => (
                        <TierItemDialogSkeleton key={index} />
                    ))}
                </Fragment>
            )
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
                        <Grid className={classes.contentContainer} container spacing={3}>
                            <Grid className={classes.selectionContainer} container item xs={9} spacing={3}>
                                {!this.state.isAddTierItem ? (!this.state.isUpdateTierItem ? (tierItemMarkup): (
                                    <Fragment>
                                        <Grid className={classes.editGrid} item xs={6}>
                                            <Paper className={classes.addTierItem}>
                                                <img id="tierItemImage" onClick={this.handleUpdateEditPicture} src={this.state.updateTierItemImage} className={classes.addTierItemImage} alt="Tier Item Picture" />
                                                <input type="file" id="tierItemUpdateImage" hidden="hidden" onChange={this.handleUpdateImageChange}/>
                                                <Typography className={classes.addTierItemName}>{this.state.updateTierItemName}</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid className={classes.editGrid} container justify="center" alignItems="center" direction="column" item xs={6}>
                                            <Grid item>
                                                <Typography variant="h4" className={classes.addTierItemTitle}>Update Tier Item</Typography>
                                            </Grid>
                                            <Grid item>
                                                <TextField helperText={errors.name} error={errors.name ? true : false} className={classes.addNameTextField} variant="outlined" type="text" name="updateTierItemName" label="Name" value={this.state.updateTierItemName} onChange={this.handleNameChange}></TextField>
                                            </Grid>
                                            <Grid item>
                                                <Button onClick={this.handleUpdateTierItem} color="secondary" className={classes.addButton} variant="contained">Update</Button>
                                            </Grid>
                                        </Grid>
                                    </Fragment>
                                )) : (
                                    <Fragment>
                                        <Grid className={classes.editGrid} item xs={6}>
                                            <Paper className={classes.addTierItem}>
                                                <img id="tierItemImage" onClick={this.handleEditPicture} src={this.state.addTierItemImage} className={classes.addTierItemImage} alt="Tier Item Picture" />
                                                <input type="file" id="tierItemImageInput" hidden="hidden" onChange={this.handleImageChange}/>
                                                <Typography className={classes.addTierItemName}>{this.state.addTierItemName}</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid className={classes.editGrid} container justify="center" alignItems="center" direction="column" item xs={6}>
                                            <Grid item>
                                                <Typography variant="h4" className={classes.addTierItemTitle}>Create Tier Item</Typography>
                                            </Grid>
                                            <Grid item>
                                                <TextField helperText={errors.name} error={errors.name ? true : false} className={classes.addNameTextField} variant="outlined" type="text" name="addTierItemName" label="Name" value={this.state.addTierItemName} onChange={this.handleNameChange}></TextField>
                                            </Grid>
                                            <Grid>
                                                <Button onClick={this.handleAddTierItem} color="secondary" className={classes.addButton} variant="contained">Add</Button>
                                            </Grid>
                                        </Grid>
                                    </Fragment>
                                )}
                            </Grid>
                            <Grid className={classes.selectionGrid} container justify="center" alignItems="center" direction="column" item xs={3}>
                                <Grid item>
                                    <Paper className={classes.selectedTierItem}>
                                        <img src={this.state.selectedImage} className={classes.selectedTierItemImage} alt="Tier Item Picture" />
                                        <Typography className={classes.selectedTierItemName}>{this.state.selectedName}</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" color="error" className={classes.errorMessage}>{this.state.error}</Typography>
                                </Grid>
                                <Grid item>
                                    <Button color="secondary" className={classes.nextButton} variant="contained" onClick={this.handleNext}>Next</Button>
                                </Grid>
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
    uploadTierItemImage: PropTypes.func.isRequired,
    postTierItem: PropTypes.func.isRequired,
    updateTierItem: PropTypes.func.isRequired,
    getTierItemsForOneCategory: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
    data: state.data,
    UI: state.UI,
})

const mapActionsToProps = {
    getUserTierItems,
    refreshTierItems,
    uploadTierItemImage,
    postTierItem,
    updateTierItem,
    getTierItemsForOneCategory,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(TierListDialog));