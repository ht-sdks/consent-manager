import React, { useEffect, useState } from 'react'
import { Pane, Heading, Button } from 'evergreen-ui'
import cookies from 'js-cookie'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { DEFAULT_COOKIE_NAME } from '../../src/consent-manager-builder/preferences'

function getAllCookies(): Record<string, unknown> {
  const all = cookies.get()
  if (!all) {
    return {}
  }

  return Object.keys(all).reduce<Record<string, unknown>>((acc, key) => {
    try {
      acc[key] = JSON.parse(all[key])
    } catch {
      acc[key] = all[key]
    }
    return acc
  }, {})
}

const CookieView = () => {
  const [cookieVal, updateCookieVal] = useState(getAllCookies())

  useEffect(() => {
    const clear = setInterval(() => {
      updateCookieVal(getAllCookies())
    }, 1000)
    return () => clearInterval(clear)
  })

  return (
    <Pane marginTop={30}>
      <Heading>Cookies:</Heading>
      <SyntaxHighlighter language="json" style={docco}>
        {JSON.stringify(cookieVal, null, 2)}
      </SyntaxHighlighter>

      <Button
        onClick={() => {
          cookies.remove(DEFAULT_COOKIE_NAME)
          window.location.reload()
        }}
        marginRight={16}
      >
        Clear consent 🍪
      </Button>

      <Button
        onClick={() => {
          const allCookies = cookies.get()
          Object.keys(allCookies || {}).forEach((key) => {
            cookies.remove(key)
          })
          window.location.reload()
        }}
      >
        Clear all 🧹🍪
      </Button>
    </Pane>
  )
}

export default CookieView
