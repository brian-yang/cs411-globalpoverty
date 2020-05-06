import Layout from '../components/Layout';
import Dropdown from '../components/Dropdown';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';

class Advanced extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            fileName: '',
            uploadedFile: false,
            countryList: [],
            years: [],
            typeLabel: "Country",
            files: [],
        }

        this.fetchData = this.fetchData.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
        this.uploadFileToAPI = this.uploadFileToAPI.bind(this);
        this.insertDisplayData = this.insertDisplayData.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
                        countryList: countries,
                        loading: false,
                    });
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.log(error);
                });
        });
    }

    handleInputChange(label, action, value) {
        if (label === "Dataset") {
            console.log(value);
            this.getDataset(value);
        }
    }

    getDataset(dataset) {
        var url = '/api/getDatasetKeys';

        this.setState({ loading: true }, () => {
            axios.post(url, { datasetName: dataset })
                .then((response) => {
                    var { entities, minYear, maxYear } = response.data;

                    console.log(response.data);

                    // Get list of years
                    var years = [];
                    for (var i = minYear; i <= maxYear; i++) {
                        years.push(i);
                    }

                    this.setState({
                        loading: false,
                        countryList: entities,
                        years: years
                    })
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.log(error);
                })
        });
    }

    onSubmit = (action) => (event) => { }


    onFileUpload = (event) => {
        var file = event.target.files[0];
        if (file.type !== "text/csv") {
            alert("Please upload a CSV file");
            return;
        }

        var reader = new FileReader();
        reader.fileName = file.name;
        reader.onload = this.uploadFileToAPI;
        reader.readAsText(file);
    }

    uploadFileToAPI = (event) => {
        var url = '/api/uploadCSV';
        var formData = event.target.result;
        var fileName = event.target.fileName;

        this.setState({ loading: true }, () => {
            axios.post(url, { data: formData, fileName: fileName })
                .then((response) => {
                    var { status, fileName, fileNameTruncated } = response.data;

                    console.log(response);
                    this.setState({ loading: false });

                    if (status === "fail") {
                        alert("Failed to upload CSV file");
                        return;
                    }

                    this.setState({
                        fileName: fileName,
                        uploadedFile: true,
                        files: [...this.state.files, fileNameTruncated]
                    })
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.log(error);
                })
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

    render() {
        return (
            <div>
                <Layout>
                    <b><h2>Poverty Dataset Correlation</h2></b>
                    <Button
                        variant="contained"
                        component="label">
                        Upload File
                        <input
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={this.onFileUpload} />
                    </Button>
                    <br />
                    <br />
                    {this.state.uploadedFile &&
                        <p>Uploaded file: {this.state.fileName}</p>}
                </Layout>

                <hr />

                <Box ml={2}>
                    <b><h2>Poverty Data Correlation</h2></b>
                    <Dropdown label="Dataset" list={this.state.files} action="display" listener={this.handleInputChange} /> <br />
                    <Dropdown label={this.state.typeLabel} list={this.state.countryList} action="display" listener={this.handleInputChange} />
                    <Dropdown label="Min Year" list={this.state.years} action="display" listener={this.handleInputChange} />
                    <Dropdown label="Max Year" list={this.state.years} action="display" listener={this.handleInputChange} /> <br />
                    <Button variant="outlined" color="primary" onClick={this.onSubmit("display")} type="submit">Submit</Button>

                    <br />
                    <br />
                    Graph Visualization

                    <br />
                    <br />

                    {/* {this.state.canGraphData &&
                        <LineChart width={500} height={300} data={this.state.graphData}>
                            <XAxis dataKey="xValue" />
                            <YAxis />
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="yValue" stroke="#8884d8" />
                        </LineChart>
                    } */}
                </Box>

                <br />
                <br />

                <hr />
            </div >
        );
    }
}

export default Advanced;