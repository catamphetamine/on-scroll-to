export function getScrollY() {
	// `window.scrollY` is not supported by Internet Explorer.
	return window.pageYOffset
}

export function getScreenBounds() {
	const height = window.innerHeight
	return {
		// The first pixel of the viewport.
		top: getScrollY(),
		// The pixel after the last pixel of the viewport.
		bottom: getScrollY() + height,
		height
	}
}