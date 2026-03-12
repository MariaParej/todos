import * as React from 'react'

interface EmailTemplateProps {
  firstName: string,
  confirmLink: string
}

export default function EmailTemplate({ firstName, confirmLink }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>¡Confirma tu registro {firstName}!</h1>
      <p>
        Para terminar de crear tu cuenta y elegir tu contraseña, haz clic en el
        siguiente botón dentro de los siguientes 15 minutos:
      </p>
      <a
        href={confirmLink}
        style={{
          background: '#2563eb',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          textDecoration: 'none'
        }}
      >
        Completar Registro
      </a>
    </div>
  )
}
