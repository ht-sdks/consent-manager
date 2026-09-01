import React from 'react'
import { Pane, Button } from 'evergreen-ui'
import ConsentManager from '../src/consent-manager'
import * as common from './components/common-react'
import { openConsentManager } from '../src'
import CookieView from './components/CookieView'

const initialPreferences = {
  advertising: false,
  marketingAndAnalytics: true,
  functional: true
}

const Custom = () => {
  return (
    <Pane maxWidth={1000} margin={30}>
      <ConsentManager
        writeKey={process.env.STORYBOOK_WRITE_KEY!}
        initialPreferences={initialPreferences}
        shouldRequireConsent={() => true}
        {...common}
      />

      <Button marginRight={20} onClick={openConsentManager}>
        Change Cookie Preferences
      </Button>

      <CookieView />
    </Pane>
  )
}

export default {
  title: 'Advanced Use Cases'
}

export const PartialConsent = () => <Custom />
PartialConsent.storyName = 'Partial consent'
