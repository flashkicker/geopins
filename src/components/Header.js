import React, { useContext } from "react"
import { withStyles } from "@material-ui/core/styles"
import Context from "../context"
import { Box, Nav, Text, Header, Avatar, Menu } from "grommet"
import { MapLocation, Logout, Menu as MenuIcon } from "grommet-icons"
import Signout from "./Auth/Signout"

const Navbar = (props) => {
	const {
		state: { currentUser },
		dispatch,
	} = useContext(Context)

	return (
		<Header
			background="brand"
			pad={{ left: "medium", right: "small", vertical: "small" }}
		>
			<Box direction="row" align="center">
				<MapLocation />
				<Text weight="bold" size="xlarge" margin={{ left: "small" }}>
					GeoPins
				</Text>
			</Box>
			<Nav direction="row">
				<Menu
					icon={<MenuIcon src={currentUser.picture} size="medium" />}
					focusIndicator={false}
					// margin={{ right: "large" }}
					dropProps={{
						align: { top: "bottom", right: "right" },
						elevation: "xlarge",
					}}
					items={[
						{
							label: (
								<Box alignSelf="center">
									Welcome, {currentUser.name.split(" ")[0]}
								</Box>
							),
							icon: (
								<Box pad="small">
									<Avatar src={currentUser.picture} size="medium" />
								</Box>
							),
						},
						{
							label: (
								<Box alignSelf="center">
									<Signout />
								</Box>
							),
							onClick: () => {
								dispatch({ type: "SIGNOUT_USER" })
							},
							icon: (
								<Box pad="small">
									<Logout size="medium" />
								</Box>
							),
						},
					]}
				/>
			</Nav>
		</Header>
	)
}

const styles = (theme) => ({
	root: {
		flexGrow: 1,
	},
	grow: {
		flexGrow: 1,
		display: "flex",
		alignItems: "center",
	},
	icon: {
		marginRight: theme.spacing.unit,
		color: "green",
		fontSize: 45,
	},
	mobile: {
		display: "none",
	},
	picture: {
		height: "50px",
		borderRadius: "90%",
		marginRight: theme.spacing.unit * 2,
	},
})

export default withStyles(styles)(Navbar)
