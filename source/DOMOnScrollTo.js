import OnScrollTo from './OnScrollTo'

export default class DOMOnScrollTo {
	constructor(onTrigger, render, options) {
		this._render = render
		this.onScrollTo = new OnScrollTo(() => this.element, onTrigger, this.onStateChange, options)
	}

	retry = () => this.onScrollTo.retry()

	onStateChange = (state) => this.render(state)

	render(state) {
		this.element = this._render(state)
	}

	mount() {
		this.render(this.onScrollTo.getState())
		this.onScrollTo.onMount()
	}

	onUnmount = () => {
		this.onScrollTo.onUnmount()
	}
}