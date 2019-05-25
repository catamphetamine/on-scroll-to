import React from 'react'
import PropTypes from 'prop-types'

import OnScrollTo from './OnScrollTo'

export default class ReactOnScrollTo extends React.Component {
	constructor(props) {
		super(props)
		const {
			onScrollTo,
			distance
		} = this.props
		this.onScrollTo = new OnScrollTo(
			() => this.element,
			onScrollTo,
			() => this.forceUpdate(),
			{
				distance
			}
		)
	}

	retry = () => this.onScrollTo.retry()

	setDOMNode = (element) => this.element = element

	componentDidMount() {
		this.onScrollTo.onMount()
	}

	componentWillUnmount() {
		this.onScrollTo.onUnmount()
	}

	render() {
		const {
			component: Component,
			// Rest.
			onScrollTo,
			distance,
			...rest
		} = this.props
		const {
			loading,
			hidden,
			error
		} = this.onScrollTo.getState()
		if (hidden) {
			return null
		}
		return (
			<Component
				{...rest}
				setDOMNode={this.setDOMNode}
				loading={loading}
				retry={this.retry}
				error={error}/>
		)
	}
}

ReactOnScrollTo.propTypes = {
	distance: PropTypes.number,
	component: PropTypes.func.isRequired,
	onScrollTo: PropTypes.func.isRequired
}