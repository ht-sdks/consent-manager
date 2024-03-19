import {
  WindowWithHtEvents,
  Destination,
  DefaultDestinationBehavior,
  CategoryPreferences,
  Middleware,
  HtEventsBrowserOptions
} from '../types'

interface AnalyticsParams {
  writeKey: string
  options?: HtEventsBrowserOptions
  destinations: Destination[]
  destinationPreferences: CategoryPreferences | null | undefined
  isConsentRequired: boolean
  shouldReload?: boolean
  devMode?: boolean
  defaultDestinationBehavior?: DefaultDestinationBehavior
  categoryPreferences: CategoryPreferences | null | undefined
}

function getConsentMiddleware(
  destinationPreferences,
  categoryPreferences,
  defaultDestinationBehavior
): Middleware {
  return ({ payload, next }) => {
    payload.obj.context.consent = {
      defaultDestinationBehavior,
      categoryPreferences,
      destinationPreferences
    }
    next(payload)
  }
}

export default function conditionallyLoadAnalytics({
  writeKey,
  options = {},
  destinations,
  destinationPreferences,
  isConsentRequired,
  shouldReload = true,
  devMode = false,
  defaultDestinationBehavior,
  categoryPreferences
}: AnalyticsParams) {
  const wd = window as WindowWithHtEvents
  if (!wd.htevents) return

  const integrations = { All: false, 'Hightouch.io': true }

  console.log(
    `isConsentRequired: ${isConsentRequired}`,
    `categoryPrefs: `,
    categoryPreferences,
    `destinations: `,
    destinations,
    `destinationPrefs: `,
    destinationPreferences
  )

  if (!destinationPreferences) {
    if (isConsentRequired) {
      return
    }

    // Load htevents normally when consent isn't required and there's no preferences
    if (!wd.htevents.initialized) {
      wd.htevents.load(writeKey, options)
    }
    return
  }

  for (const destination of destinations) {
    // Was a preference explicitly set on this destination?
    const explicitPreference = destination.id in destinationPreferences
    if (!explicitPreference && defaultDestinationBehavior === 'enable') {
      integrations[destination.id] = true
      continue
    }

    const isEnabled = Boolean(destinationPreferences[destination.id])
    integrations[destination.id] = isEnabled
  }

  // Reload the page if the trackers have already been initialised so that
  // the user's new preferences can take affect
  if (wd.htevents.initialized) {
    if (shouldReload) {
      window.location.reload()
    }
    return
  }

  if (devMode) return

  // Don't load htevents if nothing has been enabled
  const isAnythingEnabled =
    Object.values(integrations).some(Boolean) ||
    Object.values(categoryPreferences || {}).some(Boolean)

  if (isAnythingEnabled) {
    const middleware = getConsentMiddleware(
      destinationPreferences,
      categoryPreferences,
      defaultDestinationBehavior
    )
    wd.htevents.addSourceMiddleware(middleware)

    wd.htevents.load(writeKey, { ...options, integrations })
  }
}
