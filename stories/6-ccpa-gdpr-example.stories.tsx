import React from 'react'
import cookies from 'js-cookie'
import { Pane, Heading, Paragraph, Button } from 'evergreen-ui'
import { ConsentManager, openConsentManager, loadPreferences, onPreferencesSaved } from '../src'
import { storiesOf } from '@storybook/react'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Preferences } from '../src/types'
import CookieView from './components/CookieView'
import inRegions from '@segment/in-regions'
import {
  bannerContent,
  preferencesDialogContent,
  cancelDialogContent
} from './components/common-react'

const ConsentManagerExample = () => {
  const [prefs, updatePrefs] = React.useState<Preferences>(loadPreferences())

  const cleanup = onPreferencesSaved(preferences => {
    updatePrefs(preferences)
  })

  React.useEffect(() => {
    return () => {
      cleanup()
    }
  })

  const inCA = inRegions(['CA'])
  const inEU = inRegions(['EU'])
  const shouldRequireConsent = inRegions(['CA', 'EU'])
  const caDefaultPreferences = {
    advertising: false,
    marketingAndAnalytics: true,
    functional: true
  }
  const euDefaultPreferences = {
    advertising: false,
    marketingAndAnalytics: false,
    functional: false
  }

  const closeBehavior = inCA() ? _categories => caDefaultPreferences : inEU() ? 'deny' : 'accept'

  const initialPreferences = inCA()
    ? caDefaultPreferences
    : inEU()
    ? euDefaultPreferences
    : undefined

  return (
    <Pane>
      <ConsentManager
        writeKey={process.env.STORYBOOK_WRITE_KEY!}
        bannerContent={bannerContent}
        preferencesDialogContent={preferencesDialogContent}
        cancelDialogContent={cancelDialogContent}
        closeBehavior={closeBehavior}
        shouldRequireConsent={shouldRequireConsent}
        initialPreferences={initialPreferences}
      />

      <Pane marginX={100} marginTop={20}>
        <Heading> Cute Cats </Heading>
        <Pane display="flex">
          <iframe
            src="https://giphy.com/embed/JIX9t2j0ZTN9S"
            width="480"
            height="480"
            frameBorder="0"
          />

          <iframe
            src="https://giphy.com/embed/yFQ0ywscgobJK"
            width="398"
            height="480"
            frameBorder="0"
          />
        </Pane>
        <Button onClick={() => (window as any).htevents.track('Send Track Event Clicked')}>
          Send Track Event
        </Button>

        <Paragraph marginTop={20}>
          This example highlights checking for EU or CA residency, then changing the closeBehavior
          based on membership in each.
        </Paragraph>
        <p>
          <div>
            <Heading>Current Preferences</Heading>
            <SyntaxHighlighter language="json" style={docco}>
              {JSON.stringify(prefs, null, 2)}
            </SyntaxHighlighter>
          </div>
          <Button marginRight={20} onClick={openConsentManager}>
            Change Cookie Preferences
          </Button>
          <Button
            onClick={() => {
              cookies.remove('tracking-preferences')
              window.location.reload()
            }}
          >
            Clear
          </Button>
        </p>
      </Pane>
      <CookieView />
    </Pane>
  )
}

storiesOf('CCPA + GDPR Example', module).add(`Basic`, () => <ConsentManagerExample />)
