const initState = {
  gameStarted: false, // 游戏是否开始
  stepNum: 0, // 游戏步数
  stepDirection: '', // 方向
  score: 0, // 当前分数
  bestScore: 0, // 最高分数
};

export default (state = initState, action) => {
  switch (action.type) {
    case 'updateState':
      return {
        ...state,
        ...action.payload,
      };
    case 'updateStepNum':
      return {
        ...state,
        stepNum: state.stepNum + 1,
      };
    case 'updateStepDirection':
      return {
        ...state,
        stepDirection: action.payload,
      };
    case 'updateScore':
      const score = state.score + action.payload;
      return {
        ...state,
        score,
        bestScore: score > state.bestScore ? score : state.bestScore,
      };
    case 'updateBestScore':
      return {
        ...state,
        bestScore: action.payload,
      };
    default:
      return state;
  }
};
