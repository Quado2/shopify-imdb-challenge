import React from 'react'
import {ScaleLoader} from 'react-spinners'
import { css } from '@emotion/core'

import './Spinner.css'

const spinner = (props) => {
    const override = css`
    display: inline;
    margin: 0;

    `;

    return (
        <div className='spinner1'>
            <ScaleLoader
                size = {props.spinnerSize}
                sizeUnit = {'px'}
                color={props.color}
                loading = {true} 
                css = {override}
                /> 
            <h3 style={{fontSize:props.textSize, color: props.color}}>{props.message}...</h3>
        </div>
    )

}

export default spinner

