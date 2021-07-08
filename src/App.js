import './App.css'
import React, { useEffect } from 'react'
// import { useJitsi } from 'react-jutsu'

function App () {
  useEffect(() => {
    initJitsi()
    return () => {
      // cleanup
    }
  })

  const jitsiConfig = {
    domain: 'the-prdct.com',
    roomName: 'bpp-stage',
    displayName: 'Stage-Client',
    password: '',
    parentNode: 'jitsi-container',
    width: '100%',
    height: '100%',
    configOverwrite: {
      toolbarButtons: [],
      disableInitialGUM: true
    },
    // I have the suspicion, that the interfaceConfig values are somehow ignored....
    interfaceConfigOverwrite: {
      ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 0,
      SHOW_JITSI_WATERMARK: false,
      INITIAL_TOOLBAR_TIMEOUT: 0
    },
    onload: (event) => {

    }
  }
  // const { error, jitsi } = useJitsi(jitsiConfig)

  // function registerEvents (_jitsi) {
  //   console.log('window.JitsiMeetJS', window.JitsiMeetJS)
  //   _jitsi.addListener('participantJoined', participant => {
  //     if (participant.displayName === 'Stage') {
  //       console.log('stumpf ist trumpf**', document.getElementsByTagName('audio'))
  //       jitsi.pinParticipant(participant.id)
  //       jitsi.setLargeVideoParticipant(participant.id)
  //     }
  //   })
  //   _jitsi.addListener('deviceListChanged', devices => {
  //     console.log('deviceListChanged**', devices)
  //   })
  // }

  const connectionOptions = {
    hosts: {
       domain: 'the-prdct.com',
       muc: 'conference.the-prdct.com', 
       focus: 'focus.the-prdct.com',
    }, 
    externalConnectUrl: 'https://the-prdct.com/http-pre-bind', 
    // enableP2P: true, 
    // p2p: { 
    //    enabled: true, 
    //    preferH264: true, 
    //    disableH264: true, 
    //    useStunTurn: true,
    // }, 
    // useStunTurn: true,
    // https://localhost:3000/session/vpaas-magic-cookie-6294b3cb7dfc4f3a8061419116d90ace/SampleAppVariedLaunchesMobilizePartially
    // https://8x8.vc/vpaas-magic-cookie-6294b3cb7dfc4f3a8061419116d90ace/SampleAppBasedTrailersPleaseSoftly
    // bosh: `https://the-prdct.com/http-bind?room=bpp-stage`,
    serviceUrl: `https://the-prdct.com/http-bind?room=bpp-stage`,
    websocket: 'https://the-prdct.com/xmpp-websocket',
    clientNode: 'http://jitsi.org/jitsimeet',
  }

  let jitsi
  let connection
  let room

  let streamVideoId = 'idle'
  let streamAudioId = 'idle'

  function onRemoteTrack (track) {
    const participants = room.getParticipants()
    const stage = participants.filter(participant => {
      if (participant._displayName === 'Stage') {
        return true
      }
      return false
    })
    let stageParticipantId
    if (stage.length >= 1) {
      stageParticipantId = stage[0]._id
    }
    if (track.getParticipantId() === stageParticipantId) {
      console.log('stage track**', track)
      if (track.getType() === 'video') {
        const videoContainer = document.getElementById('videoContainer')
        track.attach(videoContainer)
        streamVideoId = track.track.id
        videoContainer.play()
      }
      if (track.getType() === 'audio') {
        const audioContainer = document.getElementById('audioContainer')
        track.attach(document.getElementById('audioContainer'))
        streamAudioId = track.track.id
        audioContainer.play()
      }
    }
    document.body.style.backgroundColor = 'green'
  }

  function onRemoteTrackRemoved (track) {
    if (track.track.id === streamVideoId) {
      console.log('detach track', track)
      track.detach(document.getElementById('videoContainer'))
      streamVideoId = 'idle'
    }
    if (track.track.id === streamAudioId) {
      console.log('detach track', track)
      track.detach(document.getElementById('audioContainer'))
      streamAudioId = 'idle'
    }
  }

  function onConferenceJoined () {
    console.log('onConferenceJoined')
  }

  function onUserLeft () {
    console.log('onUserLeft')
  }
  function onUserJoined () {
    console.log('onUserJoined')
  }
  function onTrackMuteChanged (track) {
    console.log('TRACK_MUTE_CHANGED', track)
  }

  function onConnectionSuccess () {
    room = connection.initJitsiConference('bpp-stage', {})
    // room = connection.initJitsiConference('bpp-stage', {disableSimulcast: true})
    room.setDisplayName('Stage Client hello')
    room.on(jitsi.events.conference.TRACK_ADDED, onRemoteTrack)
    room.on(jitsi.events.conference.TRACK_REMOVED, onRemoteTrackRemoved)
    room.on(jitsi.events.conference.CONFERENCE_JOINED, onConferenceJoined)
    room.on(jitsi.events.conference.USER_LEFT, onUserLeft)
    room.on(jitsi.events.conference.USER_JOINED, onUserJoined)
    room.on(jitsi.events.conference.TRACK_MUTE_CHANGED, onTrackMuteChanged)
    room.join()
  }
  function onConnectionFailed () {
    console.log('onConnectionFailed')
  }
  function disconnect () {
    room.leave()
    // connection.disconnect()
    console.log('disconnect')
  }

  async function initJitsi () {
    jitsi = window.JitsiMeetJS
    jitsi.init()
    connection = new jitsi.JitsiConnection(null, null, connectionOptions)

    jitsi.setLogLevel(jitsi.logLevels.ERROR)

    connection.addEventListener(jitsi.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess)
    connection.addEventListener(jitsi.events.connection.CONNECTION_FAILED, onConnectionFailed)
    connection.addEventListener(jitsi.events.connection.CONNECTION_DISCONNECTED, disconnect)

    connection.connect()
  }

  return (
    <div className="App App-header" onClick={() => {
      document.getElementById('videoContainer').play()
      document.getElementById('audioContainer').play()
    }}>
      <div style={{ width: '100%' }}>
        <video autoplay='true' id='videoContainer' style={{ height: '100px', width: '100px', background: 'red' }} />
        <audio autoplay='true' id='audioContainer' style={{ height: '100px', width: '100px', background: 'blue' }} />
        {/* {error && <p>{error}</p>} */}
        {/* {jitsi && registerEvents(jitsi)} */}
        {/* <div id={jitsiConfig.parentNode} style={{ height: '100vh' }} /> */}
      </div>
    </div>
  )
}

export default App
