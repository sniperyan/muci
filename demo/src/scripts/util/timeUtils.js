import moment from 'moment';


// 传入一个时间Date，返回跟后端交互的{startTime, endTime}
function  calTimeRange(time) {
  const startTime = moment(time).startOf('day').format(); 
  const endTime = moment(time).endOf('day').format(); 
  return {startTime, endTime};
}

/**
 * 格式化日期，返回如： 2018年3月23日 23:18
 */
function  formatTime1(time) {
  return moment(time).format('YYYY年MM月DD日 HH:mm');
}

/**
 * 格式化日期，返回如： 2018-3-23
 */
function  formatTime2(time) {
  return moment(time).format('YYYY-MM-DD');
}

export {
  calTimeRange,
  formatTime1,
  formatTime2,
};