import { ImageResponse } from 'next/og'
export const alt = 'Eclipse'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
export default async function Image() {
  return new ImageResponse(
    (
      <div
      style={{
        background: '#fff',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        fontFamily: '"Helvetica Neue", system-ui, sans-serif',
        paddingLeft:25,
        paddingRight:25,
  
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: '#000',
     
          }}
        />
        <div
          style={{
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            transform: 'translateX(30px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            color: '#000',
            fontSize: '180px',
            fontWeight: 900,
            zIndex: 10,
            textShadow: '0px 0px 12px rgba(0,0,0,0.3)',
          }}
        >
          E
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'right',
        }}
      >
        <h1
          style={{
            fontSize: '100px',
            fontWeight: 900,
            color: '#000',
            margin: 0,
            letterSpacing: '-3px',
          }}
        >
          ECLIPSE
        </h1>
        <p
          style={{
            fontSize: '40px',
            color: '#000',
            margin: '12px 0 0',
            fontWeight: 500,
            letterSpacing: '3px',
            opacity: 0.9,
          }}
        >
          TIMELESS FASHION
        </p>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          width: '100%',
          textAlign: 'center',
          fontSize: '22px',
          color: '#000',
          opacity: 0.6,
          fontWeight: 400,
          letterSpacing: '1px',
          paddingLeft:14
        }}
      >
        www.eclipse.com
      </div>
    </div>
    ),

    {

      ...size,
    
    }
  )
}