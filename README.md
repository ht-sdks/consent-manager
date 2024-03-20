# consent-manager ![CI](https://github.com/ht-sdks/consent-manager/actions/workflows/ci.yml/badge.svg)

> Drop-in consent management plugin for `@ht-sdks/events-sdk-js-browser`.

[StoryBook](https://ht-sdks.github.io/consent-manager/index.html)

- [Hightouch Consent Manager](#hightouch-consent-manager)
- [Features](#features)
- [Usage](#usage)
  - [Standalone Script](#standalone-script)
    - [Options](#options)
    - [Globals](#globals)
    - [Callback Function](#callback-function)
  - [ConsentManager](#consentmanager)
    - [Install](#install)
    - [Example](#example)
    - [Example in Next.js](#example-in-nextjs)
    - [ConsentManager Props](#consentmanager-props)
  - [ConsentManagerBuilder](#consentmanagerbuilder)
    - [Install](#install-1)
    - [Example](#example-1)
    - [ConsentManagerBuilder Props](#consentmanagerbuilder-props)
    - [ConsentManagerBuilder Render Props](#consentmanagerbuilder-render-props)
  - [Utility functions](#utility-functions)
  - [Setting Custom Anonymous ID](#setting-custom-anonymous-id)
- [Development](#development)
- [Publishing New Version](#publishing-new-version)
- [License](#license)

## Hightouch Consent Manager

The Hightouch Consent Manager is an events.js add-on with support to consent management.

At its core, the Consent Manager empowers your visitors to control and customize their tracking preferences on a website. They can opt out entirely of being tracked, or selectively opt out of tools in which they don’t want their information stored.

It works by taking control of the events.js load process to only load destinations that the user has consented to and not loading events.js at all if the user has opted out of everything. The user's tracking preferences are saved to a cookie and sent as an identify trait (if they haven't opted out of everything) so that you can also access them on the server-side and from destinations (warehouse).

_Hightouch works to ensure the Consent Manager Tech Demo works with most of our product pipeline. We cannot ensure it works in your specific implementation or website. Please contact our Professional Services team for implementation support. Please see the LICENSE included._

### Features

- Give users the ability to opt-in or opt-out to tracking.
- Fine grained control of tools or categories used for tracking.
- 30s setup with a drop in script tag.
- Or fully customizable UI/UX through React components.
- EU traffic detection through [@segment/in-eu][ineu].
- Ability for visitors to reconsent and change preferences.
- Automatically updates to reflect the destinations you have enabled in Hightouch.
- Consent Manager will add consent metadata to the context of all track calls:

Track call message payloads will be extended to include Consent metadata in the `context` object:

```js
{
  "context": {
    "campaign": {},
    "consent": {
      "defaultDestinationBehavior": "disable",
      "categoryPreferences": {
        "marketingAndAnalytics": false,
        "advertising": true,
        "functional": false
      },
      "destinationPreferences": {}
    }
  },
  "event": "Send Track Event Clicked",
  "integrations": {
    "All": false,
    "Hightouch.io": true,
  }
}
```

## Usage

The Hightouch Consent Manager can be used in several ways, depending on how custom you want your visitor's experience to be.

To get started, make sure you're using the latest version of the [Hightouch Events Browser SDK snippet](https://github.com/ht-sdks/events-sdk-js-mono/tree/master/packages/browser#installation-via-cdn) and remove the `e.load("YOUR_WRITE_KEY");` call (so the consent manager can manage the loading process). Then continue onto one of the implementation methods below.

### Standalone Script

The standalone script is a prebuilt bundle that uses the [ConsentManager][] React component with [Preact][] (a lightweight React alternative). It's best for if you want to get up and running quickly or you don't have a preexisting React setup.

Include the consent manager script tag after the Browser SDK snippet and add your own custom copy. The standalone script can be configured in one of two ways, via data attributes for simple usage or via a global callback function for advanced usage. Both methods allow the consent manager script to be loaded async.

#### Options

All of the [ConsentManager][] options are supported with the addition of these options:

##### container

**Type**: `string`

[CSS selector][] to the DOM element that will host the consent banner. It should be an empty DOM element (usually a `<div>`) because the consent manager will replace any existing DOM elements inside it. The element must also exist on the page before the script is executed.

You can also control the positioning of the consent banner by applying styles to the container element (optional). E.g:

```css
#target-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
}
```

```html
<div id="target-container"></div>
```

#### Globals

The following global variables are also exposed:

- `consentManager.version` - Version of the consent manager.
- `consentManager.openConsentManager()` - Opens the consent manager preferences dialog.
- `consentManager.doNotTrack()` - Utility function that returns the user's Do Not Track preference (normalises the cross browser API differences). Returns `true`, `false` or `null` (no preference specified).
- `consentManager.inEU()` - The [@segment/in-eu][ineu] `inEU()` function.
- `consentManager.preferences` - Returns an instance of `PreferencesManager` with the following helper functions:
  - `loadPreferences` - returns the cookie value for consent preferences
  - `savePreferences` - allows for managing the consent cookie programatically (useful if you want to re-hydrate consent from your own database or prefill consent options)
  - `onPreferencesSaved(callback)` - allows for subscribing to changes in preferences.

#### Callback Function

All the options are supported. The callback function also receives these exports:

- `React` - Reference to the [Preact][] library (the API is React compatible). Useful for if you need to use virtual DOM in your content.
- `version` - Version of the consent manager.
- `openConsentManager()` - Opens the consent manager preferences dialog.
- `doNotTrack()` - Utility function that returns the user's Do Not Track preference (normalises the cross browser API differences). Returns `true`, `false` or `null` (no preference specified).
- `inEU()` - The [@segment/in-eu][ineu] `inEU()` function.
- `consentManager.preferences` - Returns an instance of `PreferencesManager` with the following helper functions:
  - `loadPreferences` - returns the cookie value for consent preferences
  - `savePreferences` - allows for managing the consent cookie programatically (useful if you want to re-hydrate consent from your own database or prefill consent options)
  - `onPreferencesSaved(callback)` - allows for subscribing to changes in preferences.

```html
<script>
  window.consentManagerConfig = function(exports) {
    var React = exports.React
    var inEU = exports.inEU

    // optional: customize the banner for your brand
    var bannerContent = React.createElement(
      'span',
      null,
      'We use cookies (and other similar technologies) to collect data to improve your experience on our site. By using our website, you՚re agreeing to the collection of data as described in our',
      ' ',
      React.createElement(
        'a',
        { href: '/docs/legal/website-data-collection-policy/', target: '_blank' },
        'Website Data Collection Policy'
      ),
      '.'
    )

    return {
      container: '#target-container',
      writeKey: 'WRITE_KEY',
      shouldRequireConsent: inEU,
      bannerContent: bannerContent
    }
  }
</script>

<script
  src="https://unpkg.com/@ht-sdks/consent-manager@0.0.1/standalone/consent-manager.js"
  defer
></script>
```

### ConsentManager

The `ConsentManager` React component is a prebuilt consent manager UI that uses the [ConsentManagerBuilder][] component under the hood. To use it, just mount the component where you want the consent banner to appear and pass in your own custom copy.

_Note: Consent Manager is React-based so is not currently compatible with other frameworks such as Vue.js or Angular. In case you want to use it in another framework that is not React, you should use the Standalone implementation._

#### Install

Using npm:

```
npm install @ht-sdks/consent-manager
```

Using yarn:

```
yarn add @ht-sdks/consent-manager
```

#### Example

```javascript
import React from 'react'
import { ConsentManager, openConsentManager } from '@ht-sdks/consent-manager'
import inEU from '@segment/in-eu'

export default function() {
  return (
    <div>
      <ConsentManager writeKey="WRITE_KEY" shouldRequireConsent={inEU} />

      <button type="button" onClick={openConsentManager}>
        Website Data Collection Preferences
      </button>
    </div>
  )
}
```

#### Example in Next.js

In Next.js we do not have an html file where to inject the script. Here we will use the Script component to inject the snippet provided by Hightouch.

```javascript
import React from 'react'
import Script from 'next/script'
import { ConsentManager, openConsentManager } from '@ht-sdks/consent-manager'

export default function Home() {
  return (
    <div>
      <Script
        id="show-banner"
        dangerouslySetInnerHTML={{
          __html: `
            !function () {
              var e = window.htevents = window.htevents || []; if (!e.initialize) if (e.invoked) window.console && console.error && console.error("Hightouch snippet included twice."); else {
                e.invoked = !0, e.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", "pageview", "identify", "reset", "group", "track", "ready", "alias", "debug", "page", "once", "off", "on", "addSourceMiddleware", "addIntegrationMiddleware", "setAnonymousId", "addDestinationMiddleware"], e.factory = function (t) { return function () { var n = Array.prototype.slice.call(arguments); return n.unshift(t), e.push(n), e } }; for (var t = 0; t < e.methods.length; t++) { var n = e.methods[t]; e[n] = e.factory(n) } e.load = function (t, n) { var o = document.createElement("script"); o.type = "text/javascript", o.async = !0, o.src = "https://cdn.hightouch-events.com/browser/release/v1-latest/events.min.js"; var r = document.getElementsByTagName("script")[0]; r.parentNode.insertBefore(o, r), e._loadOptions = n, e._writeKey = t }, e.SNIPPET_VERSION = "0.0.1",
                  e.page()
              }
            }();`
        }}
      />

      <main>
        <ConsentManager writeKey="WRITE_KEY" />

        <button type="button" onClick={openConsentManager}>
          Website Data Collection Preferences
        </button>
      </main>
    </div>
  )
}
```

#### ConsentManager Props

This section lists the configurable props you can change when
loading the out of the box Consent Manager. In [this demo](https://codepen.io/samuelkahr/pen/eYYrobB), these are all the props you can pass into the returned preferences object.

<!-- TOC depthFrom:5 depthTo:5 withLinks:1 updateOnSave:1 orderedList:0 -->

- [writeKey](#writekey)
- [shouldRequireConsent](#shouldrequireconsent)
- [initialPreferences](#initialpreferences)
- [closeBehavior](#closebehavior)
- [implyConsentOnInteraction](#implyconsentoninteraction)
- [defaultDestinationBehavior](#defaultdestinationbehavior)
- [cookieDomain](#cookiedomain)
- [bannerContent](#bannercontent)
- [bannerSubContent](#bannersubcontent)
- [bannerTextColor](#bannertextcolor)
- [bannerBackgroundColor](#bannerbackgroundcolor)
- [bannerActionsBlock](#banneractionsblock)
- [bannerHideCloseButton](#bannerhideclosebutton)
- [bannerAsModal](#bannerasmodal)
- [preferencesDialogTitle](#preferencesdialogtitle)
- [preferencesDialogContent](#preferencesdialogcontent)
- [cancelDialogTitle](#canceldialogtitle)
- [cancelDialogContent](#canceldialogcontent)
- [customCategories](#customcategories)
- [preferencesDialogTemplate](#preferencesdialogtemplate)

<!-- /TOC -->

##### writeKey

**Type**: `string`
**Default**: none

The write key events.js should be loaded with.

##### shouldRequireConsent

**Type**: `function`
**Default**: `() => true`

Callback function that determines if consent is required before tracking begins. Set to `true` to show the consent banner, otherwise return `false` to not show consent banner and start tracking immediately.

The function can return a `Promise` that resolves to a boolean.

##### initialPreferences

**Type**: object
**Default**: {}

Object that opts into users into tracking for the different tracking categories. For example `{‘Functional’:true}`

##### closeBehavior

**Type**: `string` or `function`
**Default**: `dismiss`

This option sets the default behavior for the x (close) button on the Consent Manager banner. Available options:

- “dismiss” - dismisses the banner, but doesn't save or change any preferences. Events Browser SDK won’t load until consent is given.
- “accept”- assume consent across every category.
- ”deny” - denies consent across every category.

`closeBehavior` can also be customized - i.e. don't load some categories, but load everything else. For example, if you wanted to load everything _except_ advertising, you could pass the following as `closeBehavior`:

```js
closeBehavior={
  (categories) => ({
    ...categories,
    advertising: false
  })
}
```

##### implyConsentOnInteraction

**Type**: `boolean`
**Default**: `false`

Determines whether or not consent should be implied if the user interacts with the website by clicking anywhere outside the Consent Manager banner.

##### defaultDestinationBehavior

**Type**: `string`
**Default**: `disable`

Determines what the Consent Manager does if the user has already made consent selections and it detects new destination tools. (This is determined by checking if the user already has a cookie set on their browser.)

This is relevant when you've added a connected a new destination to any of the sources managed by Consent Manager.

Options:

- `disable` (default) - When you add new destinations, they are set to “disabled” unless a user updates their consent selections by default.
- `enable` - When you add new destinations, they are set to “enabled” unless a user updates their consent selections.
- `imply` - When you add new destinations, they are enabled or disabled based on the category to which they belong and the user's previous consent to that category.
  For example, if a user already consented to the `marketingAndAnalytics` category, and you add a new destination which is in the `Analytics` category, that destination will be enabled until the user updates their consent selections.
- `ask` - When you add new destinations, the Consent Manager automatically opens the preferences dialog on initialization, and asks the user for their consent again.

##### cookieDomain

**Type**: `string`
**Default**: the top most domain and all sub domains

The domain the `tracking-preferences` cookie should be scoped to.

##### bannerContent

**Type**: `PropTypes.node`

The content of the [consent banner](https://share.getcloudapp.com/Apurj6zv).

##### bannerSubContent

**Type**: `string`

The [call to action](https://share.getcloudapp.com/z8uXxpkZ) under the primary text in the Consent Manager banner.

##### bannerActionsBlock

Type: `function(object) | boolean`

The flag or function to render the actions block. If `true` value is passed - will render the default buttons block with `Accept all` and `Deny all` (required for the GDPR compliance). if the function is passed - will render the passed function into a actions block placeholder.

Function props:

- `acceptAll: () => void` - accept all cookies and close the banner
- `denyAll: () => void` - deny all cookies and close the banner
- `changePreferences: () => void` - open the dialog

##### bannerTextColor

**Type**: `string`
**Default**: `#fff`

The color of the consent banner text.

##### bannerBackgroundColor

Type: `string`<br>
Default: `#1f4160`

The color of the consent banner background.

##### bannerHideCloseButton

Type: `boolean`<br>
Default: `false`

Hide the close button of the consent banner.

##### bannerAsModal

Type: `boolean`<br>
Default: `false`

Show the consent banner as a modal, blocking the interaction while it is not accepted/rejected.

##### preferencesDialogTitle

**Type**: `PropTypes.node`
**Default**: `Website Data Collection Preferences`

The [title of the preferences dialog](https://share.getcloudapp.com/jkuKlrAw).

##### preferencesDialogContent

**Type**: `PropTypes.node`

The top [descriptive content](https://share.getcloudapp.com/z8uXxJAQ) of the preferences dialog.

##### cancelDialogTitle

**Type**: `PropTypes.node`
**Default**: `Are you sure you want to cancel?`

[The title](https://share.getcloudapp.com/v1urD6R6) of the cancel dialog.

##### cancelDialogContent

**Type**: `PropTypes.node`

The text displayed in the cancel dialog box.

##### customCategories

**Type**: `PropTypes.object`
**Default**: `undefined`

An object that represents custom consent categories, and which tools are included in these categories. For example, for CCPA compliance, you could create a custom “Do Not Sell” category and list relevant destinations to it.

_Note: Calling the `customCategories` object will overwrite the prebuilt categories (Analytics, Functional, Targeting and Advertising) provided by Consent Manager. Those categories will need to be redeclared inside `customCategories`. You can find examples [here](https://gist.github.com/samuelkahr/343350ad0a466ded566f0d0c8167e800) and [here](https://codepen.io/samuelkahr/pen/JjdNqzr)._

```javascript
const customCategories = {
  'New Category': {
    purpose: 'A new consent category to capture more granular consent groupings',
    integrations: ['Google Adwords (Classic)', 'Amplitude', 'Slack']
  }
}
```

The values for `integrations` should be an integration's creationName (`integration.creationName`). You can find examples of that by going to `https://cdn.hightouch-events.com/v1/projects/<writeKey>/integrations`

##### preferencesDialogTemplate

**Type**: `PropTypes.object`
**Default**:

```javascript
{
  headings: {
    allowValue: 'Allow',
    categoryValue: 'Category',
    purposeValue: 'Purpose',
    toolsValue: 'Tools'
  },
  checkboxes: {
    noValue: 'No',
    yesValue: 'Yes'
  },
  actionButtons: {
    cancelValue: 'Cancel',
    saveValue: 'Save'
  },
  cancelDialogButtons: {
    cancelValue: 'Yes, Cancel',
    backValue: 'Go Back'
  },
  categories: [
    {
      key: 'functional',
      name: 'Functional',
      description:
        'To monitor the performance of our site and to enhance your browsing experience.',
      example: 'For example, these tools enable you to communicate with us via live chat.'
    },
    {
      key: 'marketing',
      name: 'Marketing and Analytics',
      description:
        'To understand user behavior in order to provide you with a more relevant browsing experience or personalize the content on our site.',
      example:
        'For example, we collect information about which pages you visit to help us present more relevant information.'
    },
    {
      key: 'advertising',
      name: 'Advertising',
      description:
        'To personalize and measure the effectiveness of advertising on our site and other websites.',
      example:
        'For example, we may serve you a personalized ad based on the pages you visit on our site.'
    },
    {
      key: 'essential',
      name: 'Essential',
      description: 'We use browser cookies that are necessary for the site to work as intended.',
      example:
        'For example, we store your website data collection preferences so we can honor them if you return to our site. You can disable these cookies in your browser settings but if you do the site may not work as intended.'
    }
  ]
}
```

An object that represents the text fields of the preferences dialog and allows customizing them.
We recommend copying the default object and changing the fields as necessary.

_Note: All fields are optional. If they are not included in the template (object) the default fields will be used._

_Note 2: For categories, you need to provide the key in order to map all the values properly._

### ConsentManagerBuilder

The `ConsentManagerBuilder` React component is a low level render props component for building your own consent manager UI. It abstracts away all the logic for fetching destinations, checking/saving consent and loading the Events Browser SDK.

_Note: ConsentManagerBuilder is React-based so is not currently compatible with other frameworks such as Vue.js or Angular. In case you want to use it in another framework that is not React, you should use the Standalone implementation._

#### Example

For a more detailed/advanced example, checkout the [ConsentManager implementation][].

```javascript
import React from 'react'
import { ConsentManagerBuilder } from '@ht-sdks/consent-manager'

export default function() {
  return (
    <ConsentManagerBuilder writeKey="<your-hightouch-write-key>">
      {({ destinations, preferences, setPreferences, saveConsent }) => (
        <div>
          <h2>Tracking tools</h2>
          <ul>
            {destinations.map(destination => (
              <li key={destination.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(preferences[destination.id])}
                    onChange={() =>
                      setPreferences({
                        [destination.id]: !preferences[destination.id]
                      })
                    }
                  />
                  {destination.name}
                </label>
              </li>
            ))}
          </ul>

          <button type="button" onClick={() => saveConsent()}>
            Save
          </button>
          <button type="button" onClick={() => saveConsent(true)}>
            Allow all
          </button>
          <button type="button" onClick={() => saveConsent(false)}>
            Deny all
          </button>
        </div>
      )}
    </ConsentManagerBuilder>
  )
}
```

#### ConsentManagerBuilder Props

- [children](#children)
- [writeKey](#writekey-1)
- [shouldRequireConsent](#shouldrequireconsent-1)
- [initialPreferences](#initialpreferences-1)
- [defaultDestinationBehavior](#defaultdestinationbehavior-1)
- [mapCustomPreferences](#mapcustompreferences)
- [cookieDomain](#cookiedomain-1)
- [shouldReload](#shouldReload-1)
- [devMode](#devMode-1)
- [useDefaultCategories](#useDefaultCategories-1)

##### children

**Type**: `function`

The render props function that returns your UI.

##### writeKey

**Type**: `string`

The write key the Events Browser SDK should be loaded with.

##### shouldRequireConsent

**Type**: `function`
**Default**: `() => true`

Callback function that determines if consent is required before tracking can begin. Return `true` to show the consent banner and wait for consent (if no consent has been given yet). Return `false` to not show the consent banner and start tracking immediately (unless the user has opted out). The function can return a `Promise` that resolves to a boolean.

##### initialPreferences

**Type**: `object`
**Default**: `{}`

The initial value of the preferences. By default it should be an object map of `{destinationId: true|false|'N/A'}`. If you're using [mapCustomPreferences][] it should be an object map of your custom preferences' default values.

##### defaultDestinationBehavior

**Type**: `string`
**Default**: `disable`

Determines what the Consent Manager does if the user has already made consent selections and it detects new destination tools. (This is determined by checking if the user already has a cookie set on their browser.)

This is relevant when you've added a connected a new destination to any of the sources managed by Consent Manager.

Options:

- `disable` (default) - When you add new destinations, they are set to “disabled” unless a user updates their consent selections by default.
- `enable` - When you add new destinations, they are set to “enabled” unless a user updates their consent selections.
- `imply` - When you add new destinations, they are enabled or disabled based on the category to which they belong and the user's previous consent to that category.
  For example, if a user already consented to the `marketingAndAnalytics` category, and you add a new destination which is in the `Analytics` category, that destination will be enabled until the user updates their consent selections.
- `ask` - When you add new destinations, the Consent Manager automatically opens the preferences dialog on initialization, and asks the user for their consent again.

##### mapCustomPreferences

**Type**: `function`
**Default**: `undefined`

Callback function allows you to use a custom preferences format (e.g: categories) instead of the default destination based one. The function gets called during the consent saving process and gets passed `(destinations, preferences)`. The function should return `{destinationPreferences, customPreferences}` where `destinationPreferences` is your custom preferences mapped to the destinations format (`{destiantionId: true|false}`) and `customPreferences` is your custom preferences if you changed them in the callback (optional).

##### cookieDomain

**Type**: `string`
**Default**: the [top most domain][top-domain] and all sub domains

The domain the `tracking-preferences` cookie should be scoped to.

##### shouldReload

**Type**: `boolean`
**Default**: `true`

Reload the page if the trackers have already been initialized so that the user's new preferences can take effect.

##### devMode

**Type**: `boolean`
**Default**: `false`

Disable calling `htevents.load` for local testing.

##### useDefaultCategories

**Type**: `boolean`
**Default**: `false`

Use default categories set by Consent Manager instead of destinations.

#### ConsentManagerBuilder Render Props

- [destinations](#destinations)
- [newDestinations](#newdestinations)
- [preferences](#preferences)
- [destinationPreferences](#destinationpreferences)
- [havePreferencesChanged](#havepreferenceschanged)
- [isConsentRequired](#isconsentrequired)
- [workspaceAddedNewDestinations](#workspaceaddednewdestinations)
- [setPreferences](#setpreferences)
- [resetPreferences](#resetpreferences)
- [saveConsent](#saveconsent)
- [onError](#onError)

##### destinations

**Type**: `array<object>`
**Default**: `[]`

Destinations enabled for the provided write keys. Each destination contains these properties:

```
{
  id,
  name,
  description,
  website,
  category
}
```

##### newDestinations

**Type**: `array<object>`
**Default**: `[]`

New destinations that have been enabled since the user last gave consent.

##### preferences

**Type**: `object`
**Default**: `{}`

The current preferences in state. By default if should be in the format of `{destinationId: true|false}`, but if you're using [mapCustomPreferences][] the object map can be in any format you want. _Note: this isn't the saved preferences._

##### destinationPreferences

**Type**: `object`
**Default**: `{}`

The current _destination specific_ preferences, i.e. `{Amplitude: true}`.

##### havePreferencesChanged

**Type**: `boolean`
**Default**: `false`

A boolean value representing whether or not the user has changed their preferences since opening the preferences modal. Will be set to `true` if the user interacts with the preferences modal by selecting "Yes" or "No" on any of the consent categories.

This is used to not reload the page if no preferences have changed, as to not create a disruptive user experience.

##### isConsentRequired

**Type**: `boolean`
**Default**: `true`

The result of [shouldRequireConsent][].

##### workspaceAddedNewDestinations

**Type**: `boolean`
**Default**: `false`

A boolean value representing whether or not there have been new destinations connected to the source(s) managed by Consent Manager, compared to the destinations set on the existing cookie.

##### setPreferences

**Type**: `function(object|boolean)`

Sets a preference to a new value in state. By default it takes an object map in the format of `{destinationId: true|false}`, but if you're using [mapCustomPreferences][] the object map can be in any format you want. It behaves like `setState()` in that you can set one or more preferences at a time and they get merged with what's currently in state. You can also pass a boolean to set all destination preferences to `true` or `false` (you shouldn't do this if you're using [mapCustomPreferences][]).

##### resetPreferences

**Type**: `function`

Resets the [preferences][] state to the value saved in the cookie. Useful for resetting the state when the preferences dialog is closed without saving for example.

##### saveConsent

**Type**: `function(object|boolean)`

Saves the preferences currently in state to a cookie called `tracking-preferences`, triggers an identify call with `destinationTrackingPreferences` and `categoryTrackingPreferences` traits and then reloads events.js using the new preferences. It can also be passed preferences like [setPreferences][] to do a final update before saving.

##### onError

**Type**: `function(object)`

Allows you to manually handle if there is an error when initializing - e.g. if there is an ad blocker that prevented fetching the destinations. This will prevent an uncaught error e.g. `Failed to fetch`.

### Utility functions

- `openConsentManager()` - Opens the [ConsentManager][] preferences dialog.
- `doNotTrack()` - Returns the user's Do Not Track preference (normalises the cross browser API differences). Returns `true`, `false` or `null` (no preference specified).

### Setting Custom Anonymous ID

Hightouch Events Browser SDK generates a universally unique ID (UUID) for the viewer during the library’s initialization phase, and sets this as anonymousId for each new visitor to your site. This happens before the SDK loads any device-mode destinations, and so before these destination-libraries can generate their own user IDs.

Example

```javascript
htjs_anonymous_id=%2239ee7ea5-b6d8-4174-b612-04e1ef3fa952
```

You can override the default-generated anonymousID from the Hightouch snippet.

```javascript
htevents.setAnonymousId('YOUR_CUSTOM_ID')
```

_Note: Keep in mind that setting the anonymousId does not overwrite the anonymous tracking IDs for any destinations you’re using._

_There are other ways to override the anonymousID, you can find more information [here][]._

## Development

To run our storybook locally, simply do:

```
$ npm run dev
```

and the storybook should be opened in your browser. We recommend adding a new story for new features, and testing against existing stories when making bug fixes.

## Styles

The file GUIDESTYLES.md contains the list of all components you can use this id to change de styles on Consent Manager.

## License

consent-manager is released under the MIT license.

Copyright © 2024 Hightouch

[preact]: https://preactjs.com
[currentscript]: https://caniuse.com/#feat=document-currentscript
[ineu]: https://github.com/segmentio/in-eu
[consentmanager]: #consentmanager
[consentmanagerbuilder]: #consentmanagerbuilder
[top-domain]: https://github.com/segmentio/top-domain
[mapcustompreferences]: #mapcustompreferences
[shouldrequireconsent]: #shouldrequireconsent-1
[preferences]: #preferences
[setpreferences]: #setpreferences
[consentmanager implementation]: src/consent-manager
[css selector]: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
