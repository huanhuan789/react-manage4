//异步中间件applyMiddleware
import {createStore,applyMiddleware} from 'redux'
//异步
import thunk from 'redux-thunk'
import reducer from './reducer'
//创建story仓库
const store=createStore(reducer,applyMiddleware(thunk))
export default store
