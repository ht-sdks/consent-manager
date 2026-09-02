import React from 'react'
import { Heading, Button } from './components/ui'
import { ConsentManager, openConsentManager } from '../src'
import { ImplyConsentOnInteraction } from './ImplyConsentOnInteraction'
import CookieView from './components/CookieView'

const ConsentManagerExample = () => {
  return (
    <div>
      <ConsentManager writeKey={process.env.STORYBOOK_WRITE_KEY!} />

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
  title: 'React Component / Basics',
}

export const BasicReactComponent = () => <ConsentManagerExample />
BasicReactComponent.storyName = 'Basic React Component'

export const BasicReactComponentWithImpliedConsent = () => <ImplyConsentOnInteraction />
BasicReactComponentWithImpliedConsent.storyName = 'Basic React Component with implied consent'
