import React from 'react'

const font = 'system-ui, -apple-system, Segoe UI, sans-serif'

export function Heading({ children, style, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      {...props}
      style={{
        fontFamily: font,
        fontSize: 20,
        fontWeight: 600,
        lineHeight: 1.3,
        margin: '0 0 12px',
        color: '#234361',
        ...style,
      }}
    >
      {children}
    </h2>
  )
}

export function SubHeading({
  children,
  style,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      {...props}
      style={{
        fontFamily: font,
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 1.3,
        margin: '0 0 8px',
        color: '#234361',
        ...style,
      }}
    >
      {children}
    </h3>
  )
}

export function Button({
  children,
  style,
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      {...props}
      style={{
        fontFamily: font,
        fontSize: 14,
        lineHeight: 1.2,
        padding: '8px 16px',
        borderRadius: 4,
        border: '1px solid #c1c4d6',
        background: '#fff',
        color: '#425a70',
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function Paragraph({
  children,
  style,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...props}
      style={{
        fontFamily: font,
        fontSize: 14,
        lineHeight: 1.5,
        margin: '0 0 12px',
        color: '#425a70',
        ...style,
      }}
    >
      {children}
    </p>
  )
}

export function Code({ children, style, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      {...props}
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 13,
        background: '#f4f5f7',
        borderRadius: 3,
        padding: '2px 6px',
        color: '#234361',
        ...style,
      }}
    >
      {children}
    </code>
  )
}

export function Card({ children, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        background: '#fff',
        border: '1px solid #e6e8f0',
        borderRadius: 4,
        boxShadow: '0 1px 4px rgba(67, 90, 111, 0.15)',
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: React.ReactNode
  checked: boolean
  onChange: () => void
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        marginBottom: 8,
        fontFamily: font,
        fontSize: 14,
        color: '#234361',
      }}
    >
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  )
}
