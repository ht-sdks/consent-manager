import React, { useEffect, useState } from 'react'
import { Pane, Heading, Button } from 'evergreen-ui'
import cookies from 'js-cookie'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { DEFAULT_COOKIE_NAME } from '../../src/consent-manager-builder/preferences'

function readCookies(): Record<string, unknown> {
  const all = cookies.get()
  const parsed: Record<string, unknown> = {}
  Object.keys(all).forEach(key => {
    try {
      parsed[key] = JSON.parse(all[key])
    } catch {
      parsed[key] = all[key]
    }
  })
  return parsed
}

const CookieView = () => {
  const [cookieVal, updateCookieVal] = useState(readCookies)

  useEffect(() => {
    const clear = setInterval(() => {
      updateCookieVal(readCookies())
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
          Object.keys(allCookies).forEach(key => {
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
