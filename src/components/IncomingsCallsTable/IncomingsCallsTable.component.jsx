import React, { useCallback, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import './IncomingsCallsTable.style.scss'

// Icons Import
// import { IoSearch } from "react-icons/io5";
// import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { IoTimeSharp } from "react-icons/io5";
import userAPIs from '../../apis/admin';
import { CALL_STATUS_PENDING, CALL_TYPE_INCOMING, DEFAULT_ITEM_PER_PAGE } from '../../utils/constants';
import { convertDateTimeToStringForCalls } from '../../utils/helperMethods';
import { useSocket } from '../../context/SocketProvider';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';

function IncomingsCallsTableComponent() {

  const navigate = useNavigate();
  const socket = useSocket();
  const state = useSelector((state) => state.user.userData);
  const [pageNumber, setPageNumber] = useState(1);
  const {data:response, isLoading, isError, error} = useQuery(
    {
      queryKey: ['incoming-calls'],
      queryFn: () => userAPIs.getRecentCalls(CALL_STATUS_PENDING, CALL_TYPE_INCOMING, DEFAULT_ITEM_PER_PAGE, pageNumber),
      gcTime: 0,
      refetchInterval: 1000 * 2,
    }
  );

  const handleChangePage = (indicator) => {
    if(indicator === 'next') {
      if(response.totalPages === 0) return;

      if(pageNumber >= response.totalPages) return;

      setPageNumber((prev) => prev + 1);

    } else if (indicator === 'previous'){
      if(pageNumber <= DEFAULT_ITEM_PER_PAGE) return;
      setPageNumber((prev) => prev - 1);
    }
  }

  const handleRejectCall = async (call) => {
    const callId = call._id;
    const firstPersonEmailAddress = call.firstPersonCaller.userEmail;

    const details = {
      'callId' : callId,
      'newCallStatus' : 'REJECTED'
    }

    const response = await userAPIs.changeCallStatus(details);

    if(response['statusCode'] === 200) {
      socket.emit('admin:rejectedCall', { email: firstPersonEmailAddress })
      toast.success('Call Rejected Successfully!', { 'position' : 'top-right' });
    }
  }

  const handleQueuedCall = async (call) => {
    const callId = call._id;
    const firstPersonEmailAddress = call.firstPersonCaller.userEmail;


    const details = {
      'callId' : callId,
      'newCallType' : 'QUEUED'
    }

    const response = await userAPIs.changeCallType(details);

    if(response['statusCode'] === 200) {
      socket.emit('admin:queuedCall', { email: firstPersonEmailAddress })
      toast.success('Call Queued Successfully!', { 'position' : 'top-right' });
    }
  }


  const handleJoinRoomRequest = useCallback((call) => {
    const email = state.userEmail;
    const roomId = call.roomId;
    const callId = call._id;

    const secondUserEmailId = call.secondPersonCalledTo.userEmail;
    const firstPersonUserName = call.firstPersonCaller.userFullName;

    const details = {
      'callId' : callId,
      'newCallStatus' : 'ACCEPTED'
    }

    userAPIs.changeCallStatus(details)
    .then((response) => {
      if(response['statusCode'] === 200) {
        socket.emit("room:joinWeb", {email, roomId, callId})
        socket.emit('notify:secondUser', { roomId, secondUserEmailId, firstPersonUserName });
      }
    })

  }, [socket]);

  const handleJoinRoom = useCallback((data) => {
    const { email, roomId, callId } = data;

    navigate(`/dashboard/call-room/${callId}-${roomId}`,);

  }, [navigate]);

  useEffect(() => {
    socket.on("room:joinWeb", handleJoinRoom);
    return () => {
      socket.off("room:joinWeb", handleJoinRoom)
    }
  }, [socket]);

  return (
    <>
        <div className='incoming-calls-table-parent-cont'>
        <div className='calls-table'>
            {/* Title row */}
            <div className='title-row-cont'>
                <div className='title-cont'>
                  Incomings Calls
                </div>
                {/* <div className='search-filter-cont'>
                  <div className='search-cont'>
                    <IoSearch className='icon'/>
                    <input className='search' type='text' placeholder='Search'/>
                  </div>
                  <div className='filter-cont'>
                    All
                    <IoIosArrowDown className='icon'/>
                  </div>
                </div> */}
            </div>
            {isLoading && <h2>Loading...</h2>}
            {isError && <h2>Error Occured {error?.message} </h2>}

            {
              !isLoading && !isError && (
                <div className='table-cont'>
                  <table>
                    <tr>
                      <th id='th-1'>SL No</th>
                      <th id='th-2'>Caller</th>
                      <th id='th-3'>Date & Time</th>
                      <th id='th-4'>Call To</th>
                      <th id='th-5'>Actions</th>
                    </tr>

                    {
                      response.calls.map((rCalls, index) => (
                        <tr key={rCalls['_id']}>
                          <td className='sl-no'>{index}</td>
                          <td>{rCalls['firstPersonCaller']['userFullName']}</td>
                          <td>{convertDateTimeToStringForCalls(rCalls['date'])}</td>
                          <td>{rCalls['secondPersonCalledTo']['userFullName']}</td>
                          <td className='tb-actions'>
                              <IoIosCheckmarkCircle onClick={() => handleJoinRoomRequest(rCalls)} className='icon' id='check'/>
                              <MdCancel onClick={() => handleRejectCall(rCalls)} className='icon' id="cancel"/>
                              <IoTimeSharp onClick={() => handleQueuedCall(rCalls)} className='icon' id="queued"/>
                          </td>
                        </tr>
                      ))
                    }
                  </table>

                  {
                    response.totalPages > DEFAULT_ITEM_PER_PAGE && (
                      <div className='pagination-cont'>
                          <div onClick={() => handleChangePage('previous')} className='prev-btn'>
                            <MdKeyboardArrowLeft className='icon'/>
                            Previous
                          </div>
                          <div className='number-cont active'>{pageNumber}</div>
                          {/* <div className='number-cont'>2</div>
                          <div className='number-cont'>3</div> */}
                          <div onClick={() => handleChangePage('next')} className='next-btn'>
                            Next
                            <MdKeyboardArrowRight className='icon'/>
                          </div>
                      </div>
                    )
                  }
                </div>
              )
            }
        </div>
        </div>
    </>
  )
}

export default IncomingsCallsTableComponent