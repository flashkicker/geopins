import React, { useContext } from "react"
import { GraphQLClient } from "graphql-request"
import { GoogleLogin } from "react-google-login"
import { withStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"

import Context from "../../context"
import { ME_QUERY } from "../../graphql/queries"
import { BASE_URL } from "../../hooks/client"

const Login = ({ classes }) => {
	const { dispatch } = useContext(Context)

	const onSuccess = async (googleUser) => {
		try {
			const client = new GraphQLClient(BASE_URL, {
				headers: { authorization: googleUser.tokenId },
			})

			const data = await client.request(ME_QUERY)

			dispatch({ type: "LOGIN_USER", payload: data.me })
			dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn() })
		} catch (err) {
			onFailure(err)
		}
	}

	const onFailure = (err) => {
		dispatch({ type: "IS_LOGGED_IN", payload: false })
		console.error("Error logging in", err)
	}

	return (
		<div className={classes.root}>
			<Typography
				component="h1"
				variant="h3"
				gutterBottom
				noWrap
				style={{ color: "rgb(66, 133, 244)" }}
			>
				Welcome
			</Typography>
			<GoogleLogin
				clientId="512766811123-3et0u4gq6q27r7j1ssloo1ogbn2b0eqb.apps.googleusercontent.com"
				cookiePolicy={"single_host_origin"}
				onSuccess={onSuccess}
				isSignedIn={true}
				onFailure={onFailure}
				buttonText="Login with Google"
				theme="dark"
			/>
		</div>
	)
}

const styles = {
	root: {
		height: "100vh",
		display: "flex",
		justifyContent: "center",
		flexDirection: "column",
		alignItems: "center",
	},
}

export default withStyles(styles)(Login)
