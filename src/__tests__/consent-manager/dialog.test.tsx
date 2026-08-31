import React from 'react'
import { mount } from 'enzyme'
import { nanoid } from 'nanoid'
import Dialog from '../../consent-manager/dialog'

describe('nanoid', () => {
  test('generates unique 21-character ids', () => {
    const id1 = nanoid()
    const id2 = nanoid()

    expect(id1).toHaveLength(21)
    expect(id2).toHaveLength(21)
    expect(id1).not.toBe(id2)
  })
})

describe('Dialog', () => {
  test('uses nanoid for the accessible title and form ids', () => {
    const wrapper = mount(
      <Dialog
        title="Preferences"
        onSubmit={() => undefined}
        buttons={null}
        innerRef={() => undefined}
      >
        Hello
      </Dialog>
    )

    const root = document.getElementById('hightouchio_rootDialog')
    const labelledBy = root?.getAttribute('aria-labelledby')
    const title = labelledBy ? document.getElementById(labelledBy) : null
    const form = document.querySelector('[id^="preferenceDialogForm_"]')

    expect(root).not.toBeNull()
    expect(labelledBy).toMatch(/^[A-Za-z0-9_-]{21}$/)
    expect(title?.textContent).toBe('Preferences')
    expect(form?.id).toBe(`preferenceDialogForm_${labelledBy}`)

    wrapper.unmount()
  })
})
