import React, { PureComponent } from 'react'
import ConsentManagerBuilder from '../consent-manager-builder'
import Container from './container'
import { ADVERTISING_CATEGORIES, FUNCTIONAL_CATEGORIES } from './categories'
import {
  CategoryPreferences,
  Destination,
  ConsentManagerProps,
  PreferenceDialogTemplate
} from '../types'

const zeroValuePreferences: CategoryPreferences = {
  marketingAndAnalytics: null,
  advertising: null,
  functional: null
}

const defaultPreferencesDialogTemplate: PreferenceDialogTemplate = {
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
export default class ConsentManager extends PureComponent<ConsentManagerProps, {}> {
  static displayName = 'ConsentManager'

  static defaultProps = {
    options: undefined,
    shouldRequireConsent: () => true,
    implyConsentOnInteraction: false,
    onError: undefined,
    cookieDomain: undefined,
    cookieName: undefined,
    cookieExpires: undefined,
    cookieAttributes: {},
    customCategories: undefined,
    bannerActionsBlock: undefined,
    bannerHideCloseButton: false,
    bannerTextColor: '#fff',
    bannerContent:
      'We use cookies (and other similar technologies) to collect data to improve your experience on our site. By using our website, you’re agreeing to the collection of data as described in our Privacy Policy.',
    bannerSubContent: 'You can change your preferences at any time.',
    bannerBackgroundColor: '#1f4160',
    preferencesDialogTitle: 'Website Data Collection Preferences',
    preferencesDialogContent: (
      <div>
        <p>
          We use data collected by cookies and JavaScript libraries to improve your browsing
          experience, analyze site traffic, deliver personalized advertisements, and increase the
          overall performance of our site.
        </p>
        <p>By using our website, you’re agreeing to our Privacy Policy.</p>
        <p>
          The table below outlines how we use this data by category. To opt out of a category of
          data collection, select “No” and save your preferences.
        </p>
      </div>
    ),
    cancelDialogTitle: 'Are you sure you want to cancel?',
    cancelDialogContent:
      'Your preferences have not been saved. By continuing to use our website, you’re agreeing to our Privacy Policy.',
    defaultDestinationBehavior: 'disable',
    preferencesDialogTemplate: defaultPreferencesDialogTemplate
  }

  render() {
    const {
      writeKey,
      options,
      shouldRequireConsent,
      implyConsentOnInteraction,
      cookieDomain,
      cookieName,
      cookieExpires,
      cookieAttributes,
      bannerContent,
      bannerActionsBlock,
      bannerSubContent,
      bannerTextColor,
      bannerBackgroundColor,
      bannerHideCloseButton,
      bannerAsModal,
      preferencesDialogTitle,
      preferencesDialogContent,
      cancelDialogTitle,
      cancelDialogContent,
      customCategories,
      defaultDestinationBehavior,
      cdnHost,
      preferencesDialogTemplate,
      onError
    } = this.props

    return (
      <ConsentManagerBuilder
        onError={onError}
        writeKey={writeKey}
        options={options}
        shouldRequireConsent={shouldRequireConsent}
        cookieDomain={cookieDomain}
        cookieName={cookieName}
        cookieExpires={cookieExpires}
        cookieAttributes={cookieAttributes}
        initialPreferences={this.getInitialPreferences()}
        mapCustomPreferences={this.handleMapCustomPreferences}
        customCategories={customCategories}
        defaultDestinationBehavior={defaultDestinationBehavior}
        cdnHost={cdnHost}
      >
        {({
          destinations,
          customCategories,
          newDestinations,
          preferences,
          isConsentRequired,
          setPreferences,
          resetPreferences,
          saveConsent,
          havePreferencesChanged,
          workspaceAddedNewDestinations
        }) => {
          return (
            <Container
              customCategories={customCategories}
              destinations={destinations}
              newDestinations={newDestinations}
              preferences={preferences}
              isConsentRequired={isConsentRequired}
              setPreferences={setPreferences}
              resetPreferences={resetPreferences}
              saveConsent={saveConsent}
              closeBehavior={this.props.closeBehavior}
              implyConsentOnInteraction={
                implyConsentOnInteraction ?? ConsentManager.defaultProps.implyConsentOnInteraction
              }
              bannerContent={bannerContent}
              bannerSubContent={bannerSubContent}
              bannerActionsBlock={bannerActionsBlock}
              bannerHideCloseButton={bannerHideCloseButton}
              bannerTextColor={bannerTextColor || ConsentManager.defaultProps.bannerTextColor}
              bannerBackgroundColor={
                bannerBackgroundColor || ConsentManager.defaultProps.bannerBackgroundColor
              }
              bannerAsModal={bannerAsModal}
              preferencesDialogTitle={preferencesDialogTitle}
              preferencesDialogContent={preferencesDialogContent}
              cancelDialogTitle={cancelDialogTitle}
              cancelDialogContent={cancelDialogContent}
              havePreferencesChanged={havePreferencesChanged}
              defaultDestinationBehavior={defaultDestinationBehavior}
              workspaceAddedNewDestinations={workspaceAddedNewDestinations}
              preferencesDialogTemplate={
                preferencesDialogTemplate
                  ? this.mergeTemplates(preferencesDialogTemplate, defaultPreferencesDialogTemplate)
                  : ConsentManager.defaultProps.preferencesDialogTemplate
              }
            />
          )
        }}
      </ConsentManagerBuilder>
    )
  }

  mergeTemplates = (
    newProps: PreferenceDialogTemplate,
    defaultPreferencesDialogTemplate: PreferenceDialogTemplate
  ): PreferenceDialogTemplate => {
    const headingsMerge = {
      ...defaultPreferencesDialogTemplate.headings,
      ...newProps.headings
    }
    const checkboxesMerge = {
      ...defaultPreferencesDialogTemplate.checkboxes,
      ...newProps.checkboxes
    }
    const actionButtonsMerge = {
      ...defaultPreferencesDialogTemplate.actionButtons,
      ...newProps.actionButtons
    }
    const cancelDialogButtonsMerge = {
      ...defaultPreferencesDialogTemplate.cancelDialogButtons,
      ...newProps.cancelDialogButtons
    }
    const categoriesMerge = defaultPreferencesDialogTemplate?.categories!.map(category => ({
      ...category,
      ...newProps?.categories?.find(c => c.key === category.key)
    }))
    return {
      headings: headingsMerge,
      checkboxes: checkboxesMerge,
      actionButtons: actionButtonsMerge,
      cancelDialogButtons: cancelDialogButtonsMerge,
      categories: categoriesMerge
    }
  }

  getInitialPreferences = () => {
    const { initialPreferences, customCategories } = this.props
    if (initialPreferences) {
      return initialPreferences
    }

    if (!customCategories) {
      return zeroValuePreferences
    }

    const initialCustomPreferences = {}
    Object.keys(customCategories).forEach(category => {
      initialCustomPreferences[category] = null
    })

    return initialCustomPreferences
  }

  handleMapCustomPreferences = (destinations: Destination[], preferences: CategoryPreferences) => {
    const { customCategories } = this.props
    const destinationPreferences = {}
    const customPreferences = {}

    if (customCategories) {
      for (const preferenceName of Object.keys(customCategories)) {
        const value = preferences[preferenceName]
        if (typeof value === 'boolean' || typeof value === 'string') {
          customPreferences[preferenceName] = value
        } else {
          customPreferences[preferenceName] = true
        }
      }

      destinations.forEach(destination => {
        // Mark custom categories
        Object.entries(customCategories).forEach(([categoryName, { integrations }]) => {
          const consentAlreadySetToFalse = destinationPreferences[destination.id] === false
          const shouldSetConsent = integrations?.includes(destination.id) ?? false
          if (shouldSetConsent && !consentAlreadySetToFalse) {
            destinationPreferences[destination.id] = customPreferences[categoryName]
          }
        })
      })

      return { destinationPreferences, customPreferences }
    }

    // Default unset preferences to true (for implicit consent)
    for (const preferenceName of Object.keys(preferences)) {
      const value = preferences[preferenceName]
      if (typeof value === 'boolean') {
        customPreferences[preferenceName] = value
      } else {
        customPreferences[preferenceName] = true
      }
    }

    const customPrefs = customPreferences as CategoryPreferences

    for (const destination of destinations) {
      // Mark advertising destinations
      if (
        ADVERTISING_CATEGORIES.find(c => c === destination.category) &&
        destinationPreferences[destination.id] !== false
      ) {
        destinationPreferences[destination.id] = customPrefs.advertising
      }

      // Mark function destinations
      if (
        FUNCTIONAL_CATEGORIES.find(c => c === destination.category) &&
        destinationPreferences[destination.id] !== false
      ) {
        destinationPreferences[destination.id] = customPrefs.functional
      }

      // Fallback to marketing
      if (!(destination.id in destinationPreferences)) {
        destinationPreferences[destination.id] = customPrefs.marketingAndAnalytics
      }
    }

    return { destinationPreferences, customPreferences }
  }
}
