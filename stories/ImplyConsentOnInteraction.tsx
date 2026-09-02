import React from 'react'
import { Heading, Button, Paragraph } from './components/ui'
import { ConsentManager, openConsentManager } from '../src'

export const ImplyConsentOnInteraction = () => {
  return (
    <div>
      <ConsentManager writeKey={process.env.STORYBOOK_WRITE_KEY!} implyConsentOnInteraction />

      <div style={{ margin: '20px 100px 0' }}>
        <Heading> Your website content </Heading>
        <Paragraph>
          Clicking anywhere on this page will cause the Consent Manager to imply consent.
        </Paragraph>

        <div style={{ display: 'flex' }}>
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
    </div>
  )
}
