import React from 'react'
import groupBy from 'lodash/groupBy'
import { Heading, SubHeading, Code, Button } from './components/ui'
import { ConsentManagerBuilder } from '../src'
import DestinationTile from './components/destination-tile'
import CookieView from './components/CookieView'

function Section({ children }: { children: React.ReactNode }) {
  return <section style={{ marginBottom: 24 }}>{children}</section>
}

function byCategory(destinations) {
  return groupBy(destinations, 'category')
}

const CategoryBased = () => {
  return (
    <div style={{ maxWidth: 1000, margin: 30 }}>
      <ConsentManagerBuilder
        onError={(e) => console.error('Error Handling', e)}
        writeKey={process.env.STORYBOOK_WRITE_KEY!}
      >
        {({ destinations, preferences, setPreferences, saveConsent }) => {
          function handleSubmit(e) {
            e.preventDefault()
            saveConsent()
          }

          const categories = byCategory(destinations)

          return (
            <form onSubmit={handleSubmit}>
              <Section>
                <Heading>ACME Would like to track you with the following tools:</Heading>

                {Object.keys(categories).map((cat) => {
                  const destinationsForCategory = categories[cat]
                  return (
                    <div key={cat} style={{ marginTop: 20 }}>
                      <SubHeading>{cat}</SubHeading>
                      <ul
                        style={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', padding: 0 }}
                      >
                        {destinationsForCategory.map((d) => (
                          <DestinationTile
                            key={d.id}
                            destination={d}
                            setPreferences={setPreferences}
                            preferences={preferences}
                          />
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </Section>

              <Section>
                <Heading>Preferences</Heading>
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

export const CategoryBasedStory = () => <CategoryBased />
CategoryBasedStory.storyName = 'Category Based'
