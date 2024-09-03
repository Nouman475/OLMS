import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Home/Home'
import Main from './Main/Main'


export default function Frontend() {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/products' element={<Main />} />
        </Routes>
    )
}
