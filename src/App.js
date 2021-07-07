import './App.css'
import React from 'react'
import { useJitsi } from 'react-jutsu'

function App () {
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
  const { error, jitsi } = useJitsi(jitsiConfig)

  function registerEvents (_jitsi) {
    _jitsi.addListener('participantJoined', (participant) => {
      console.log('participantJoined**', participant)
      if (participant.displayName === 'Stage') {
        jitsi.pinParticipant(participant.id)
        jitsi.setLargeVideoParticipant(participant.id)
      }
    })
  }

  return (
    <div className="App App-header">
      <div style={{ width: '100%' }}>
        {error && <p>{error}</p>}
        {jitsi && registerEvents(jitsi)}
        <div id={jitsiConfig.parentNode} style={{ height: '100vh' }} />
      </div>
    </div>
  )
}

export default App
