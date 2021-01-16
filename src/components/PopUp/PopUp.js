import React from 'react'

import './PopUp.css'

const popUp = (props) => {
    return(
        <div className='pop-up'>
            <div className='top2' >
                <h2>{props.title}</h2>
                 <i className="far fa-check-circle"></i> 
                
            </div>

            <div className='mid'>
                <div>
                    <h2>{props.message}</h2>
                </div> 
            </div>
            
            <div className='bottom2'>
                <h2 onClick={props.handlePopUpOk}>Ok</h2>
            </div>
        </div>
    )

}

export default popUp