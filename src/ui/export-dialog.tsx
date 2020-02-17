import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@material-ui/core";
import Constants from "../constants";


type ExportDialogProps = {
    title: string,
    open: boolean,
    onClose: () => void,
    text: string
}

export default function ExportDialog({
                                         title,
                                         open,
                                         onClose,
                                         text,
                                     }: ExportDialogProps) {
    const handleClose = () => {
        onClose();
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will send updates
                        occasionally.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Diagram Markup"
                        type="text"
                        fullWidth
                        multiline
                        rows={Constants.numberOfRows}
                        defaultValue={text}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
