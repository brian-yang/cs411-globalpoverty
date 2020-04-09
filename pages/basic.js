import Layout from '../components/Layout';
import Dropdown from '../components/Dropdown';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const visualizationType = [
    "Country",
    "World Region"
]

const dummy = {
    1979: 0.5,
    1980: 0.7,
    1981: 0.7,
    1982: 1.2,
    1983: 0.7,
    1984: 1,
    1985: 2,
}
const dummy2 = [
    "United States",
    "Canada",
]
const dummy3 = [
    1976,
    1981,
    1995,
]

const data = [
    {
        name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
    },
    {
        name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
    },
    {
        name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
    },
    {
        name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
    },
    {
        name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
    },
    {
        name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
    },
    {
        name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
    },
];

class Basic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            country: "United States",
            loading: true,
            typeLabel: "Country",
        }
        this.fetchData = this.fetchData.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        this.setState({ loading: true }, () => {
            axios.post('/api/find/', {
                params: {
                    minYear: 1900,
                    maxYear: 2050,
                }
            })
                .then((response) => {
                    const { data } = response.data;
                    this.setState({
                        percentages: dummy,
                        loading: false,
                    });
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.log(error);
                });
        });
    }

    handleDropdownChange(label, value) {
        console.log(label, value);
        if (label === "Type") {
            this.setState({
                typeLabel: value,
            });
        }
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
                        listener={this.handleDropdownChange} />
                </Layout>

                <hr />

                <Box ml={2}>
                    <b><h2>Display Global Poverty Statistics</h2></b>
                    <Dropdown label={this.state.typeLabel} list={dummy2} listener={this.handleDropdownChange} /> <br />
                    <Dropdown label="Min Year" list={dummy3} listener={this.handleDropdownChange} />
                    <Dropdown label="Max Year" list={dummy3} listener={this.handleDropdownChange} />
                    <br />
                    <br />
                    {this.state.country} - Graph Visualization

                    <br />
                    <br />

                    <LineChart width={500} height={300} data={data}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                    </LineChart>
                </Box>

                < br />
                <br />

                <hr />

                <Box ml={2}>
                    <b><h2>Add/Update Global Poverty Data</h2></b>
                    <Dropdown label={this.state.typeLabel} list={dummy2} listener={this.handleDropdownChange} />
                    <Dropdown label="Year" list={dummy3} listener={this.handleDropdownChange} />
                    <Dropdown label="Percentage" list={dummy3} listener={this.handleDropdownChange} />
                    <br /> <br />
                    <Button variant="outlined" color="primary" type="submit">Submit</Button>
                </Box>

                <hr />

                <Box ml={2}>
                    <b><h2>Delete User-Inserted Global Poverty Data</h2></b>
                    <Dropdown label={this.state.typeLabel} list={dummy2} listener={this.handleDropdownChange} />
                    <Dropdown label="Year" list={dummy3} listener={this.handleDropdownChange} />
                    <br /> <br />
                    <Button variant="outlined" color="primary" type="submit">Submit</Button>
                </Box>
            </div>
        );
    }
}

export default Basic;