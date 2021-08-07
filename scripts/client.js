function Client() {
  const ws = new WebSocket("ws://localhost:8000");
  const peerConnection = new RTCPeerConnection();
  /** @type {RTCDataChannel} */
  let dataChannel;

  let peerId = -1;

  peerConnection.onicecandidate = (ev) => {
    if (ev.candidate) ws.send(JSON.stringify({ type: "ice-candidate", candidate: ev.candidate, to: peerId }))
  }

  ws.onmessage = async function (ev) {
    const data = JSON.parse(ev.data);
    console.log(data);

    switch (data.type) {
      case "join-request":
        peerConnection.ondatachannel = (ev) => { dataChannel = ev.channel; }

        await peerConnection.setRemoteDescription(data.offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        ws.send(JSON.stringify({ type: "join-response", answer: answer, to: data.from }));
        break;
      case "join-response":
        await peerConnection.setRemoteDescription(data.answer);
        break;
      case "ice-candidate":
        peerConnection.addIceCandidate(data.candidate);
        break;
    }
  }

  this.init = function (_peerId) {
    peerId = _peerId;
  }

  this.join = async function () {
    dataChannel = peerConnection.createDataChannel("dataChannel");
    dataChannel.onopen = (ev) => { console.log(ev); }
    dataChannel.onclose = (ev) => { console.log(ev); }

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    ws.send(JSON.stringify({ type: "join-request", offer: offer, to: peerId }));
  }
}

export const client = new Client();