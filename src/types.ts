import { CloseBehaviorFunction } from './consent-manager/container'
import { PreferencesManager } from './consent-manager-builder/preferences'
import { CookieAttributes } from 'js-cookie'

export type HtEventsBrowserOptions = {
  integrations?: Record<string, boolean>
  apiHost?: string
  protocol?: string
}

export type HtEventsBrowser = {
  initialized: boolean
  load: (writeKey: string, options?: HtEventsBrowserOptions) => void
  track: (event: string, properties: Record<string, any>, options?: any, callback?: any) => void
  addSourceMiddleware: (middleware: Middleware) => void
}

export type Middleware = (input: MiddlewareInput) => void
interface MiddlewareInput {
  payload: {
    obj: Record<string, any>
    [key: string]: any
  }
  integrations?: Record<string, boolean>
  next: (payload: MiddlewareInput['payload']) => void
}

export type WindowWithHtEvents = Window &
  typeof globalThis & {
    htevents?: HtEventsBrowser
  }

export type WindowWithConsentManagerConfig = Window &
  typeof globalThis & {
    consentManagerConfig?: (
      args: StandaloneConsentManagerParams
    ) => ConsentManagerInput | ConsentManagerInput
  }

export type ConsentManagerInput = ConsentManagerProps & {
  container: string
}

export type DefaultDestinationBehavior = 'enable' | 'disable' | 'imply' | 'ask'

export type CloseBehavior = 'accept' | 'deny' | 'dismiss'

interface StandaloneConsentManagerParams {
  React: unknown
  version?: string
  openConsentManager: () => void
  doNotTrack: () => boolean | null
  inEU: () => boolean
  preferences: PreferencesManager
  inRegions: (regions: string[]) => () => boolean
}

export interface Preferences {
  destinationPreferences?: CategoryPreferences
  customPreferences?: CategoryPreferences
}

export interface Destination {
  id: string
  name: string
  creationName: string
  description: string
  website: string
  category: string
}

export interface CategoryPreferences {
  functional?: boolean | null | undefined
  marketingAndAnalytics?: boolean | null | undefined
  advertising?: boolean | null | undefined
  [category: string]: boolean | null | undefined | string
}

export interface CustomCategories {
  [key: string]: CustomCategory
}

interface CustomCategory {
  integrations?: string[]
  purpose: string
}

export interface PreferencesCategories {
  key: string
  name?: string
  description?: string
  example?: string
}

export interface PreferenceDialogTemplate {
  headings?: {
    allowValue?: string
    categoryValue?: string
    purposeValue?: string
    toolsValue?: string
  }
  checkboxes?: {
    noValue?: string
    yesValue?: string
  }
  actionButtons?: {
    saveValue?: string
    cancelValue?: string
  }
  cancelDialogButtons?: {
    cancelValue?: string
    backValue?: string
  }
  categories?: PreferencesCategories[]
}

export interface ConsentManagerProps {
  writeKey: string
  options?: HtEventsBrowserOptions
  shouldRequireConsent?: () => Promise<boolean> | boolean
  implyConsentOnInteraction?: boolean
  cookieDomain?: string
  cookieName?: string
  cookieAttributes?: CookieAttributes
  cookieExpires?: number
  bannerContent?: React.ReactNode
  bannerSubContent?: string
  bannerActionsBlock?: ((props: ActionsBlockProps) => React.ReactElement) | true
  bannerTextColor?: string
  bannerBackgroundColor?: string
  bannerHideCloseButton: boolean
  bannerAsModal?: boolean
  preferencesDialogTitle?: React.ReactNode
  preferencesDialogContent?: React.ReactNode
  onError?: (error: Error | undefined) => void
  cancelDialogTitle?: React.ReactNode
  cancelDialogContent?: React.ReactNode
  closeBehavior?: CloseBehavior | CloseBehaviorFunction
  initialPreferences?: CategoryPreferences
  customCategories?: CustomCategories
  defaultDestinationBehavior?: DefaultDestinationBehavior
  cdnHost?: string
  preferencesDialogTemplate?: PreferenceDialogTemplate
}

export interface ActionsBlockProps {
  acceptAll: () => void
  denyAll: () => void
  changePreferences: () => void
}
