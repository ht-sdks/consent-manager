import sinon from 'sinon'
import { WindowWithHtEvents, Destination, Middleware } from '../../types'
import conditionallyLoadAnalytics from '../../consent-manager-builder/analytics'

describe('analytics', () => {
  let wd

  beforeEach(() => {
    window = {} as WindowWithHtEvents
    wd = window
    wd.htevents = {
      /*eslint-disable */
      track: (_event, _properties, _optionsWithConsent, _callback) => {},
      addSourceMiddleware: (_middleware: Middleware) => {}
      /*eslint-enable */
    }
  })

  test('loads events.js with preferences', () => {
    const hteventsLoad = sinon.spy()
    wd.htevents.load = hteventsLoad
    const writeKey = '123'
    const destinations = [{ id: 'Amplitude' } as Destination]
    const destinationPreferences = {
      Amplitude: true
    }

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: true,
      categoryPreferences: {}
    })

    expect(hteventsLoad.calledOnce).toBe(true)
    expect(hteventsLoad.args[0][0]).toBe(writeKey)
    expect(hteventsLoad.args[0][1]).toMatchObject({
      integrations: {
        All: false,
        Amplitude: true,
        'Hightouch.io': true
      }
    })
  })

  test('doesn՚t load events.js when there are no preferences', () => {
    const hteventsLoad = sinon.spy()
    wd.htevents.load = hteventsLoad
    const writeKey = '123'
    const destinations = [{ id: 'Amplitude' } as Destination]
    const destinationPreferences = null

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: true,
      categoryPreferences: {}
    })

    expect(hteventsLoad.notCalled).toBe(true)
  })

  test('doesn՚t load events.js when all preferences are false', () => {
    const hteventsLoad = sinon.spy()
    wd.htevents.load = hteventsLoad
    const writeKey = '123'
    const destinations = [{ id: 'Amplitude' } as Destination]
    const destinationPreferences = {
      Amplitude: false
    }

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: true,
      categoryPreferences: {}
    })

    expect(hteventsLoad.notCalled).toBe(true)
  })

  test('reloads the page when events.js has already been initialised', () => {
    wd.htevents.load = function load() {
      this.initialized = true
    }

    jest.spyOn(window.location, 'reload')

    const writeKey = '123'
    const destinations = [{ id: 'Amplitude' } as Destination]
    const destinationPreferences = {
      Amplitude: true
    }

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: true,
      categoryPreferences: {}
    })
    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: true,
      categoryPreferences: {}
    })

    expect(window.location.reload).toHaveBeenCalled()
  })

  test('should allow the reload behvaiour to be disabled', () => {
    const reload = sinon.spy()
    wd.htevents.load = function load() {
      this.initialized = true
    }
    wd.location = { reload }
    const writeKey = '123'
    const destinations = [{ id: 'Amplitude' } as Destination]
    const destinationPreferences = {
      Amplitude: true
    }

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: true,
      categoryPreferences: {}
    })
    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: true,
      shouldReload: false,
      categoryPreferences: {}
    })

    expect(reload.calledOnce).toBe(false)
  })

  test('loads events.js normally when consent isn՚t required', () => {
    const hteventsLoad = sinon.spy()
    wd.htevents.load = hteventsLoad
    const writeKey = '123'
    const destinations = [{ id: 'Amplitude' } as Destination]
    const destinationPreferences = null

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: false,
      categoryPreferences: {}
    })

    expect(hteventsLoad.calledOnce).toBe(true)
    expect(hteventsLoad.args[0][0]).toBe(writeKey)
    expect(hteventsLoad.args[0][1]).toBeUndefined()
  })

  test('still applies preferences when consent isn՚t required', () => {
    const hteventsLoad = sinon.spy()
    wd.htevents.load = hteventsLoad
    const writeKey = '123'
    const destinations = [{ id: 'Amplitude' } as Destination]
    const destinationPreferences = {
      Amplitude: true
    }

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: false,
      categoryPreferences: {}
    })

    expect(hteventsLoad.calledOnce).toBe(true)
    expect(hteventsLoad.args[0][0]).toBe(writeKey)
    expect(hteventsLoad.args[0][1]).toMatchObject({
      integrations: {
        All: false,
        Amplitude: true,
        'Hightouch.io': true
      }
    })
  })

  test('sets new destinations to false if defaultDestinationBehavior is set to "disable"', () => {
    const hteventsLoad = sinon.spy()
    wd.htevents.load = hteventsLoad
    const writeKey = '123'
    const destinations = [
      { id: 'Amplitude' } as Destination,
      { id: 'Google Analytics' } as Destination
    ]
    const destinationPreferences = {
      Amplitude: true
    }

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: false,
      shouldReload: true,
      defaultDestinationBehavior: 'disable',
      categoryPreferences: {}
    })

    expect(hteventsLoad.args[0][1]).toMatchObject({
      integrations: {
        All: false,
        Amplitude: true,
        'Google Analytics': false,
        'Hightouch.io': true
      }
    })
  })

  test('sets new destinations to true if defaultDestinationBehavior is set to "enable"', () => {
    const hteventsLoad = sinon.spy()
    wd.htevents.load = hteventsLoad
    const writeKey = '123'
    const destinations = [
      { id: 'Amplitude' } as Destination,
      { id: 'Google Analytics' } as Destination
    ]
    const destinationPreferences = {
      Amplitude: true
    }

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: false,
      shouldReload: true,
      defaultDestinationBehavior: 'enable',
      categoryPreferences: {}
    })

    expect(hteventsLoad.args[0][1]).toMatchObject({
      integrations: {
        All: false,
        Amplitude: true,
        'Google Analytics': true,
        'Hightouch.io': true
      }
    })
  })

  test('Set devMode on true to disabled events.js load', () => {
    const hteventsLoad = sinon.spy()
    wd.htevents.load = hteventsLoad
    const writeKey = '123'
    const destinations = [{ id: 'Amplitude' } as Destination]
    const destinationPreferences = {
      Amplitude: true
    }

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: false,
      categoryPreferences: {},
      devMode: true
    })

    expect(hteventsLoad.calledOnce).toBe(false)
  })
})
