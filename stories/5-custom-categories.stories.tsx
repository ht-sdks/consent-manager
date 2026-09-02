import React from 'react'
import { Heading, Button } from './components/ui'
import { ConsentManager, openConsentManager, loadPreferences, onPreferencesSaved } from '../src'
import { CloseBehaviorFunction } from '../src/consent-manager/container'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { CloseBehavior, Preferences } from '../src/types'
import CookieView from './components/CookieView'

const initialPreferences = {
  Essential: 'N/A',
}

const ConsentManagerExample = (props: { closeBehavior: CloseBehavior | CloseBehaviorFunction }) => {
  const [prefs, updatePrefs] = React.useState<Preferences>(loadPreferences())

  const cleanup = onPreferencesSaved((preferences) => {
    updatePrefs(preferences)
  })

  React.useEffect(() => {
    return () => {
      cleanup()
    }
  })

  return (
    <div>
      <ConsentManager
        writeKey={process.env.STORYBOOK_WRITE_KEY!}
        initialPreferences={initialPreferences}
        closeBehavior={props.closeBehavior}
        customCategories={{
          'Do Not Sell': {
            integrations: ['AdWords'],
            purpose: 'To give the right to opt out of the sale of personal data.',
          },
          Essential: {
            integrations: ['Amplitude'],
            purpose: 'We use browser cookies that are necessary for the site to work as intended.',
          },
        }}
      />

      <div style={{ margin: '20px 100px 0' }}>
        <Heading> Cute Cats </Heading>
        <div style={{ display: 'flex' }}>
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
        </div>

        <div>
          <Heading>Current Preferences</Heading>
          <SyntaxHighlighter language="json" style={docco}>
            {JSON.stringify(prefs, null, 2)}
          </SyntaxHighlighter>
        </div>
        <Button style={{ marginRight: 20 }} onClick={openConsentManager}>
          Change Cookie Preferences
        </Button>
      </div>

      <CookieView />
    </div>
  )
}

export default {
  title: 'Custom Categories - Do Not Sell',
}

export const Dismiss = () => <ConsentManagerExample closeBehavior={'dismiss'} />

export const Accept = () => <ConsentManagerExample closeBehavior={'accept'} />

export const Deny = () => <ConsentManagerExample closeBehavior={'deny'} />

export const CustomCloseBehavior = () => (
  <ConsentManagerExample
    closeBehavior={(categories) => ({
      ...categories,
      'Do Not Sell': false,
    })}
  />
)
CustomCloseBehavior.storyName = 'Custom Close Behavior'
