// TODO: remove duplicate cookie library from bundle
import cookies, { CookieAttributes } from 'js-cookie'
import topDomain from '@segment/top-domain'
import { WindowWithHtEvents, Preferences, CategoryPreferences } from '../types'
import { EventEmitter } from 'events'

export const DEFAULT_COOKIE_NAME = 'ht-cm-preferences'
const COOKIE_DEFAULT_EXPIRES = 365

type PreferencesCookie = {
  version: number
  destination: CategoryPreferences
  custom: CategoryPreferences
}

export interface PreferencesManager {
  loadPreferences(cookieName?: string): Preferences
  onPreferencesSaved(listener: (prefs: Preferences) => void): void
  savePreferences(prefs: SavePreferences): void
}

// TODO: harden against invalid cookies
// TODO: harden against different versions of cookies
export function loadPreferences(cookieName?: string): Preferences {
  const preferences = cookies.getJSON(cookieName || DEFAULT_COOKIE_NAME) as PreferencesCookie

  if (!preferences) {
    return {}
  }

  return {
    destinationPreferences: preferences.destination,
    customPreferences: preferences.custom
  }
}

type SavePreferences = Preferences & {
  cookieDomain?: string
  cookieName?: string
  cookieExpires?: number
  cookieAttributes?: CookieAttributes
}

const emitter = new EventEmitter()

/**
 * Subscribes to consent preferences changing over time and returns
 * a cleanup function that can be invoked to remove the instantiated listener.
 *
 * @param listener a function to be invoked when ConsentPreferences are saved
 */
export function onPreferencesSaved(listener: (prefs: Preferences) => void) {
  emitter.on('preferencesSaved', listener)
  return () => emitter.off('preferencesSaved', listener)
}

export function savePreferences({
  destinationPreferences,
  customPreferences,
  cookieDomain,
  cookieName,
  cookieExpires,
  cookieAttributes = {}
}: SavePreferences) {
  const wd = window as WindowWithHtEvents
  if (wd.htevents) {
    wd.htevents.identify({
      destinationTrackingPreferences: destinationPreferences,
      // use `categoryTrackingPreferences` here for consistency with `context.consent.categoryPreferences`
      categoryTrackingPreferences: customPreferences
    })

    wd.htevents.track('Consent Updated', {
      destinationTrackingPreferences: destinationPreferences,
      // use `categoryTrackingPreferences` here for consistency with `context.consent.categoryPreferences`
      categoryTrackingPreferences: customPreferences
    })
  }

  const domain = cookieDomain || topDomain(window.location.href)
  const expires = cookieExpires || COOKIE_DEFAULT_EXPIRES
  const value = {
    version: 1,
    destination: destinationPreferences,
    custom: customPreferences
  } as PreferencesCookie

  cookies.set(cookieName || DEFAULT_COOKIE_NAME, value, {
    expires,
    domain,
    ...cookieAttributes
  })

  emitter.emit('preferencesSaved', {
    destinationPreferences,
    customPreferences
  })
}
