import React from 'react'
import './DashboardPage.style.scss';

import { CallsTableComponent } from '../../../components/index'

import { IoMdCall } from "react-icons/io";
import { HiPhoneIncoming } from "react-icons/hi";
import { FaStopwatch } from "react-icons/fa6";
import { useQuery } from '@tanstack/react-query';
import userAPIs from '../../../apis/admin';

function DashboardPage() {

  const {data:response, isLoading, isError, error} = useQuery(
    {
      queryKey: ['admin-stats'],
      queryFn: userAPIs.getAdminAccStats
    }
  );

  return (
    <>
      <div className='dashboard-page'>
        
        <div className='cards-cont'>
            {/* First Card */}
            <div className='card'>
              <div className='row'>
                  <div className='icon-cont' id='i-cont-1'>
                    <IoMdCall className='icon' id='ic-1'/>
                  </div>
                  <div className='content-cont'>
                      <h5>Calls in Queue</h5>
                      {
                        isLoading && (<p>Loading..</p>)
                      }
                      {
                        isError && (<p>{error?.message}</p>)
                      }
                      {
                        !isLoading && !isError && (<p>{response.queueCalls}</p>)
                      }
                  </div>
              </div>
            </div>


            {/* Second Card */}
            <div className='card'>
              <div className='row'>
                  <div className='icon-cont' id='i-cont-2'>
                    <IoMdCall className='icon' id='ic-2'/>
                  </div>
                  <div className='content-cont'>
                      <h5>Calls this week</h5>
                      {
                        isLoading && (<p>Loading..</p>)
                      }
                      {
                        isError && (<p>{error?.message}</p>)
                      }
                      {
                        !isLoading && !isError && (<p>{response.callsThisWeek}</p>)
                      }
                  </div>
              </div>
            </div>

            {/* Third Card */}
            <div className='card'>
              <div className='row'>
                  <div className='icon-cont' id='i-cont-3'>
                    <HiPhoneIncoming className='icon' id='ic-3'/>
                  </div>
                  <div className='content-cont'>
                      <h5>Incoming Calls</h5>
                      {
                        isLoading && (<p>Loading..</p>)
                      }
                      {
                        isError && (<p>{error?.message}</p>)
                      }
                      {
                        !isLoading && !isError && (<p>{response.incomingCalls}</p>)
                      }
                  </div>
              </div>
            </div>

            {/* Fourth Card */}
            <div className='card'>
              <div className='row'>
                  <div className='icon-cont' id='i-cont-4'>
                    <FaStopwatch className='icon' id='ic-4'/>
                  </div>
                  <div className='content-cont'>
                      <h5>Avg Hold Time</h5>
                      {
                        isLoading && (<p>Loading..</p>)
                      }
                      {
                        isError && (<p>{error?.message}</p>)
                      }
                      {
                        !isLoading && !isError && (<p>{response.avgHoldTime} secs</p>)
                      }
                  </div>
              </div>
            </div>


        </div>

        <CallsTableComponent />

      </div>
    </>
  )
}

export default DashboardPage