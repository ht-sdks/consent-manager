import React from 'react'
import { Pane, Heading, Paragraph, Button } from 'evergreen-ui'
import { ConsentManager, openConsentManager, loadPreferences, onPreferencesSaved } from '../src'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Preferences, DefaultDestinationBehavior } from '../src/types'
import CookieView from './components/CookieView'

const ConsentManagerExample = (props: {
  defaultDestinationBehavior: DefaultDestinationBehavior
}) => {
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
    <Pane>
      <ConsentManager
        writeKey={process.env.STORYBOOK_WRITE_KEY!}
        closeBehavior={'accept'}
        defaultDestinationBehavior={props.defaultDestinationBehavior}
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

        <Paragraph marginTop={20}>
          This example highlights default destination behavior. The cookie set is missing a
          destination that is enabled on the source, imitating a newly added destination. In the
          console, verify behavior by looking at htevents.options.
        </Paragraph>

        <div>
          <div>
            <Heading>Current Preferences</Heading>
            <SyntaxHighlighter language="json" style={docco}>
              {JSON.stringify(prefs, null, 2)}
            </SyntaxHighlighter>
          </div>
          <Button marginRight={20} onClick={openConsentManager}>
            Change Cookie Preferences
          </Button>
        </div>
      </Pane>
      <CookieView />
    </Pane>
  )
}

export default {
  title: 'Default Destination Behavior',
}

export const Disable = () => <ConsentManagerExample defaultDestinationBehavior="disable" />
Disable.storyName = 'disable'

export const Enable = () => <ConsentManagerExample defaultDestinationBehavior="enable" />
Enable.storyName = 'enable'

export const Imply = () => <ConsentManagerExample defaultDestinationBehavior="imply" />
Imply.storyName = 'imply'

export const Ask = () => <ConsentManagerExample defaultDestinationBehavior="ask" />
Ask.storyName = 'ask'
