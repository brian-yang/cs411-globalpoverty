import Header from './Header';
import Box from '@material-ui/core/Box';

const Layout = (props) => (
    <div>
        <Header />
        <Box ml={2}>
            {props.children}
        </Box>
    </div>
);

export default Layout;