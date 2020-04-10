import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = (theme) => ({
    root: {
        minWidth: 120,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
        width: 100,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
});

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formValue: 'defaultValue' in props ? props.defaultValue : '',
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.listener(this.props.label, event.target.value);
        this.setState({
            formValue: event.target.value,
        });
    }

    render() {
        const { classes, label, list } = this.props;
        return (
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">{label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.formValue}
                    onChange={this.handleChange}
                >
                    {list.map((value, index) => {
                        return <MenuItem key={value} value={value}>{value}</MenuItem>
                    })}
                </Select>
            </FormControl>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Dropdown);
