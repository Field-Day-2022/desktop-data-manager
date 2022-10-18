/*
 * File: AnswerSetSelect.js
 * Version: 1.01 US167
 * Date: 2020-03-01
 * Description: Builds the selection menu for the user to make selections.
 */
import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Field from '@material-ui/core/Input';
import FieldLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { APIContext } from '../APIContext/APIContext';

const styles = (theme) => ({
    formControl: {
        marginTop: theme.spacing.unit,
        width: '100%',
    },
    textfield: {
        width: '100%',
    },
});

class AnswerSetSelect extends Component {
    onChange = (event) => {
        const { onChangeAnswerSet } = this.props;
        let answer_set = event.target.value;
        if (answer_set === '_') {
            answer_set = null;
        } else if (answer_set === 'custom') {
        }
        onChangeAnswerSet(answer_set);
    };

    render() {
        const { classes, answer_set, onChangeAnswerSet, answerSets } = this.props;

        const isCustom = answer_set && !answerSets.find((s) => s.set_name === answer_set);

        return (
            <Fragment>
                <FormControl className={classes.formControl}>
                    <FieldLabel shrink={!!answer_set} htmlFor="answer_set">
                        Answer Set
                    </FieldLabel>
                    <Select
                        value={answer_set}
                        onChange={this.onChange}
                        field={<Field name="answer_set" id="answer_set" />}
                    >
                        <MenuItem value="" key="none">
                            Choose Answer Set...
                        </MenuItem>
                        {answerSets.map((s) => {
                            return (
                                <MenuItem value={s.set_name} key={s.set_name}>
                                    {s.set_name}
                                </MenuItem>
                            );
                        })}
                        <MenuItem value="custom" key="custom">
                            Custom
                        </MenuItem>
                    </Select>
                </FormControl>
                {isCustom ? (
                    <TextField
                        id="answer_set"
                        label="Custom Answer Set"
                        className={classes.textfield}
                        value={answer_set}
                        onChange={(event) => onChangeAnswerSet(event.target.value)}
                        margin="normal"
                    />
                ) : null}
            </Fragment>
        );
    }
}

export default withStyles(styles)((props) => (
    <APIContext.Consumer>
        {({ answerSets }) => <AnswerSetSelect {...props} answerSets={answerSets} />}
    </APIContext.Consumer>
));
