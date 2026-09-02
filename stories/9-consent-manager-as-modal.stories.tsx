import React from 'react'
import { Heading, Button } from './components/ui'
import { ConsentManager, openConsentManager } from '../src'
import CookieView from './components/CookieView'
import {
  bannerContent,
  preferencesDialogContent,
  cancelDialogContent,
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

const ConsentManagerExample = (props) => {
  return (
    <div>
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
          <Button onClick={openConsentManager}>Data Collection and Cookie Preferences</Button>
        </div>
      </div>

      <CookieView />
    </div>
  )
}

export default {
  title: 'React Component / Banner as Modal',
}

export const BannerAsModal = () => (
  <ConsentManagerExample bannerAsModal bannerActionsBlock bannerHideCloseButton />
)
BannerAsModal.storyName = 'Banner as Modal'

export const BannerAsModalWithCloseButton = () => <ConsentManagerExample bannerAsModal />
BannerAsModalWithCloseButton.storyName = 'Banner as Modal with close button'

export const BannerAsModalWithCustomButtons = () => (
  <ConsentManagerExample bannerAsModal bannerActionsBlock={bannerActionsBlock} />
)
BannerAsModalWithCustomButtons.storyName = 'Banner as Modal with custom buttons'

export const BannerAsModalWithCustomButtonsAndCloseButton = () => (
  <ConsentManagerExample bannerAsModal />
)
BannerAsModalWithCustomButtonsAndCloseButton.storyName =
  'Banner as Modal with custom buttons and close button'
