import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#fff',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#000',
            position: 'absolute',
          }}
        />
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            transform: 'translateX(4px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            color: '#000',
            fontSize: '20px',
            fontWeight: 'bold',
       
            fontFamily: 'system-ui, sans-serif',
            zIndex: 10,
            textShadow: '0px 0px 2px rgba(0,0,0,0.8)',
          }}
        >
          E
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}