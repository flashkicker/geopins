import React from "react"
import { Grommet, Box } from "grommet"

import withRoot from "../withRoot"
import Header from "../components/Header"
import Map from "../components/Map"

const App = () => {
	return (
		<Grommet theme={theme} full>
			<Box fill>
				<Header />
				<Map />
			</Box>
		</Grommet>
	)
}

const theme = {
	global: {
		colors: {
			brand: "#7D4CDB",
		},
		font: {
			family: "Roboto",
			size: "15px",
			height: "15px",
		},
		input: {
			weight: 300,
		},
	},
}

export default withRoot(App)
