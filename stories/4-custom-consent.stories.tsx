import React from 'react'
import { Button } from './components/ui'
import ConsentManager from '../src/consent-manager'
import * as common from './components/common-react'
import { openConsentManager } from '../src'
import CookieView from './components/CookieView'

const initialPreferences = {
  advertising: false,
  marketingAndAnalytics: true,
  functional: true,
}

const Custom = () => {
  return (
    <div style={{ maxWidth: 1000, margin: 30 }}>
      <ConsentManager
        writeKey={process.env.STORYBOOK_WRITE_KEY!}
        initialPreferences={initialPreferences}
        shouldRequireConsent={() => true}
        {...common}
      />

      <Button style={{ marginRight: 20 }} onClick={openConsentManager}>
        Change Cookie Preferences
      </Button>

      <CookieView />
    </div>
  )
}

export default {
  title: 'Advanced Use Cases',
}

export const PartialConsent = () => <Custom />
PartialConsent.storyName = 'Partial consent'
