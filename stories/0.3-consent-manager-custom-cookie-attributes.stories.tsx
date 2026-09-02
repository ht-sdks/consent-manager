import React from 'react'
import { CookieAttributes } from '../src/types'
import { Heading, Button } from './components/ui'
import { ConsentManager, openConsentManager, loadPreferences, onPreferencesSaved } from '../src'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Preferences } from '../src/types'
import CookieView from './components/CookieView'

const ConsentManagerExample = (props: { cookieAttributes: CookieAttributes }) => {
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
        cookieAttributes={props.cookieAttributes}
      />

      <div style={{ margin: '20px 100px 0' }}>
        <Heading> Your website content </Heading>
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
  title: 'React Component / Custom Cookie Attributes',
}

export const CustomCookieAttributes = () => (
  <ConsentManagerExample cookieAttributes={{ sameSite: 'none', secure: true }} />
)
CustomCookieAttributes.storyName = 'Custom Cookie Attributes'
