import React from 'react'
import cookies from 'js-cookie'
import { Pane, Heading, Button } from 'evergreen-ui'
import { ConsentManager, openConsentManager } from '../src'
import { storiesOf } from '@storybook/react'
import { ImplyConsentOnInteraction } from './ImplyConsentOnInteraction'
import CookieView from './components/CookieView'

const ConsentManagerExample = () => {
  return (
    <Pane>
      <ConsentManager writeKey={process.env.STORYBOOK_WRITE_KEY!} />

      <Pane marginX={100} marginTop={20}>
        <Heading> Your website content </Heading>
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
          <Button onClick={openConsentManager}>Data Collection and Cookie Preferences</Button>
        </div>

        <div>
          <Heading>to see the banner again:</Heading>
          <Button
            onClick={() => {
              cookies.remove('tracking-preferences')
              window.location.reload()
            }}
          >
            Clear tracking preferences cookie
          </Button>
        </div>
      </Pane>

      <CookieView />
    </Pane>
  )
}

storiesOf('React Component / Basics', module)
  .add(`Basic React Component`, () => <ConsentManagerExample />)
  .add(`Basic React Component with implied consent`, () => <ImplyConsentOnInteraction />)
