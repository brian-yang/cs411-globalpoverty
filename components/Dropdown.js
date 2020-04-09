import { makeStyles, createStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => createStyles({
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
}));

const Dropdown = (props) => {
    const { label, list } = props;
    const classes = useStyles();
    const [formValue, setFormValue] = React.useState('');

    const handleChange = (event) => {
        setFormValue(event.target.value);
    };

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formValue}
                onChange={handleChange}
            >
                {list.map((value, index) => {
                    return <MenuItem key={value} value={value}>{value}</MenuItem>
                })}
            </Select>
        </FormControl>
    );
}

export default Dropdown;