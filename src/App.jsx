import React, { useState, useEffect } from 'react';
import Chessboard from './components/Chessboard/index.jsx';
import './App.scss';

function App() {
  const [gameStarted, setGameStarted] = useState(false); // 游戏是否开始
  const [stepNum, setStepNum] = useState(0); // 游戏步数
  const [score, setScore] = useState(0); // 当前分数
  const [bestScore, setBestScore] = useState(0); // 最高分数
  const [stepDirection, setStepDirection] = useState(''); // 方向

  useEffect(() => {
    const data = localStorage.getItem('bestScore');
    if (data) {
      setBestScore(data);
    }
  }, []);

  useEffect(() => {
    setStepDirection('');
  }, [stepNum]);

  /**
   * 键盘事件
   */
  function onKeyUp(e) {
    if (!gameStarted) {
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
    setStepDirection(direction);
  }

  /**
   * 更新步数
   */
  function updateStepNum() {
    setStepNum(stepNum + 1);
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
              <p className="score">{score}</p>
            </div>
            <div className="block">
              <p className="name">最高分</p>
              <p className="score">{bestScore}</p>
            </div>
          </div>
        </div>

        <Chessboard
          updateScore={setScore}
          setGameStarted={setGameStarted}
          gameStarted={gameStarted}
          stepDirection={stepDirection}
          updateStepNum={updateStepNum}
        />
      </div>
    </div>
  );
}

export default App;
