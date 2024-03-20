import React from 'react'
import { Pane, Heading, Button, Paragraph } from 'evergreen-ui'
import { ConsentManager, openConsentManager } from '../src'

export const ImplyConsentOnInteraction = () => {
  return (
    <Pane>
      <ConsentManager writeKey={process.env.STORYBOOK_WRITE_KEY!} implyConsentOnInteraction />

      <Pane marginX={100} marginTop={20}>
        <Heading> Your website content </Heading>
        <Paragraph>
          Clicking anywhere on this page will cause the Consent Manager to imply consent.
        </Paragraph>

        <Pane display="flex">
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
    </Pane>
  )
}
