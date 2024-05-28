import React from 'react'
import './Layout.style.scss'

import { Outlet } from 'react-router-dom'

import { SideDashboardNavComponent, TopBarDashboardComponent } from '../../../components/index';

function DashboardLayout() {
  return (
    <>
        <div className='dashboard-layout'>
            <section className='sec-1'>
                <SideDashboardNavComponent />
            </section>
            <section className='sec-2'>
                <TopBarDashboardComponent />
                <Outlet />
            </section>
        </div>
    </>
  )
}

export default DashboardLayout