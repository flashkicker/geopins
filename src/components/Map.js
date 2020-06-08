import React, { useState, useEffect, useContext } from "react"
import ReactMapGL, { NavigationControl, Marker, Popup } from "react-map-gl"
import { Subscription } from "react-apollo"
import differenceInMinutes from "date-fns/difference_in_minutes"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery"
import Blog from "./Blog"
import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import DeleteIcon from "@material-ui/icons/DeleteTwoTone"
import { Box } from "grommet"
import { LocationPin } from "grommet-icons"
import Context from "../context"
import { useClient } from "../hooks/client"
import { GET_PINS_QUERY } from "../graphql/queries"
import { DELETE_PIN_MUTATION } from "../graphql/mutations"
import {
	PIN_ADDED_SUBSCRIPTION,
	PIN_DELETED_SUBSCRIPTION,
	PIN_UPDATED_SUBSCRIPTION,
} from "../graphql/subscriptions"

const INITIAL_VIEWPORT = {
	latitude: 44.5630939,
	longitude: -123.26601620000001,
	zoom: 13,
}

const Map = ({ classes }) => {
	const { state, dispatch } = useContext(Context)
	const mobileSize = useMediaQuery("(max-width: 650px)")
	const client = useClient()
	const [viewport, setViewport] = useState(INITIAL_VIEWPORT)
	const [userPosition, setUserPosition] = useState(null)

	useEffect(() => {
		getUserPosition()
	}, [])

	const [popup, setPopup] = useState(null)

	useEffect(() => {
		const pinExists =
			popup && state.pins.findIndex((pin) => pin._id === popup._id) > -1

		if (!pinExists) setPopup(null)
	}, [state.pins.length])

	const getUserPosition = () => {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords
					setViewport({ ...viewport, latitude, longitude })
					setUserPosition({ latitude, longitude })
				},
				(e) => console.error(e),
				{ maximumAge: 10000, timeout: 5000, enableHighAccuracy: true }
			)
		}
	}

	const handleMapClick = ({ lngLat, leftButton, target }) => {
		if (!leftButton || target.childNodes.length < 1) return

		if (!state.draft) {
			dispatch({ type: "CREATE_DRAFT" })
		}

		const [longitude, latitude] = lngLat

		dispatch({
			type: "UPDATE_DRAFT_LOCATION",
			payload: { longitude, latitude },
		})
	}

	useEffect(() => {
		getPins()
	}, [])

	const getPins = async () => {
		const { getPins } = await client.request(GET_PINS_QUERY)
		dispatch({ type: "GET_PINS", payload: getPins })
	}

	const highlightNewPin = (pin) => {
		const isNewPin =
			differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30
		return isNewPin ? "limegreen" : "darkblue"
	}

	const handleSelectPin = (pin) => {
		setPopup(pin)
		dispatch({ type: "SET_PIN", payload: pin })
	}

	const isAuthUser = () => state.currentUser._id === popup.author._id

	const handleDeletePin = async (pin) => {
		const variables = { pinId: pin._id }
		await client.request(DELETE_PIN_MUTATION, variables)

		setPopup(null)
	}

	return (
		<Box
			direction={mobileSize ? "column-reverse" : "row"}
			flex
			overflow={{ horizontal: "hidden" }}
		>
			<ReactMapGL
				{...viewport}
				height="100%"
				width="100%"
				onViewportChange={(newViewport) => setViewport(newViewport)}
				mapStyle="mapbox://styles/mapbox/streets-v11"
				mapboxApiAccessToken="pk.eyJ1IjoiZmxhc2hraWNrZXIiLCJhIjoiY2thb3JqdG5zMHk0MTJ6cm1tcWxsbGwyYSJ9.xTvGCZ8NjaCKWxxUYg2l2g"
				onClick={handleMapClick}
				scrollZoom={!mobileSize}
			>
				<div className={classes.navigationControl}>
					<NavigationControl
						onViewportChange={(newViewport) => setViewport(newViewport)}
					/>
				</div>
				{userPosition && (
					<Marker
						latitude={userPosition.latitude}
						longitude={userPosition.longitude}
						offsetLeft={-19}
						offsetTop={-37}
					>
						<LocationPin size="large" color="brand" />
					</Marker>
				)}
				{state.draft && (
					<Marker
						latitude={state.draft.latitude}
						longitude={state.draft.longitude}
						offsetLeft={-19}
						offsetTop={-37}
					>
						<LocationPin size="large" color="hotpink" />
					</Marker>
				)}
				{state.pins.map((pin) => {
					return (
						<Marker
							key={pin._id}
							latitude={pin.latitude}
							longitude={pin.longitude}
							offsetLeft={-19}
							offsetTop={-37}
						>
							<LocationPin
								onClick={() => handleSelectPin(pin)}
								size="large"
								color={highlightNewPin(pin)}
							/>
						</Marker>
					)
				})}
				{popup && (
					<Popup
						anchor="top"
						latitude={popup.latitude}
						longitude={popup.longitude}
						closeOnClick={false}
						onClose={() => setPopup(null)}
					>
						<img
							className={classes.popupImage}
							src={popup.image}
							alt={popup.title}
						/>
						<div className={classes.popupTab}>
							<Typography>
								{popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
							</Typography>
							{isAuthUser() && (
								<Button onClick={() => handleDeletePin(popup)}>
									<DeleteIcon className={classes.deleteIcon} />
								</Button>
							)}
						</div>
					</Popup>
				)}
			</ReactMapGL>
			<Subscription
				subscription={PIN_ADDED_SUBSCRIPTION}
				onSubscriptionData={({ subscriptionData }) => {
					const { pinAdded } = subscriptionData.data

					dispatch({ type: "CREATE_PIN", payload: pinAdded })
				}}
			/>
			<Subscription
				subscription={PIN_DELETED_SUBSCRIPTION}
				onSubscriptionData={({ subscriptionData }) => {
					const { pinDeleted } = subscriptionData.data

					dispatch({ type: "DELETE_PIN", payload: pinDeleted })
				}}
			/>
			<Subscription
				subscription={PIN_UPDATED_SUBSCRIPTION}
				onSubscriptionData={({ subscriptionData }) => {
					const { pinUpdated } = subscriptionData.data

					dispatch({ type: "CREATE_COMMENT", payload: pinUpdated })
				}}
			/>
			<Blog />
		</Box>
	)
}

const styles = {
	root: {
		display: "flex",
	},
	rootMobile: {
		display: "flex",
		flexDirection: "column-reverse",
	},
	navigationControl: {
		position: "absolute",
		top: 0,
		left: 0,
		margin: "1em",
	},
	deleteIcon: {
		color: "red",
	},
	popupImage: {
		padding: "0.4em",
		height: 200,
		width: 200,
		objectFit: "cover",
	},
	popupTab: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
	},
}

export default withStyles(styles)(Map)
