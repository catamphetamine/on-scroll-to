# OnScrollTo

A component that triggers an action when it's scrolled to.

Can be used to render a "Load more items on scroll down" component for "infinite scroll" lists.

## Demo

* [DOM](https://catamphetamine.github.io/on-scroll-to/index-dom.html)
* [React](https://catamphetamine.github.io/on-scroll-to)

## Install

```
npm install on-scroll-to --save
```

If you're not using a bundler then use a [standalone version from a CDN](#cdn).

## Use

The default export is the `OnScrollTo` class. It implements the core logic and can be used for building an `OnScrollTo` component for any UI framework. [`on-scroll-to/dom`](#dom) and [`on-scroll-to/react`](#react) are both built upon it so this `OnScrollTo` utility class is a low-level core and is meant to be used by UI framework library authors and not by the end users — the end users should use high-level components like [`on-scroll-to/dom`](#dom) (for pure JS) and [`on-scroll-to/react`](#react) (for React).

```js
import OnScrollTo from 'on-scroll-to'

new OnScrollTo(
  getElement,
  onScrollTo,
  onStateChange,
  options
)
```

* `getElement()` function should return the DOM Element which will get the `onScrollTo` action triggered when it's scrolled to.
* `onScrollTo()` function is the action that will get triggered when the DOM Element is scrolled to.
* `onStateChange(state)` function gets called whenever `OnScrollTo` instance's state changes.
* `options` is an optional argument.

Available `options`:

* `distance` — Is a `number` in pixels and is screen height by default meaning that `onScrollTo()` function will get called as soon as the user scrolls down to the component's Y position minus screen height. Can be used to perform some action ahead of time before the user scrolls down to the bottom. For example, to load next list items before the user scrolls down to the end of the currently shown list items.

When `OnScrollTo` DOM Element is scrolled to the `OnScrollTo` component is "deactivated" and `onScrollTo()` function is called. The `onScrollTo()` function must return either `true` (or a `Promise` resolving to `true`) to re-enable the `OnScrollTo` component or `false` (or a `Promise` resolving to `false`) if the `OnScrollTo` component is no longer needed on the page in which case it disappears (returns nothing when rendered).

The `onScrollTo()` function could look like this:

```js
let page = 0
let list = []
function onScrollTo() {
  return http.get('/items', { skip: page * 10, limit: 10 })
    .then(({ items, hasMore }) => {
      list = list.concat(items)
      page++
      // If there're more items to load
      // then re-enable the `OnScrollTo` component.
      // Otherwise, don't render the `OnScrollTo` DOM Element.
      return hasMore
    })
}
```

The `OnScrollTo` class instance provides methods:

* `onMount()` — Should be called when the `OnScrollTo` component is "mounted" (rendered) on a page.
* `onUnmount()` — Should be called when the `OnScrollTo` component is "unmounted" (removed) from the page.
* `getState()` — Returns `OnScrollTo` state.
* `retry()` — Can be used for manually re-enabling the `OnScrollTo` component if an `error` happened.

`OnScrollTo` state provides properties:

* `hidden` — Is set to `true` when the `OnScrollTo` component should no longer be rendered.
* `loading` — Is set to `true` when the `OnScrollTo` component is in "disabled" state (`onScrollTo()` returned a `Promise` which hasn't been resolved or rejected yet).
* `error` — Is present if `onScrollTo()` threw an `error` (or returned a `Promise` that rejected with an `error`).

### DOM

This is an example of using `on-scroll-to/dom` component. It's the source code of the [DOM demo](https://catamphetamine.github.io/on-scroll-to/index-dom.html).

```js
import { OnScrollTo } from 'on-scroll-to/dom'

// Renders the "Loading more..." DOM Element.
function render(state) {
  // Create `element`.
  const element = document.createElement('div')
  element.classList.add('load-more')
  // Clear container element.
  const container = document.getElementById('load-more-items')
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }
  // If there was an error then show it.
  if (state.error) {
    element.classList.add('load-more--error')
    element.textContent = 'Error while loading more items'
  }
  // If there're no more items then
  // `element` is removed from `document`.
  else if (state.hidden) {
    return
  }
  // Create `element`.
  else {
    if (state.loading) {
      // May render a spinner animation.
      element.textContent = 'Loading more...'
    } else {
      element.textContent = 'Load more'
    }
  }
  // Insert `element` into `document`.
  container.appendChild(element)
  // `render()` function must return the DOM Element.
  return element
}

const onScrollToComponent = new OnScrollTo(
  onScrollTo,
  render,
  options
)

// Call `.mount()` for the initial render.
// All subsequent renders will be automatic.
onScrollToComponent.mount()

// For "Single Page Apps":
// router.onPageUnload(onScrollToComponent.onUnmount)
```

`OnScrollTo` class constructor receives arguments:

* `onScrollTo()` function is the action that will get triggered when the DOM Element is scrolled to.
* `render(state)` function renders the DOM Element for the `OnScrollTo` component.
* `options` is an optional argument. These are the options for the core `OnScrollTo` class constructor.

`OnScrollTo` instance provides methods:

* `retry()` — Can be used for manually re-enabling the `OnScrollTo` component if an `error` happened.

### React

This is an example of using the React `OnScrollTo` component. It's the source code of the [React demo](https://catamphetamine.github.io/on-scroll-to).

```js
import React from 'react'
import PropTypes from 'prop-types'
import OnScrollTo from 'on-scroll-to/react'

function Example({ onScrollTo }) {
  return (
    <OnScrollTo
      onScrollTo={onScrollTo}
      component={LoadMoreItemsOnScroll}
  )
}

Example.propTypes = {
  onScrollTo: PropTypes.func.isRequired
}

function LoadMoreItemsOnScroll({
  setDOMNode,
  loading,
  error,
  retry
}) {
  // May render a spinner animation.
  return (
    <div ref={setDOMNode} className="load-more">
      {error ? 'Error while loading more items' : (loading ? 'Loading more...' : 'Load more')}
    </div>
  )
}

LoadMoreItemsOnScroll.propTypes = {
  setDOMNode: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.any,
  retry: PropTypes.func.isRequired
}
```

`<OnScrollTo/>` component receives properties:

* `onScrollTo()` — The function that gets called when the component is scrolled to.
* `component` — A React component for the `OnScrollTo` DOM Element.
* `distance` — (optional) Trigger distance.

`component` receives properties:

* `setDOMNode()` — Should be passed as `ref` on the root DOM Element.
* `loading` — (optional) Will be `true` if `OnScrollTo` component is in "disabled" state (`onScrollTo()` returned a `Promise` which hasn't been resolved or rejected yet).
* `error` — (optional) If `onScrollTo()` throws an `error` (or rejects with an `error`) then the `error` property will be passed.
* `retry()` — Can be used for manually re-enabling the `OnScrollTo` component if an `error` happened.

## Debug

Set `window.OnScrollToDebug` to `true` to output debug messages to `console`.

## CDN

One can use any npm CDN service, e.g. [unpkg.com](https://unpkg.com) or [jsdelivr.net](https://jsdelivr.net)

```html
<!-- Core. -->
<script src="https://unpkg.com/on-scroll-to@1.x/bundle/on-scroll-to.js"></script>
<script>
  new OnScrollTo(...)
</script>

<!-- DOM component. -->
<script src="https://unpkg.com/on-scroll-to@1.x/bundle/on-scroll-to-dom.js"></script>
<script>
  new OnScrollTo(...)
</script>

<!-- React component. -->
<script src="https://unpkg.com/on-scroll-to@1.x/bundle/on-scroll-to-react.js"></script>
<script>
  <OnScrollTo .../>
</script>
```

## License

[MIT](LICENSE)