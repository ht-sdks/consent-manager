import { URL } from 'url'
import sinon from 'sinon'
import {
  loadPreferences,
  savePreferences,
  DEFAULT_COOKIE_NAME
} from '../../consent-manager-builder/preferences'

describe('preferences', () => {
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
    const htevents = { track: sinon.spy() }
    ;(window as any).htevents = htevents
    document.cookie = ''

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

    expect(htevents.track.calledOnce).toBe(true)
    expect(htevents.track.args[0][0]).toBe('Consent Updated')
    expect(htevents.track.args[0][1]).toMatchObject({
      destinationPreferences: destinationPreferences,
      categoryPreferences: customPreferences
    })

    expect(
      document.cookie.includes(
        `${DEFAULT_COOKIE_NAME}={%22version%22:1%2C%22destination%22:{%22Amplitude%22:true}%2C%22custom%22:{%22functional%22:true}}`
      )
    ).toBe(true)
  })

  test('savePreferences() sets the cookie domain', () => {
    const htevents = { track: sinon.spy() }
    ;(window as any).htevents = htevents
    document.cookie = ''

    const destinationPreferences = {
      Amplitude: true
    }

    savePreferences({
      destinationPreferences,
      customPreferences: undefined,
      cookieDomain: 'example.com'
    })

    expect(htevents.track.calledOnce).toBe(true)
    expect(htevents.track.args[0][0]).toBe('Consent Updated')
    expect(htevents.track.args[0][1]).toMatchObject({
      destinationPreferences: destinationPreferences,
      categoryPreferences: undefined
    })

    // TODO: actually check domain
    // expect(document.cookie.includes('domain=example.com')).toBe(true)
  })

  test('savePreferences() sets the cookie with custom key', () => {
    const htevents = { track: sinon.spy() }
    ;(window as any).htevents = htevents
    document.cookie = ''

    const destinationPreferences = {
      Amplitude: true
    }

    savePreferences({
      destinationPreferences,
      customPreferences: undefined,
      cookieDomain: undefined,
      cookieName: 'custom-tracking-preferences'
    })

    expect(htevents.track.calledOnce).toBe(true)
    expect(htevents.track.args[0][0]).toBe('Consent Updated')
    expect(htevents.track.args[0][1]).toMatchObject({
      destinationPreferences: destinationPreferences,
      categoryPreferences: undefined
    })

    expect(document.cookie.includes('custom-tracking-preferences')).toBe(true)
  })
})
