import React, { useState, useEffect } from 'react';
import { AgoraRTCProvider, useClient, useLocalMicrophoneTrack, useLocalCameraTrack } from 'agora-rtc-react';

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;

function VideoCall() {
  const client = useClient();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { localCameraTrack } = useLocalCameraTrack();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        setUsers(prevUsers => [...prevUsers, user]);
      });

      client.on('user-unpublished', (user) => {
        setUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
      });

      try {
        await client.join(APP_ID, 'interview-channel', null, null);
        if (localCameraTrack) await client.publish(localCameraTrack);
        if (localMicrophoneTrack) await client.publish(localMicrophoneTrack);
      } catch (error) {
        console.error('Error joining channel:', error);
      }
    };

    init();

    return () => {
      client.leave();
      localCameraTrack?.close();
      localMicrophoneTrack?.close();
    };
  }, [client, localCameraTrack, localMicrophoneTrack]);

  return (
    <div className="grid grid-cols-2 gap-4 h-full p-4">
      <div className="relative">
        {localCameraTrack && (
          <div className="w-full h-full">
            <video
              className="w-full h-full object-cover rounded-lg"
              ref={(ref) => {
                if (ref) ref.srcObject = localCameraTrack;
              }}
              autoPlay
            />
          </div>
        )}
      </div>
      {users.map(user => (
        <div key={user.uid} className="relative">
          <video
            className="w-full h-full object-cover rounded-lg"
            ref={(ref) => {
              if (ref) ref.srcObject = user.videoTrack;
            }}
            autoPlay
          />
        </div>
      ))}
    </div>
  );
}

export default VideoCall;