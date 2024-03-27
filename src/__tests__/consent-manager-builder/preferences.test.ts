import { URL } from 'url'
import sinon from 'sinon'
import {
  loadPreferences,
  savePreferences,
  DEFAULT_COOKIE_NAME
} from '../../consent-manager-builder/preferences'
import { HtEventsBrowser } from '../../types'

describe('preferences', () => {
  let htevents: sinon.SinonStubbedInstance<Pick<HtEventsBrowser, 'track'>>

  function expectConsentUpdatedEvent({ destinationPreferences, customPreferences }) {
    expect(htevents.track.calledOnce).toBe(true)
    expect(htevents.track.args[0][0]).toBe('Consent Updated')
    expect(htevents.track.args[0][1]).toMatchObject({
      destinationPreferences: destinationPreferences,
      categoryPreferences: customPreferences
    })
    expect(htevents.track.args[0][2]).toMatchObject({
      consent: {
        destinationPreferences: destinationPreferences,
        categoryPreferences: customPreferences
      }
    })
  }

  beforeEach(() => {
    window = {
      location: {
        href: 'http://localhost/'
      }
    } as Window & typeof globalThis

    document = {
      createElement(type: string) {
        if (type === 'a') {
          return new URL('http://localhost/')
        }

        return
      }
    } as Document
    document.cookie = ''

    htevents = sinon.stub({ track() {} })
    ;(window as any).htevents = htevents
  })

  test('loadPreferences() returns preferences when cookie exists', () => {
    document.cookie = `${DEFAULT_COOKIE_NAME}={%22version%22:1%2C%22destination%22:{%22Amplitude%22:true}%2C%22custom%22:{%22functional%22:true}}`

    expect(loadPreferences()).toMatchObject({
      destinationPreferences: {
        Amplitude: true
      },
      customPreferences: {
        functional: true
      }
    })
  })

  test('loadPreferences(cookieName) returns preferences when cookie exists', () => {
    document.cookie =
      'custom-tracking-preferences={%22version%22:1%2C%22destination%22:{%22Amplitude%22:true}%2C%22custom%22:{%22functional%22:true}}'

    expect(loadPreferences('custom-tracking-preferences')).toMatchObject({
      destinationPreferences: {
        Amplitude: true
      },
      customPreferences: {
        functional: true
      }
    })
  })

  test('savePreferences() saves the preferences', () => {
    const destinationPreferences = {
      Amplitude: true
    }

    const customPreferences = {
      functional: true
    }

    savePreferences({
      destinationPreferences,
      customPreferences,
      cookieDomain: undefined
    })

    expectConsentUpdatedEvent({ destinationPreferences, customPreferences })

    expect(document.cookie).toContain(
      `${DEFAULT_COOKIE_NAME}={%22version%22:1%2C%22destination%22:{%22Amplitude%22:true}%2C%22custom%22:{%22functional%22:true}}`
    )
  })

  test('savePreferences() sets the cookie domain', () => {
    const destinationPreferences = {
      Amplitude: true
    }

    const customPreferences = undefined

    savePreferences({
      destinationPreferences,
      customPreferences,
      cookieDomain: 'example.com'
    })

    expectConsentUpdatedEvent({ destinationPreferences, customPreferences })

    // ToDo: verify cookie domain is set (would need to mock js-cookie since document.cookie doesn't have domain info)
  })

  test('savePreferences() sets the cookie with custom key', () => {
    const destinationPreferences = {
      Amplitude: true
    }

    const customPreferences = undefined

    savePreferences({
      destinationPreferences,
      customPreferences,
      cookieDomain: undefined,
      cookieName: 'custom-tracking-preferences'
    })

    expectConsentUpdatedEvent({ destinationPreferences, customPreferences })

    expect(document.cookie).toContain('custom-tracking-preferences')
  })
})
