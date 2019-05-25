export default function log(...args) {
	if (typeof window !== 'undefined' && window.OnScrollToDebug) {
		console.log(...['[on-scroll-to]'].concat(args))
	}
}