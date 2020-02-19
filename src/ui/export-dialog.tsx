import React from 'react';
import {
    Button,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Theme,
    WithStyles,
    withStyles
} from "@material-ui/core";
import Constants from "../constants";

interface ExportDialogProps extends WithStyles<typeof appStyles> {
    title: string,
    open: boolean,
    onClose: () => void,
    text: string
}

const appStyles = (theme: Theme) => createStyles({
    theInput: {
        fontSize: 10,
        fontFamily: 'Courier'
    }
});

export default withStyles(appStyles)(
    class extends React.Component<ExportDialogProps, any> {

        constructor(props: ExportDialogProps) {
            super(props);
        }

        private handleClose = () => {
            this.props.onClose();
        };

        render() {
            return (
                <div>
                    <Dialog open={this.props.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To subscribe to this website, please enter your email address here. We will send updates
                                occasionally.
                            </DialogContentText>
                            <TextField
                                InputProps={{
                                    className: this.props.classes.theInput
                                }}
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Diagram Markup"
                                type="text"
                                fullWidth
                                multiline
                                rows={Constants.numberOfRows}
                                defaultValue={this.props.text}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        }
    });
