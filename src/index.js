import React, { useContext, useReducer } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { ApolloProvider } from "react-apollo"
import { ApolloClient } from "apollo-client"
import { WebSocketLink } from "apollo-link-ws"
import { InMemoryCache } from "apollo-cache-inmemory"

import Context from "./context"
import reducer from "./reducer"
import App from "./pages/App"
import Splash from "./pages/Splash"
import ProtectedRoute from "./ProtectedRoute"
import "mapbox-gl/dist/mapbox-gl.css"
import * as serviceWorker from "./serviceWorker"

const wsLink = new WebSocketLink({
	uri:
		process.env.NODE_ENV === "production"
			? "wss://flashkicker-geopins.herokuapp.com/graphql"
			: "ws://localhost:4000/graphql",
	options: {
		reconnect: true,
	},
})

const client = new ApolloClient({
	link: wsLink,
	cache: new InMemoryCache(),
})

const Root = () => {
	const initalState = useContext(Context)
	const [state, dispatch] = useReducer(reducer, initalState)

	return (
		<ApolloProvider client={client}>
			<Context.Provider value={{ state, dispatch }}>
				<Router>
					<Switch>
						<ProtectedRoute exact path="/" component={App} />
						<Route path="/login" component={Splash} />
					</Switch>
				</Router>
			</Context.Provider>
		</ApolloProvider>
	)
}

ReactDOM.render(<Root />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
