import Layout from '../components/Layout';
import Dropdown from '../components/Dropdown';
import axios from 'axios';

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

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            country: "United States",
            loading: true,
        }
        this.fetchData = this.fetchData.bind(this);
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

    render() {
        return (
            <div>
                <Layout>
                    <h1>Global Poverty Visualizer</h1>
                    <h2>CS 411 - Team 71</h2>
                    <h3>Created by: Danqi Luo, Sean Coughlin, Haorong Sun, Brian Yang</h3>
                </Layout>

                <hr />
                <b><h2>Find Global Poverty Statistics - By Country</h2></b>
                <Dropdown label="Country" list={dummy2} /> <br />
                <Dropdown label="Min Year" list={dummy3} />
                <Dropdown label="MaxYear" list={dummy3} />
                <br /> <br />
                {this.state.country} - Graph Visualization
                <br /> <br />

                <hr />
                <b><h2>Add/Update Global Poverty Statistics - By Country</h2></b>
                <Dropdown label="Country" list={dummy2} />
                <Dropdown label="Year" list={dummy3} />
                <Dropdown label="Percentage" list={dummy3} />

                <hr />
                <b><h2>Remove Global Poverty Statistics - By Country</h2></b>
                <Dropdown label="Country" list={dummy2} />
                <Dropdown label="Year" list={dummy3} />
            </div>
        );

    }
}

export default App;