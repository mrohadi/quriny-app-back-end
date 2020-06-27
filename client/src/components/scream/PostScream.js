import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// Redux
import { postScream, clearErrors } from "../../redux/actions/dataAction";
// MUI Core Stuff
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
// MUI Icon Stuff
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
// Components / Utilities
import MyButton from "../../util/MyButton";

const styles = (theme) => ({
  ...theme.spreadThis,
  submitButton: {
    position: "relative",
    float: "right",
    marginTop: 10,
    marginButtom: 10,
  },
  progressSpinner: {
    position: "absolute",
  },
  closeButton: {
    position: "absolute",
    left: "90%",
    top: "6%",
  },
});

class PostScream extends Component {
  state = {
    open: false,
    body: "",
    errors: {},
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors,
      });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: "", open: false, errors: {} });
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.props.clearErrors();
    this.setState({ open: false, errors: {} });
  };
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.postScream({ body: this.state.body });
  };
  render() {
    const { errors } = this.state;
    const {
      classes,
      UI: { loading },
    } = this.props;

    console.log(errors.body);

    return (
      <Fragment>
        <MyButton onClick={this.handleOpen} tipTitle="Post a Scream!">
          <AddIcon />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tipTitle="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogTitle>What's Happening?</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                name="body"
                type="text"
                label="Scream!"
                multiline
                rows="3"
                placeholder="What's happening?"
                error={errors.body ? true : false}
                helperText={errors.body}
                className={classes.TextField}
                onChange={this.handleChange}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitButton}
                disabled={loading}
              >
                Submit
                {loading && (
                  <CircularProgress
                    size={30}
                    className={classes.progressSpinner}
                  />
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

PostScream.propTypes = {
  postScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.UI,
});

export default connect(mapStateToProps, { postScream, clearErrors })(
  withStyles(styles)(PostScream)
);
