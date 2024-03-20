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
        options={{ apiHost: 'localhost:7777', protocol: 'http' }}
        closeBehavior={props.closeBehavior}
      />

      <Pane marginX={100} marginTop={20}>
        <Heading> Your website content </Heading>
        <Pane display="flex">
          <div style={{ background: '#3FE398', padding: 16, height: 100, width: '100%' }}>
            <button onClick={() => (window as any).htevents.track('Consent Testing')}>Track</button>
          </div>
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

storiesOf('React Component / OnClose interactions', module)
  .add(`Dismiss`, () => <ConsentManagerExample closeBehavior={'dismiss'} />)
  .add(`Accept`, () => <ConsentManagerExample closeBehavior={'accept'} />)
  .add(`Deny`, () => <ConsentManagerExample closeBehavior={'deny'} />)
  .add(`Custom Close Behavior`, () => (
    <ConsentManagerExample
      closeBehavior={categories => ({
        ...categories,
        advertising: false
      })}
    />
  ))
