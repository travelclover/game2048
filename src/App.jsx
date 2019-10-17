import React, { useEffect } from 'react';
import Chessboard from './components/Chessboard/index.jsx';
import { connect } from "react-redux";
import './App.scss';

function App({ store, dispatch }) {

  useEffect(() => {
    const data = localStorage.getItem('bestScore');
    if (data) {
      dispatch({
        type: 'updateBestScore',
        payload: data,
      });
    }
  }, [dispatch]);

  /**
   * 键盘事件
   */
  function onKeyUp(e) {
    if (!store.gameStarted) {
      return;
    }
    let direction = null;
    switch (e.keyCode) {
      case 87:
      case 38:
        direction = 'TOP';
        break;
      case 68:
      case 39:
        direction = 'RIGHT';
        break;
      case 83:
      case 40:
        direction = 'BOTTOM';
        break;
      case 65:
      case 37:
        direction = 'LEFT';
        break;
      default:
        break;
    }
    dispatch({
      type: 'updateStepDirection',
      payload: direction,
    });
  }

  return (
    <div
      className="app"
      tabIndex="0"
      onKeyUp={onKeyUp}
    >
      <div className="wrap">
        <div className="header">
          <div className="title">2048</div>
          <div className="info">
            <div className="block">
              <p className="name">得分</p>
              <p className="score">{store.score}</p>
            </div>
            <div className="block">
              <p className="name">最高分</p>
              <p className="score">{store.bestScore}</p>
            </div>
          </div>
        </div>

        <Chessboard />
      </div>
    </div>
  );
}

export default connect(state => ({
  store: state,
}))(App);
