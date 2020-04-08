import Link from 'next/link';

const linkStyle = {
    marginRight: 15
};

const Header = () => (
    <div>
        <Link href="/">
            <a style={linkStyle}>Home</a>
        </Link>
        <Link href="/insertDelete">
            <a style={linkStyle}>Change data</a>
        </Link>
        <Link href="/example">
            <a style={linkStyle}>Example</a>
        </Link>
    </div>
);

export default Header;