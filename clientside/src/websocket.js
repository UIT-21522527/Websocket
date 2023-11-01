const host = process.env.NODE_ENV === 'production' ? window.location.host : 'localhost:5000'

export let send

export const startWebsocketConnection = () => {
  const ws = new window.WebSocket('ws://' + host + '/chat') || {}
  ws.onopen = () => {
    console.log('opened ws connection')
  }

  ws.onclose = (e) => {
    console.log('close ws connection: ', e.code, e.reason)
  }

  ws.onmessage = (event) => {
    const receivedData = event.data;
    
    console.log('receivedData', receivedData);
    onMessageCallback && onMessageCallback(receivedData)
  };

  send = (props) => {
    console.log('props', props);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(props);
    }
  }
}

let onMessageCallback
export const registerOnMessageCallback = (fn) => {
  onMessageCallback = fn
}
