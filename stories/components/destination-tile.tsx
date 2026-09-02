import React from 'react'
import PropTypes from 'prop-types'
import { Card, Checkbox } from './ui'

export default function Destination({ destination, preferences, setPreferences }) {
  return (
    <li style={{ maxWidth: 280, marginRight: 20 }}>
      <Card style={{ padding: '8px 20px 20px' }}>
        <Checkbox
          label={
            <a href={destination.website} target="_blank" rel="noopener noreferrer">
              {destination.name}
            </a>
          }
          checked={Boolean(preferences[destination.id])}
          onChange={() =>
            setPreferences({
              [destination.id]: !preferences[destination.id],
            })
          }
        />
        <p
          style={{
            display: 'block',
            fontSize: 12,
            lineHeight: 1.4,
            margin: 0,
            color: '#425a70',
          }}
        >
          {destination.description}
        </p>
      </Card>
    </li>
  )
}

Destination.propTypes = {
  destination: PropTypes.object.isRequired,
  preferences: PropTypes.object.isRequired,
  setPreferences: PropTypes.func.isRequired,
}
