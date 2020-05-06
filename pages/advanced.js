import Layout from '../components/Layout';
import Dropdown from '../components/Dropdown';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import {
    LineChart, Line, XAxis, YAxis, ZAxis, Tooltip, Legend, Scatter, CartesianGrid, ScatterChart
} from 'recharts';

class Advanced extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            fileName: '',
            uploadedFile: false,
            countryList: [],
            filteredCountryList: [],
            selectedCountry: "",
            selectedMinYear: 1900,
            selectedMaxYear: 2020,
            selectedDataset: "",
            years: [],
            files: [],
        }

        this.fetchData = this.fetchData.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
        this.uploadFileToAPI = this.uploadFileToAPI.bind(this);
        this.insertDisplayData = this.insertDisplayData.bind(this);
        this.genCorrelationData = this.genCorrelationData.bind(this);
        this.calcCorrelationCoefficient = this.calcCorrelationCoefficient.bind(this);
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
                        countryList: countries,
                        filteredCountryList: countries,
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
            this.getDataset(value);
            this.setState({
                selectedDataset: value,
            })
            return;
        }

        if (this.state.selectedDataset === "") {
            return;
        }

        if (label === "Country") {
            this.setState({
                selectedCountry: value,
            })
        } else if (label === "Min Year") {
            this.setState({
                selectedMinYear: value,
            })
        } else if (label === "Min Year") {
            this.setState({
                selectedMaxYear: value,
            })
        }
    }

    getDataset(dataset) {
        var url = '/api/getDatasetKeys';

        this.setState({ loading: true }, () => {
            axios.post(url, { datasetName: dataset })
                .then((response) => {
                    var { entities, minYear, maxYear } = response.data;

                    // Get list of years
                    var years = [];
                    for (var i = minYear; i <= maxYear; i++) {
                        years.push(i);
                    }

                    // Get filtered entities/countries
                    var list = this.state.countryList;
                    list = list.filter(value => entities.includes(value));


                    this.setState({
                        loading: false,
                        filteredCountryList: list,
                        years: years
                    })
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.log(error);
                })
        });
    }

    onSubmit = (action) => (event) => {
        event.preventDefault();
        if (this.state.selectedDataset === "" || this.state.selectedCountry === "") {
            alert("Please select the dataset to compare against and a country")
            return;
        }

        if (this.state.minYear > this.state.maxYear) {
            alert("Please make sure the min year is less than the max year");
            return;
        }

        this.setState({ loading: true }, () => {
            axios.post('/api/find', {
                location: this.state.selectedCountry,
                minYear: this.state.selectedMinYear,
                maxYear: this.state.selectedMaxYear,
                type: "Country",
            })
                .then((response) => {
                    const { graphData } = response.data;
                    this.setState({
                        povertyGraphData: graphData,
                        canGraphPovertyData: true,
                        loading: false,
                    });
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.log(error);
                });
        });

        this.setState({ loading: true }, () => {
            axios.post('/api/findDatasetData', {
                datasetName: this.state.selectedDataset,
                minYear: this.state.selectedMinYear,
                maxYear: this.state.selectedMaxYear,
                country: this.state.selectedCountry,
            })
                .then((response) => {
                    const { graphData } = response.data;
                    this.setState({
                        datasetGraphData: graphData,
                        canGraphDatasetData: true,
                        loading: false,
                    });
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.log(error);
                });
        });
    }


    onFileUpload = (event) => {
        if (event.target.files == undefined || event.target.files.length == 0) {
            alert("Please try uploading again");
            return;
        }

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

                    this.setState({ loading: false });

                    if (status === "fail") {
                        alert("Failed to upload CSV file");
                        return;
                    }

                    var files = this.state.files;
                    if (!files.includes(fileNameTruncated)) {
                        files.push(fileNameTruncated);
                    }

                    this.setState({
                        fileName: fileName,
                        uploadedFile: true,
                        files: files,
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

    genCorrelationData = (povertyData, datasetData) => {
        var correlationData = [];
        for (var i = 0; i < povertyData.length; i++) {
            for (var j = 0; j < datasetData.length; j++) {
                var povYear = povertyData[i].xValue;
                var datasetYear = datasetData[j].xValue;

                if (povYear == datasetYear) {
                    correlationData.push({
                        poverty: povertyData[i].yValue,
                        year: povYear,
                        other: datasetData[i].yValue,
                    })
                }
            }
        }

        return correlationData;
    }

    calcCorrelationCoefficient = (povertyData, datasetData) => {
        var commonData = [];

        for (var i = 0; i < povertyData.length; i++) {
            for (var j = 0; j < datasetData.length; j++) {
                var povYear = povertyData[i].xValue;
                var datasetYear = datasetData[j].xValue;

                if (povYear == datasetYear) {
                    commonData.push({
                        poverty: povertyData[i].yValue,
                        other: datasetData[i].yValue,
                    })
                }
            }
        }

        var povertyMean = 0.0;
        var otherMean = 0.0;
        for (var i = 0; i < commonData.length; i++) {
            povertyMean += commonData[i].poverty;
            otherMean += commonData[i].other;
        }
        povertyMean /= commonData.length;
        otherMean /= commonData.length;

        var numerator = 0.0;
        var squared_sum_pov = 0.0;
        var squared_sum_other = 0.0;
        for (var i = 0; i < commonData.length; i++) {
            numerator += (commonData[i].poverty - povertyMean) * (commonData[i].other - otherMean);
            squared_sum_pov += Math.pow(commonData[i].poverty - povertyMean, 2);
            squared_sum_other += Math.pow(commonData[i].other - otherMean, 2);
        }
        var denominator = Math.sqrt(squared_sum_pov * squared_sum_other);

        return numerator / denominator;
    }

    render() {
        return (
            <div>
                <Layout>
                    <b><h2>Upload New Dataset</h2></b>
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
                    <Dropdown label="Country" list={this.state.filteredCountryList} action="display" listener={this.handleInputChange} />
                    <Dropdown label="Min Year" list={this.state.years} action="display" listener={this.handleInputChange} />
                    <Dropdown label="Max Year" list={this.state.years} action="display" listener={this.handleInputChange} /> <br />
                    <Button variant="outlined" color="primary" onClick={this.onSubmit("display")} type="submit">Submit</Button>

                    <br />
                    <br />

                    {this.state.canGraphPovertyData &&
                        <div>
                            <p>Change in poverty</p>
                            <br />
                            <br />

                            <LineChart width={500} height={300} data={this.state.povertyGraphData}>
                                <XAxis dataKey="xValue" />
                                <YAxis />
                                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="yValue" stroke="#8884d8" />
                            </LineChart>
                        </div>
                    }

                    <br />
                    <br />

                    {this.state.canGraphDatasetData &&
                        <div>
                            <p>Change in {this.state.selectedDataset}</p>
                            <br />
                            <br />

                            <LineChart width={500} height={300} data={this.state.datasetGraphData}>
                                <XAxis dataKey="xValue" />
                                <YAxis />
                                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="yValue" stroke="#8884d8" />
                            </LineChart>
                        </div>
                    }

                    {this.state.canGraphPovertyData && this.state.canGraphDatasetData &&
                        <div>
                            <p>Correlation between poverty and {this.state.selectedDataset}</p>
                            <br />
                            <br />

                            {/* <LineChart width={500} height={300} data={}>
                                <XAxis dataKey="xValue" />
                                <YAxis />
                                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="yValue" stroke="#8884d8" />
                            </LineChart> */}

                            <ScatterChart width={500} height={300}
                                margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" name="Year" />
                                <YAxis dataKey="other" name="Custom Dataset" />
                                <ZAxis dataKey="poverty" range={[100, 200]} name="% of People in Poverty" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend />
                                <Scatter name="Correlation between datasets over time" data={this.genCorrelationData(this.state.povertyGraphData, this.state.datasetGraphData)} fill="#8884d8" />
                            </ScatterChart>

                            <p><b>Correlation coefficient: {this.calcCorrelationCoefficient(this.state.povertyGraphData, this.state.datasetGraphData)}</b>
                                <br />
                                <br />
                            (0, 1]: likely implies positive correlation <br />
                            [-1, 0): likely implies negative correlation <br />
                            close to 0: likely implies no correlation <br />
                            </p>

                        </div>
                    }
                </Box>

                <br />
                <br />

                <hr />
            </div >
        );
    }
}

export default Advanced;