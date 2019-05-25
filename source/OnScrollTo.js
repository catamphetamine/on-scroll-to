import { getScrollY, getScreenBounds } from './DOM'
import log from './log'

export default class OnScrollTo {
	constructor(getElement, onScrollTo, onStateChange, options) {
		this.getElement = getElement
		this._onScrollTo = onScrollTo
		this.onStateChange = onStateChange
		this.options = { ...options }
		if (this.options.distance === undefined) {
			// The default trigger distance is the screen height.
			this.options.distance = typeof window === 'undefined' ? 0 : window.innerHeight
		}
		this.state = {}
		log('~ Initialize ~')
		log('Distance', this.options.distance)
	}

	onMount() {
		this.isMounted = true
		log('Mounted')
		if (window.IntersectionObserver) {
			const { distance } = this.options
			// Every modern browser except Internet Explorer supports `IntersectionObserver`s.
			// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
			// https://caniuse.com/#search=IntersectionObserver
			this.intersectionObserver = new IntersectionObserver(this.onIntersectViewport, {
				root: null,
				// top, right, bottom, left.
				rootMargin: `${distance}px 0px ${distance}px 0px`,
				threshold: 0
			})
			this.intersectionObserver.observe(this.getElement())
		} else {
			window.addEventListener('scroll', this.onScroll)
			window.addEventListener('resize', this.onResize)
			this.onCheckScrollStatus({ reason: 'mount' })
		}
	}

	onUnmount() {
		// `OnScrollTo` unmounts itself when it becomes hidden.
		// If a parent React component later calls `.onUnmount()` again
		// in `.componentWillUnmount()` then do nothing.
		if (!this.isMounted) {
			return
		}
		this.isMounted = false
		log('Unmount')
		if (this.intersectionObserver) {
			this.intersectionObserver.disconnect()
		} else {
			window.addEventListener('scroll', this.onScroll)
			window.addEventListener('resize', this.onResize)
		}
	}

	onScroll = () => this.onCheckScrollStatus({ reason: 'scroll' })
	onResize = () => this.onCheckScrollStatus({ reason: 'resize' })

	onIntersectViewport = (entries, observer) => {
		const { isIntersecting } = entries[0]
		if (isIntersecting) {
			this.onScrollTo()
		}
	}

	onCheckScrollStatus(reason) {
		if (this.getState().loading) {
			return
		}
		log(`Check scroll status (${reason})`)
		if (this.isVisible()) {
			this.onScrollTo()
		}
	}

	isVisible() {
		const { distance } = this.options
		const { top, bottom } = this.getElementCoordinates()
		const screen = getScreenBounds()
		return bottom >= screen.top - distance &&
			top <= screen.bottom + distance
	}

	getElementCoordinates() {
		const { top, height } = this.getElement().getBoundingClientRect()
		return {
			top,
			bottom: top + height
		}
	}

	getState() {
		return this.state
	}

	setState(newState) {
		log('Set state', newState)
		this.state = {
			...this.state,
			...newState
		}
		log('New state', this.state)
		this.onStateChange(this.state)
	}

	onScrollTo() {
		log('On scroll to')
		this.disable()
		executeFunction(this._onScrollTo, this.onResult, this.onError)
	}

	disable() {
		log('Disable while loading')
		this.setState({
			loading: true
		})
		if (this.intersectionObserver) {
			this.intersectionObserver.disconnect()
		}
	}

	isEnabled() {
		const {
			loading,
			error
		} = this.getState()
		return !loading && !error
	}

	enable() {
		log('Enable')
		this.setState({
			loading: undefined,
			error: undefined
		})
		if (this.intersectionObserver) {
			this.intersectionObserver.observe(this.getElement())
		} else {
			this.onCheckScrollStatus({ reason: 're-enable' })
		}
	}

	retry() {
		if (!this.getState().error) {
			throw new Error('[on-scroll-to] No error')
		}
		log('Retry')
		this.enable()
	}

	hide() {
		log('Hide')
		this.setState({
			hidden: true
		})
		this.onUnmount()
	}

	onResult = (hasMore) => {
		if (hasMore === true) {
			this.enable()
		} else {
			this.hide()
		}
	}

	onError = (error) => {
		console.error(error)
		this.setState({
			error
		})
	}
}

function executeFunction(func, onResult, onError) {
	try {
		const result = func()
		if (result && typeof result.then === 'function') {
			result.then(onResult, onError)
		} else {
			onResult(result)
		}
	} catch (error) {
		onError(error)
	}
}