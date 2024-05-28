import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import './callRoomPage.style.scss';
import peer from '../../services/peerService';
import { useSocket } from '../../context/SocketProvider'
import ReactPlayer from 'react-player';
import { MdCallEnd } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { useMutation } from '@tanstack/react-query';
import superAdminAPIs from '../../apis/super-admin';

import toast from 'react-hot-toast';

function CallRoomPage() {
 
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [remoteSocketId2, setRemoteSocketId2] = useState(null);

  const [isCallBtnClicked, setIsCallBtnClicked] = useState(false);
  const [isCallBtnClicked2, setIsCallBtnClicked2] = useState(false);

  const [myStream, setMyStream] = useState();
  const [myStream2, setMyStream2] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [remoteStream2, setRemoteStream2] = useState();

  const [callDuration, setCallDuration] = useState(0);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleUserJoined2 = useCallback(({ email, id }) => {
    console.log(`Email ${email} ${id} joined room 222`);
    setRemoteSocketId2(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("make:call", { to: remoteSocketId, offer });
    setMyStream(stream);
    setIsCallBtnClicked(true);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, answer }) => {
        console.log(answer);
      peer.setLocalDescription(answer);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
   
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ answer }) => {
    await peer.setLocalDescription(answer);
  }, []);

  // PEER 2 Connections

  const handleCallUser2 = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer2();
    socket.emit("make:call2", { to: remoteSocketId2, offer });
    setMyStream2(stream);
    setIsCallBtnClicked2(true);
  }, [remoteSocketId2, socket]);

  const handleIncommingCall2 = useCallback(
    async ({ from, offer }) => {
      console.log('handleIncommingCall2 ', from);
      setRemoteSocketId2(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream2(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer2(offer);
      socket.emit("call:accepted2", { to: from, ans });
    },
    [socket]
  );

  const sendStreams2 = useCallback(() => {
    for (const track of myStream2.getTracks()) {
      peer.peer2.addTrack(track, myStream2);
    }
  }, [myStream2]);

  const handleCallAccepted2 = useCallback(
    ({ from, answer }) => {
        console.log(answer);
      peer.setLocalDescription2(answer);
      console.log("Call Accepted!");
      sendStreams2();
    },
    [sendStreams2]
  );

  const handleNegoNeeded2 = useCallback(async () => {
    console.log(remoteSocketId2);
    const offer = await peer.getOffer2();
    socket.emit("peer:nego:needed2", { offer, to: remoteSocketId2 });
  }, [remoteSocketId2, socket]);

  const handleNegoNeedIncomming2 = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer2(offer);
      socket.emit("peer:nego:done2", { to: from, ans });
   
    },
    [socket]
  );

  const handleNegoNeedFinal2 = useCallback(async ({ answer }) => {
    await peer.setLocalDescription2(answer);
  }, []);


  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });

    peer.peer2.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream2(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    peer.peer2.addEventListener("negotiationneeded", handleNegoNeeded2);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
      peer.peer2.addEventListener("negotiationneeded", handleNegoNeeded2);
    };
  }, [handleNegoNeeded, handleNegoNeeded2]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    // Peer 2 
    socket.on("user:joined2", handleUserJoined2);
    socket.on("incomming:call2", handleIncommingCall2);
    socket.on("call:accepted2", handleCallAccepted2);
    socket.on("peer:nego:needed2", handleNegoNeedIncomming2);
    socket.on("peer:nego:final2", handleNegoNeedFinal2);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);

      // Peer 2 
      socket.off("user:joined2", handleUserJoined2);
      socket.off("incomming:call2", handleIncommingCall2);
      socket.off("call:accepted2", handleCallAccepted2);
      socket.off("peer:nego:needed2", handleNegoNeedIncomming2);
      socket.off("peer:nego:final2", handleNegoNeedFinal2);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
    handleUserJoined2,
    handleIncommingCall2,
    handleCallAccepted2,
    handleNegoNeedIncomming2,
    handleNegoNeedFinal2
  ]);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: superAdminAPIs.makeCallEnd,
    onSuccess: (data) => {
      if(data['statusCode'] === 200) {
        const msg = data['message'];
        
        socket.emit('admin:ended:call', { to: remoteSocketId });
        socket.emit('admin:ended:call', { to: remoteSocketId2 });

        toast.success(msg, { 'position' : 'top-right' });
        
        navigate('/dashboard/incoming-calls');
      }
    }
  });

  useEffect(() => {
    setTimeout(() => {
      setCallDuration(callDuration + 1);
    }, 1000);
  }, [callDuration]);


  const makeCallEnd = () => {
    const callId = roomId.split('-')[0];
    if(!callId) return;

    const details = {
      "callId" : callId,
      "newTimeDuration" : callDuration,
    };

    mutate(details);
  }

  console.log(callDuration);

  return (
    <div className='call-room-page'>
      <h1 className='meeting-heading'>Meeting Page</h1>
      {/* <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4> */}
      <div className='videos-main-container'>
        
        <div className={`remote-video-cont ${!remoteStream && 'make-height-cont'}`}>          
          {remoteStream && (
            <>
              <ReactPlayer
                playing
                muted
                // height="100px"
                // width="200px"
                style={{ 'height' : 'inherit', 'width' : 'inherit' }}
                url={remoteStream}
              />
            </>
          )}
          {
            !remoteStream && (
              <h3>Waiting...</h3>
            )
          }
        </div>
        
        <div className={`video-cont ${!myStream && 'make-height-cont'}`}>
          {myStream && (
            <>
              <ReactPlayer
                playing
                muted
                style={{ 'height' : 'inherit', 'width' : 'inherit' }}
                url={myStream}
              />
            </>
          )}
          {
            !myStream && (
              <h3>Waiting...</h3>
            )
          }
        </div>

        <div className={`remote-video-cont ${!remoteStream2 && 'make-height-cont'}`}>
          {remoteStream2 && (
            <>
              <ReactPlayer
                playing
                muted
                style={{ 'height' : 'inherit', 'width' : 'inherit' }}
                url={remoteStream2}
              />
            </>
          )}
          {
            !remoteStream2 && (
              <h3>Waiting...</h3>
            )
          }
        </div>
        
        
      </div>
      <div className='actions-div'>
        {/* {myStream && <button onClick={sendStreams}>Send Stream</button>} */}
        {remoteSocketId && <div className={`${isCallBtnClicked === true ? 'call-btn disabled' : 'call-btn'}`} onClick={isCallBtnClicked === false ? handleCallUser : null}>
                <IoMdCall className='icon'/>
                </div>}
        {
          isCallBtnClicked === true ? (<div onClick={makeCallEnd} className={`call-end-btn`}>
          <MdCallEnd className='icon'/>
           </div>) : null
        }
        {/* {remoteSocketId2 && <div className={`${isCallBtnClicked2 === true ? 'call-btn disabled' : 'call-btn'}`} onClick={isCallBtnClicked2 === false ? handleCallUser2 : null}>
        <IoMdCall className='icon'/>
        </div>}   */}
        {
          remoteSocketId2 && <div className={`${isCallBtnClicked2 === true ? 'call-btn disabled' : 'call-btn call-btn2'}`} onClick={isCallBtnClicked2 === false ? handleCallUser2 : null}>
          <IoMdCall className='icon'/>
          </div>
        }
      </div>
    </div>
  );
}

export default CallRoomPage