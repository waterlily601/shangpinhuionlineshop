import {v4 as uuidv4} from 'uuid';
// 函数的主要目的：生成一个随机字符串，且每次执行不发生变化，游客身份持久存储
export const getUUID = ()=>{
    // 先从本地存储获取uuid（看一下本地存储里有没有）
    let uuid_token = localStorage.getItem('UUIDTOKEN');
    // 如果没有的话，就我来生成
    if(!uuid_token){
        // 生成一次、并本地存储
        uuid_token = uuidv4();
        localStorage.setItem('UUIDTOKEN',uuid_token);
    }
    return uuid_token;
}