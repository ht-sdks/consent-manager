import React from 'react'
import { Pane, Heading, Button } from 'evergreen-ui'
import { ConsentManager, openConsentManager } from '../src'
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

const ConsentManagerExample = (props) => {
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
      </Pane>

      <CookieView />
    </Pane>
  )
}

export default {
  title: 'React Component / With Banner Actions Block',
}

export const DefaultBannerActions = () => <ConsentManagerExample bannerActionsBlock />
DefaultBannerActions.storyName = 'Default Banner Actions'

export const DefaultBannerActionsWithoutCloseButton = () => (
  <ConsentManagerExample bannerActionsBlock bannerHideCloseButton />
)
DefaultBannerActionsWithoutCloseButton.storyName = 'Default Banner Actions without Close Button'

export const CustomBannerActions = () => <ConsentManagerExample />
CustomBannerActions.storyName = 'Custom Banner Actions'

export const CustomBannerActionWithoutCloseButton = () => (
  <ConsentManagerExample bannerHideCloseButton />
)
CustomBannerActionWithoutCloseButton.storyName = 'Custom Banner Action without Close Button'
