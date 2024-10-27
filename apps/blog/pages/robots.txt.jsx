import React from 'react';

class Robots extends React.Component {
	static async getInitialProps({ res }) {
		res.setHeader('Content-Type', 'text/plain');
		res.write(`User-Agent: *
Allow: /`);
		res.end();
	}
}

export default Robots;
