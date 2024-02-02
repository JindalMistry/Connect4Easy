import React from 'react';
import '../Css/game.css';
import LoadingScreen from '../Component/LoadingScreen';

export default function Game() {
    const arr = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ];
    return (
        <div className='game-wrapper'>
            {
                true ?
                    <div className='loading-screen-abs'>
                        <LoadingScreen />
                    </div>
                    :
                    <div className='game-heading'>
                        <div className='game-heading-tile left-tile'>
                            <div>&#127826;</div>
                            <p>Jindal_1305</p>
                        </div>
                        <p className='game-heading-main'>Turn  &#127826;</p>
                        <div className='game-heading-tile right-tile'>
                            <p>Indrajit_420</p>
                            <div>&#127826;</div>
                        </div>
                    </div>
            }
            <ul className='game-list'>
                {arr.flat().map((item, index) => {
                    return (
                        <li key={index} className='game-tile'> &#129473; </li>
                    );
                })}
            </ul>
        </div>
    );
}
