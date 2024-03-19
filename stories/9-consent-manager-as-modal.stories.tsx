import React from 'react'
import cookies from 'js-cookie'
import { Pane, Heading, Button } from 'evergreen-ui'
import { ConsentManager, openConsentManager } from '../src'
import { storiesOf } from '@storybook/react'
import CookieView from './components/CookieView'
import {
  bannerContent,
  preferencesDialogContent,
  cancelDialogContent
} from './components/common-react'

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
        bannerContent={bannerContent}
        bannerActionsBlock={props.bannerActionsBlock}
        bannerHideCloseButton={props.bannerHideCloseButton}
        preferencesDialogContent={preferencesDialogContent}
        cancelDialogContent={cancelDialogContent}
        closeBehavior={'accept'}
        bannerAsModal={props.bannerAsModal}
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

        <p>
          <Button onClick={openConsentManager}>Data Collection and Cookie Preferences</Button>
        </p>

        <p>
          <Heading>to see the banner again:</Heading>
          <Button
            onClick={() => {
              cookies.remove('tracking-preferences')
              window.location.reload()
            }}
          >
            Clear tracking preferences cookie
          </Button>
        </p>
      </Pane>

      <CookieView />
    </Pane>
  )
}

storiesOf('React Component / Banner as Modal', module)
  .add(`Banner as Modal`, () => (
    <ConsentManagerExample bannerAsModal bannerActionsBlock bannerHideCloseButton />
  ))
  .add(`Banner as Modal with close button`, () => <ConsentManagerExample bannerAsModal />)
  .add(`Banner as Modal with custom buttons`, () => (
    <ConsentManagerExample bannerAsModal bannerActionsBlock={bannerActionsBlock} />
  ))

  .add(`Banner as Modal with custom buttons and close button`, () => (
    <ConsentManagerExample bannerAsModal />
  ))
