import Layout from '../components/Layout';
import axios from 'axios';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            testData: "",
            loading: true,
        }
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        this.setState({ loading: true }, () => {
            axios.get('/api/test/', {
                params: {}
            })
                .then((response) => {
                    const { data } = response.data;
                    console.log(data);
                    this.setState({
                        testData: data,
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
                    <h1>Global Poverty</h1>
                </Layout>
                {this.state.testData}
            </div>
        );

    }
}

export default App;