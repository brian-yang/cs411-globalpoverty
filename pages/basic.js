import Layout from '../components/Layout';
import Dropdown from '../components/Dropdown';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const visualizationType = [
    "Country",
    "World Region"
]

class Basic extends React.Component {
    constructor(props) {
        super(props);

        var years = [];
        for (var i = 0; i < 121; i++) {
            years.push(i + 1900);
        }

        this.state = {
            loading: true,
            typeLabel: "Country",
            list: [],
            countries: [],
            regions: [],
            years: years,
            display: {},
            change: {},
            del: {},
            userRows: [],
            graphData: [],
            canGraphData: false,
        }

        this.fetchData = this.fetchData.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePercentChange = this.handlePercentChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getDisplayData = this.getDisplayData.bind(this);
        this.updateDisplayData = this.updateDisplayData.bind(this);
        this.insertDisplayData = this.insertDisplayData.bind(this);
        this.deleteDisplayData = this.deleteDisplayData.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        this.setState({ loading: true }, () => {
            axios.post('/api/listCountries')
                .then((response) => {
                    const { countries } = response.data;
                    this.setState({
                        countries: countries,
                        list: countries,
                        loading: false,
                    });
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.log(error);
                });
        });

        this.setState({ loading: true }, () => {
            axios.post('/api/listRegions')
                .then((response) => {
                    const { regions } = response.data;
                    this.setState({
                        regions: regions,
                        loading: false,
                    });
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.log(error);
                });
        });
    }

    handlePercentChange(event) {
        event.preventDefault();
        this.handleInputChange("Percentage", "change", event.target.value);
    }

    handleInputChange(label, action, value) {
        console.log(label, action, value);

        if (label === "Type") {
            var list = this.state.countries;
            if (value === "World Region") {
                list = this.state.regions;
            }

            this.setState({
                typeLabel: value,
                list: list,
            });
        } else if (action === "display") {
            var display = this.state.display;

            if (label === "Min Year") {
                display.minYear = parseInt(value);
            }
            else if (label === "Max Year") {
                display.maxYear = parseInt(value);
            }
            else {
                display.location = value;
            }

            this.setState({
                display: display,
            });
        } else if (action === "change") {
            var change = this.state.change;

            if (label === "Year") {
                change.year = parseInt(value);
            } else if (label === "Percentage") {
                change.percentage = parseFloat(value);
            } else {
                change.location = value;
            }

            this.setState({
                change: change,
            });
        } else if (action === "delete") {
            var del = this.state.del;

            if (label === "Year") {
                del.year = parseInt(value);
            } else {
                del.location = value;
            }

            this.setState({
                del: del,
            });
        }
    }

    onSubmit = (action) => (event) => {
        event.preventDefault();
        if (action === "display" && "location" in this.state.display) {
            const location = this.state.display.location;
            var minYear = 1900;
            var maxYear = 2020;
            if ('minYear' in this.state.display) {
                minYear = this.state.display.minYear;
            }
            if ('maxYear' in this.state.display) {
                maxYear = this.state.display.maxYear;
            }

            if (minYear > maxYear) {
                alert("Invalid year range.")
                return;
            }

            this.getDisplayData(location, minYear, maxYear, this.state.typeLabel);
        }

        else if (action === "change") {
            if ((!("location" in this.state.change)) ||
                (!("year" in this.state.change)) ||
                (!("percentage" in this.state.change))) {
                return;
            }

            var { location, year, percentage } = this.state.change;
            if (percentage < 0 || percentage > 100) {
                alert("Invalid percentage");
                return;
            }

            console.log(this.state.userRows);
            console.log(location, year);
            console.log(this.state.userRows.some((row) => {
                row.location === location && row.year == year
            }));

            var containsRow = false;
            for (var i = 0; i < this.state.userRows.length; i++) {
                var userRow = this.state.userRows[i];
                if (userRow.location === location && userRow.year == year) {
                    containsRow = true;
                    break;
                }
            }

            if (containsRow) {
                this.updateDisplayData(location, year, percentage, this.state.typeLabel);
            } else {
                this.insertDisplayData(location, year, percentage, this.state.typeLabel);
            }
        }

        else if (action === "delete") {
            if ((!("location" in this.state.del)) ||
                (!("year" in this.state.del))) {
                return;
            }

            var { location, year } = this.state.del;

            var containsRow = false;
            for (var i = 0; i < this.state.userRows.length; i++) {
                var userRow = this.state.userRows[i];
                if (userRow.location === location && userRow.year == year) {
                    containsRow = true;
                    break;
                }
            }

            if (!containsRow) {
                alert("Data cannot be deleted. User can only delete user-inserted data.");
                return;
            }

            this.deleteDisplayData(location, year, this.state.typeLabel);
        }
    }

    updateDisplayData(location, year, percentage, type) {
        this.setState({ loading: true }, () => {
            axios.post('/api/update', {
                location: location,
                year: year,
                percentage: percentage,
                type: type,
            })
                .then((response) => { })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.log(error);
                });
        });
    }

    insertDisplayData(location, year, percentage, type) {
        this.setState({ loading: true }, () => {
            axios.post('/api/insert', {
                location: location,
                year: year,
                percentage: percentage,
                type: type,
            })
                .then((response) => {
                    const { location, year } = response.data;

                    var userRows = this.state.userRows;
                    userRows.push({ location: location, year: year });

                    this.setState({
                        userRows: userRows,
                        loading: false,
                    });
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.log(error);
                });
        });
    }

    deleteDisplayData(location, year, type) {
        this.setState({ loading: true }, () => {
            axios.post('/api/delete', {
                location: location,
                year: year,
                type: type,
            })
                .then((response) => {
                    const { location, year } = response.data;

                    var userRows = this.state.userRows.filter((row) => {
                        row.location !== location && row.year != year
                    });
                    console.log(userRows);

                    this.setState({
                        userRows: userRows,
                        loading: false,
                    });
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.log(error);
                });
        });
    }

    getDisplayData(location, minYear, maxYear, type) {
        this.setState({ loading: true }, () => {
            axios.post('/api/find', {
                location: location,
                minYear: minYear,
                maxYear: maxYear,
                type: type,
            })
                .then((response) => {
                    const { graphData } = response.data;
                    this.setState({
                        graphData: graphData,
                        canGraphData: true,
                        loading: false,
                    });
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.log(error);
                });
        });
    }

    render() {
        return (
            <div>
                <Layout>
                    <b><h2>Visualization Type</h2></b>
                    <Dropdown
                        label="Type"
                        list={visualizationType}
                        defaultValue={visualizationType[0]}
                        listener={this.handleInputChange} />
                </Layout>

                <hr />

                <Box ml={2}>
                    <b><h2>Display Global Poverty Statistics</h2></b>
                    <Dropdown label={this.state.typeLabel} list={this.state.list} action="display" listener={this.handleInputChange} /> <br />
                    <Dropdown label="Min Year" list={this.state.years} action="display" listener={this.handleInputChange} />
                    <Dropdown label="Max Year" list={this.state.years} action="display" listener={this.handleInputChange} /> <br />
                    <Button variant="outlined" color="primary" onClick={this.onSubmit("display")} type="submit">Submit</Button>

                    <br />
                    <br />
                    Graph Visualization

                    <br />
                    <br />

                    {this.state.canGraphData &&
                        <LineChart width={500} height={300} data={this.state.graphData}>
                            <XAxis dataKey="xValue" />
                            <YAxis />
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="yValue" stroke="#8884d8" />
                        </LineChart>
                    }
                </Box>

                <br />
                <br />

                <hr />

                <Box ml={2}>
                    <b><h2>Add/Update Global Poverty Data</h2></b>
                    <Dropdown label={this.state.typeLabel} list={this.state.list} action="change" listener={this.handleInputChange} />
                    <Dropdown label="Year" list={this.state.years} action="change" listener={this.handleInputChange} />

                    <br /> <br />
                    <TextField
                        id="standard-number"
                        label="% of People in Poverty"
                        type="number"
                        onChange={this.handlePercentChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <br /> <br />

                    <Button variant="outlined" color="primary" onClick={this.onSubmit("change")} type="submit">Submit</Button>
                </Box>

                <hr />

                <Box ml={2}>
                    <b><h2>Delete User-Inserted Global Poverty Data</h2></b>
                    <Dropdown label={this.state.typeLabel} list={this.state.list} action="delete" listener={this.handleInputChange} />
                    <Dropdown label="Year" list={this.state.years} action="delete" listener={this.handleInputChange} />
                    <br /> <br />
                    <Button variant="outlined" color="primary" onClick={this.onSubmit("delete")} type="submit">Submit</Button>
                </Box>
            </div >
        );
    }
}

export default Basic;