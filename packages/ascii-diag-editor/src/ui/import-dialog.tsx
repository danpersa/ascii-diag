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
import {Constants} from "ascii-diag-renderer";

interface ImportDialogProps extends WithStyles<typeof appStyles> {
    open: boolean,
    onClose: () => void,
    onImport: (markup: string) => void
}

const appStyles = (theme: Theme) => createStyles({
    theInput: {
        fontSize: 10,
        fontFamily: 'Courier'
    }
});

export default withStyles(appStyles)(
    class extends React.Component<ImportDialogProps, any> {
        private markup: string;

        constructor(props: ImportDialogProps) {
            super(props);
            this.markup = "";
        }

        private handleClose = () => {
            this.props.onClose();
        };

        private handleImport = () => {
            this.props.onImport(this.markup);
            this.markup = "";
        };

        private handleChange = (event: React.ChangeEvent<{ value: string }>) => {
            this.markup = event.target.value;
        };


        render() {
            return (
                <div>
                    <Dialog open={this.props.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth={true}>
                        <DialogTitle id="form-dialog-title">Import Diagram</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Add your markup for your diagram in the next field:
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
                                onChange={this.handleChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleImport} color="primary">
                                Import
                            </Button>
                            <Button onClick={this.handleClose} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        }
    });
