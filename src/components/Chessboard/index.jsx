import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import './index.scss';

const levels = [
  { bg: '#eee4da', color: '#776e65', size: 34 }, // 2
  { bg: '#ede0c8', color: '#776e65', size: 34 }, // 4
  { bg: '#f2b179', color: '#f9f6f2', size: 34 }, // 8
  { bg: '#f2b179', color: '#f9f6f2', size: 34 }, // 16
  { bg: '#f67c5f', color: '#f9f6f2', size: 34 }, // 32
  { bg: '#f65e3b', color: '#f9f6f2', size: 34 }, // 64
  { bg: '#edcf72', color: '#f9f6f2', size: 24 }, // 128
  { bg: '#edcc61', color: '#f9f6f2', size: 24 }, // 256
  { bg: '#edc850', color: '#f9f6f2', size: 24 }, // 512
  { bg: '#edc53f', color: '#f9f6f2', size: 14 }, // 1024
];
const CELL_WIDTH = 60; // 格子宽度
const SPACE_WIDTH = 10; // 间隔宽度
let _grid = null;

const Chessboard = ({ store, dispatch }) => {
  const [msgVisible, setMsgVisible] = useState(true);
  const [grid, setGrid] = useState([
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ]);
  const [list, setList] = useState([]);

  useEffect(() => {
    let newList = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] !== null) {
          newList.push(Object.assign({}, {
            x: j,
            y: i,
            level: grid[i][j],
          }, levels[grid[i][j]]));
        }
      }
    }
    setList(newList);
    _grid = JSON.parse(JSON.stringify(grid));
  }, [grid]);

  useEffect(() => {
    if (store.stepDirection) {
      const newGrid = [];
      let score = 0; // 分数
      console.log(store.stepDirection)
      switch (store.stepDirection) {
        case 'TOP':
          break;
        case 'LEFT':
          _grid.forEach(row => {
            let newRow = [];
            row.forEach(item => {
              if (item !== null) {
                newRow.push(item);
              }
            });
            if (newRow.length) {
              for (let i = 1; i <= newRow.length; i++) {
                if (newRow[i] === null) {
                  break;
                }
                if (newRow[i] === newRow[i - 1]) {
                  newRow[i - 1] = newRow[i - 1] + 1;
                  score += Math.pow(2, newRow[i] + 2);
                  for (let j = i; j < newRow.length; j++) {
                    if (newRow[j + 1]) {
                      newRow[j] = newRow[j + 1];
                    } else {
                      newRow[j] = null;
                    }
                  }
                }
              }
            }
            while (newRow.length < 4) {
              newRow.push(null);
            }
            newGrid.push(newRow);
          });
          break;
        default:
          break;
      }
      if (JSON.stringify(_grid) !== JSON.stringify(newGrid)) {
        // 更新游戏步数
        dispatch({
          type: 'updateStepNum',
        });

        // 添加新的数
        const spaceCells = [];
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if (newGrid[i][j] === null) {
              spaceCells.push({ x: i, y: j });
            }
          }
        }
        const random = Math.floor(Math.random() * spaceCells.length);
        const newCellLevel = createNewCell();
        const { x, y } = spaceCells[random];
        newGrid[x][y] = newCellLevel;
        setGrid(newGrid);
      }
      dispatch({
        type: 'updateStepDirection',
        payload: '',
      });
      dispatch({
        type: 'updateScore',
        payload: score,
      });
    }
  }, [dispatch, store.stepDirection])

  /**
   * 生成格子
   * @return {void}
   */
  function createCellsEl() {
    let cells = new Array(16).fill('').map((i, index) => {
      return (
        <div
          key={index}
          className="cell"
          style={{
            top: Math.floor(index / 4) * (CELL_WIDTH + SPACE_WIDTH) + SPACE_WIDTH,
            left: index % 4 * (CELL_WIDTH + SPACE_WIDTH) + SPACE_WIDTH,
          }}
        />
      );
    });
    return cells;
  }

  /**
   * 开始按钮被点击
   * @return {void}
   */
  function playBtnOnClick() {
    const level1 = createNewCell();
    const level2 = createNewCell();

    const x1 = Math.floor(Math.random() * 4);
    const y1 = Math.floor(Math.random() * 4);
    let x2 = x1;
    let y2 = y1;
    while (x2 === x1 && y2 === y1) {
      x2 = Math.floor(Math.random() * 4);
      y2 = Math.floor(Math.random() * 4);
    }

    let newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[y1][x1] = level1;
    newGrid[y2][x2] = level2;

    setGrid(newGrid);
    setMsgVisible(false);
    dispatch({
      type: 'updateState',
      payload: {
        gameStarted: true,
      },
    });
  }

  /**
   * 生成新的格子数据
   */
  function createNewCell() {
    // 格子等级，十分之一的概率为等级1的格子
    const level = Math.random() > 0.9 ? 1 : 0;
    return level;
  }

  return (
    <div
      className="chessboard"
    >
      { createCellsEl() }

      {
        list.map((item, index) => {
          return (
            <div
              key={index}
              className="cell"
              style={{
                top: item.y * (CELL_WIDTH + SPACE_WIDTH) + SPACE_WIDTH,
                left: item.x % 4 * (CELL_WIDTH + SPACE_WIDTH) + SPACE_WIDTH,
                background: item.bg,
                fontSize: item.size,
                color: item.color,
              }}
            >
              {Math.pow(2, item.level + 1)}
            </div>
          )
        })
      }

      {
        msgVisible ? (
          <div className="game-over">
            <p className="message">准备好了吗？</p>
            <div className="play-btn" onClick={playBtnOnClick}>开始游戏</div>
          </div>
        ) : null
      }
    </div>
  );
};

export default connect(state => ({
  store: state,
}))(Chessboard);
