import React, { useState } from 'react'
import './CallsTable.style.scss'

import { convertDateTimeToStringForCalls } from '../../utils/helperMethods';

// Icons Import
import { IoSearch } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useQuery } from '@tanstack/react-query';
import userAPIs from '../../apis/admin';
import { CALL_STATUS_ENDED, CALL_TYPE_INCOMING, DEFAULT_ITEM_PER_PAGE } from '../../utils/constants';

function CallsTableComponent() {
  const [pageNumber, setPageNumber] = useState(1);
  const {data:response, isLoading, isError, error} = useQuery(
    {
      queryKey: ['recent-calls'],
      queryFn: () => userAPIs.getRecentCalls(CALL_STATUS_ENDED, CALL_TYPE_INCOMING, DEFAULT_ITEM_PER_PAGE, pageNumber),
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

  return (
    <>
        <div className='calls-table-parent-cont'>
        <div className='calls-table'>
          {/* Title row */}
          <div className='title-row-cont'>
              <div className='title-cont'>
                Recent Calls
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
                  <tbody>
                    <tr>
                      <th id='th-1'>#</th>
                      <th id='th-2'>Caller</th>
                      <th id='th-3'>Duration(sec)</th>
                      <th id='th-4'>Date & Time</th>
                      <th id='th-5'>Called To</th>
                    </tr>
                  </tbody>
    
                  {
                    response.calls.map((rCalls, index) => (
                      <tbody  key={rCalls['_id']}>
                        <tr>
                          <td className='sl-no'>{index}</td>
                          <td>{rCalls['firstPersonCaller']['userFullName']}</td>
                          <td>{rCalls['duration']}</td>
                          <td>{convertDateTimeToStringForCalls(rCalls['date'])}</td>
                          <td>{rCalls['secondPersonCalledTo']['userFullName']}</td>
                        </tr>
                      </tbody>
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

export default CallsTableComponent