import React from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'

const rotar = keyframes`
    100% { 
        transform: rotate(360deg);
    }
`

const bounce = keyframes`
    0%, 100% { 
        transform: scale(0.0);
    }
    50% { 
        transform: scale(1.0); 
    }
`

const SpinnerContainer = styled.div`
    margin: 50px auto;
    width: 40px;
    height: 40px;
    position: relative;
    text-align: center;
    animation: ${rotar} 2.0s infinite linear;
`

const Dot = styled.div`
    width: 60%;
    height: 60%;
    display: inline-block;
    position: absolute;
    top: 0;
    background-color: #334F64;
    border-radius: 100%;
    animation: 2.0s ${bounce} infinite ease-in-out;
`
const Dot2 = styled.div`
    width: 60%;
    height: 60%;
    display: inline-block;
    position: absolute;
    top: 0;
    background-color: #334F64;
    border-radius: 100%;
    animation: 2.0s ${bounce} infinite ease-in-out;
    top: auto;
    bottom: 0;
    animation-delay: -1.0s;
`

const Text = styled.p`
    width: 100%;
    text-align: center;
`

const Spinner = ({msg}) => {
    return ( 
        <>
            <SpinnerContainer>
                <Dot></Dot>
                <Dot2></Dot2>
            </SpinnerContainer>
            <Text>{msg}</Text>
        </>
    )
}   
 
export default Spinner;