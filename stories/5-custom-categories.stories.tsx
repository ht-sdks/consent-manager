import React from 'react'
import cookies from 'js-cookie'
import { Pane, Heading, Button } from 'evergreen-ui'
import { ConsentManager, openConsentManager, loadPreferences, onPreferencesSaved } from '../src'
import { storiesOf } from '@storybook/react'
import { CloseBehaviorFunction } from '../src/consent-manager/container'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { CloseBehavior, Preferences } from '../src/types'
import CookieView from './components/CookieView'

const initialPreferences = {
  Essential: 'N/A'
}

const ConsentManagerExample = (props: { closeBehavior: CloseBehavior | CloseBehaviorFunction }) => {
  const [prefs, updatePrefs] = React.useState<Preferences>(loadPreferences())

  const cleanup = onPreferencesSaved(preferences => {
    updatePrefs(preferences)
  })

  React.useEffect(() => {
    return () => {
      cleanup()
    }
  })

  return (
    <Pane>
      <ConsentManager
        writeKey={process.env.STORYBOOK_WRITE_KEY!}
        initialPreferences={initialPreferences}
        closeBehavior={props.closeBehavior}
        customCategories={{
          'Do Not Sell': {
            integrations: ['AdWords'],
            purpose: 'To give the right to opt out of the sale of personal data.'
          },
          Essential: {
            integrations: ['Amplitude'],
            purpose: 'We use browser cookies that are necessary for the site to work as intended.'
          }
        }}
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
      </Pane>
      <CookieView />
    </Pane>
  )
}

storiesOf('Custom Categories - Do Not Sell', module)
  .add(`Dismiss`, () => <ConsentManagerExample closeBehavior={'dismiss'} />)
  .add(`Accept`, () => <ConsentManagerExample closeBehavior={'accept'} />)
  .add(`Deny`, () => <ConsentManagerExample closeBehavior={'deny'} />)
  .add(`Custom Close Behavior`, () => (
    <ConsentManagerExample
      closeBehavior={categories => ({
        ...categories,
        'Do Not Sell': false
      })}
    />
  ))
