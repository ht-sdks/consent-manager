import React from 'react'
import { Heading, Button } from './components/ui'
import { ConsentManager, openConsentManager, loadPreferences, onPreferencesSaved } from '../src'
import { CloseBehaviorFunction } from '../src/consent-manager/container'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { CloseBehavior, Preferences } from '../src/types'
import CookieView from './components/CookieView'

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
        options={{ apiHost: 'localhost:7777', protocol: 'http' }}
        closeBehavior={props.closeBehavior}
      />

      <div style={{ margin: '20px 100px 0' }}>
        <Heading>Your website content</Heading>
        <div style={{ display: 'flex' }}>
          <div style={{ background: '#3FE398', padding: 16, width: '100%' }}>
            <button onClick={() => (window as any).htevents.track('Consent Testing')}>Track</button>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <Heading>Current Preferences</Heading>
          <SyntaxHighlighter language="json" style={docco}>
            {JSON.stringify(prefs, null, 2)}
          </SyntaxHighlighter>
        </div>

        <Button onClick={openConsentManager}>Change Cookie Preferences</Button>
      </div>

      <CookieView />
    </div>
  )
}

export default {
  title: 'React Component / OnClose interactions',
}

export const Dismiss = () => <ConsentManagerExample closeBehavior={'dismiss'} />

export const Accept = () => <ConsentManagerExample closeBehavior={'accept'} />

export const Deny = () => <ConsentManagerExample closeBehavior={'deny'} />

export const CustomCloseBehavior = () => (
  <ConsentManagerExample
    closeBehavior={(categories) => ({
      ...categories,
      advertising: false,
    })}
  />
)
CustomCloseBehavior.storyName = 'Custom Close Behavior'
