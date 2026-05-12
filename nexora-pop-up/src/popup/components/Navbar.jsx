import React, { useState } from 'react'
import '../css/auth.css'
import '../css/main.css'

export class NavbarFastView extends React.Component {

    CreateItem = ( data ) => {
        console.log("new data: ", data);
    }

    render () {
        return (
            <div className='NavBarContainer'>
                <div className='NavBarLeftBtn' onClick={() => this.CreateItem('no')}><button>+ Add link</button></div>
                <div className='NavBarDropMenu'><button>&#8942;</button></div>
            </div>
        )
    }
}