import React from 'react'
import { Heading, SubHeading, Code, Button } from './components/ui'
import { ConsentManagerBuilder } from '../src'
import DestinationTile from './components/destination-tile'
import CookieView from './components/CookieView'

function Section({ children }: { children: React.ReactNode }) {
  return <section style={{ marginBottom: 24 }}>{children}</section>
}

const ToolBased = () => {
  return (
    <div style={{ maxWidth: 1000, margin: 30 }}>
      <ConsentManagerBuilder writeKey={process.env.STORYBOOK_WRITE_KEY!}>
        {({ destinations, preferences, setPreferences, saveConsent }) => {
          function handleSubmit(e) {
            e.preventDefault()
            saveConsent()
          }

          return (
            <form onSubmit={handleSubmit}>
              <Section>
                <Heading>ACME Would like to track you with the following tools:</Heading>
                <ul style={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', padding: 0 }}>
                  {destinations.map((d) => (
                    <DestinationTile
                      key={d.id}
                      destination={d}
                      setPreferences={setPreferences}
                      preferences={preferences}
                    />
                  ))}
                </ul>
              </Section>

              <Section>
                <SubHeading>Preferences</SubHeading>
                <Code>{JSON.stringify(preferences)}</Code>
              </Section>

              <Button type="submit" style={{ marginRight: 8 }}>
                Save
              </Button>

              <Button type="button" onClick={() => saveConsent(true)} style={{ marginRight: 8 }}>
                Allow all
              </Button>

              <Button type="button" onClick={() => saveConsent(false)}>
                Deny all
              </Button>
            </form>
          )
        }}
      </ConsentManagerBuilder>

      <CookieView />
    </div>
  )
}

export default {
  title: 'ConsentManagerBuilder',
}

export const ToolBasedStory = () => <ToolBased />
ToolBasedStory.storyName = 'Tool Based'
