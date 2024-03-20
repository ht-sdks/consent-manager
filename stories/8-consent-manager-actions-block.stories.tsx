import React from 'react'
import cookies from 'js-cookie'
import { Pane, Heading, Button } from 'evergreen-ui'
import { ConsentManager, openConsentManager } from '../src'
import { storiesOf } from '@storybook/react'
import CookieView from './components/CookieView'

const bannerActionsBlock = ({ acceptAll, denyAll }) => (
  <div>
    <button type="button" onClick={acceptAll}>
      Allow all
    </button>
    <button type="button" onClick={denyAll}>
      Deny all
    </button>
  </div>
)

const ConsentManagerExample = props => {
  return (
    <Pane>
      <ConsentManager
        writeKey={process.env.STORYBOOK_WRITE_KEY!}
        bannerActionsBlock={props.bannerActionsBlock || bannerActionsBlock}
        bannerHideCloseButton={props.bannerHideCloseButton}
        closeBehavior={'accept'}
      />

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

storiesOf('React Component / With Banner Actions Block', module)
  .add(`Default Banner Actions`, () => <ConsentManagerExample bannerActionsBlock />)
  .add(`Default Banner Actions without Close Button`, () => (
    <ConsentManagerExample bannerActionsBlock bannerHideCloseButton />
  ))
  .add(`Custom Banner Actions`, () => <ConsentManagerExample />)
  .add(`Custom Banner Action without Close Button`, () => (
    <ConsentManagerExample bannerHideCloseButton />
  ))
