import React, { useContext } from "react"
import { withStyles } from "@material-ui/core/styles"
import Context from "../context"
import { Box, Nav, Text, Header, Avatar, Menu } from "grommet"
import { MapLocation, Logout, Menu as MenuIcon } from "grommet-icons"

const Navbar = (props) => {
	const {
		state: { currentUser },
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
							label: <Box alignSelf="center">Logout</Box>,
							onClick: () => {},
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

// const Header = ({ classes }) => {
// 	const {
// 		state: { currentUser },
// 	} = useContext(Context)

// 	return (
// 		<div className={classes.root}>
// 			<AppBar position="static">
// 				<Toolbar>
// 					<div className={classes.grow}>
// 						<MapIcon className={classes.icon} />
// 						<Typography component="h1" variant="h6" color="inherit" noWrap>
// 							GeoPins
// 						</Typography>
// 					</div>
// 					{currentUser && (
// 						<div className={classes.grow}>
// 							<img
// 								className={classes.picture}
// 								src={currentUser.picture}
// 								alt={currentUser.name}
// 							/>
// 							<Typography variant="h5" color="inherit" noWrap>
// 								{currentUser.name}
// 							</Typography>
// 						</div>
// 					)}
//           <Signout />
// 				</Toolbar>
// 			</AppBar>
// 		</div>
// 	)
// }

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
