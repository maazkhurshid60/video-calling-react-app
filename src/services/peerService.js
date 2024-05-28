class PeerService {
    constructor() {
      if (!this.peer) {
        this.peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:global.stun.twilio.com:3478",
              ],
            },
          ],
        });
      }
      if (!this.peer2) {
        this.peer2 = new RTCPeerConnection({
          iceServers: [
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:global.stun.twilio.com:3478",
              ],
            },
          ],
        });
      }
      if (!this.peer2) {
        this.peer2 = new RTCPeerConnection({
          iceServers: [
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:global.stun.twilio.com:3478",
              ],
            },
          ],
        });
      }
    }
  
    async getAnswer(offer) {
      if (this.peer) {
        await this.peer.setRemoteDescription(offer);
        const ans = await this.peer.createAnswer({ offerToReceiveVideo: true });
        await this.peer.setLocalDescription(new RTCSessionDescription(ans));
        return ans;
      }
    }

    // P2
    async getAnswer2(offer) {
      if (this.peer2) {
        await this.peer2.setRemoteDescription(offer);
        const ans = await this.peer.createAnswer({ offerToReceiveVideo: true });
        await this.peer2.setLocalDescription(new RTCSessionDescription(ans));
        return ans;
      }
    }
  
    async setLocalDescription(ans) {
      if (this.peer) {
        await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
      }
    }

    // P2
    async setLocalDescription2(ans) {
      if (this.peer2) {
        await this.peer2.setRemoteDescription(new RTCSessionDescription(ans));
      }
    }
  
    async getOffer() {
      if (this.peer) {
        const offer = await this.peer.createOffer({ offerToReceiveVideo: true, offerToReceiveAudio: true });
        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
      }
    }

    // P2
    async getOffer2() {
      if (this.peer2) {
        const offer = await this.peer2.createOffer({ offerToReceiveVideo: true, offerToReceiveAudio: true });
        await this.peer2.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
      }
    }
  }
  
  export default new PeerService();