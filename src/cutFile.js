import { createChunk } from "./createChunk.js";
const CHUNK_SIZE = 1024 * 1024; // 分片大小:1MB
const THREAD_COUNT = navigator.hardwareConcurrency || 4; // 线程数量,设置为机器的cpu数量最好

// 文件分片
export async function cutFile(file) {
  return new Promise((resolve) => {
    // 计算一共需要分为多少片(向上取整)
    const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
    // 每个线程处理多少片
    const workerChunkCount = Math.ceil(chunkCount / THREAD_COUNT);
    let workerFinishCount = 0; // 记录线程完成的数量
    const result = [];
    // MD5编码时会在主线程运算，造成卡顿，因此计算交给其他线程
    for (let i = 0; i < THREAD_COUNT; i++) {
      // 创建一个新的线程,注意不能直接写相对路径
      const worker = new Worker(new URL('./worker.js',import.meta.url), {
        type: "module",
      });
      // 每个线程处理的开始索引
      let startIndex = i * workerChunkCount;
      let endIndex = startIndex + workerChunkCount;
      // 结束索引可能超出最大分片数量
      if (endIndex > chunkCount) endIndex = chunkCount;
      // 发送消息到分线程
      worker.postMessage({ file, CHUNK_SIZE, startIndex, endIndex });
      // 接收分线程的消息
      worker.onmessage = (e) => {
        // 得到的结果不能直接push到result中,会有顺序问题
        for (let i = startIndex; i < endIndex; i++) {
          result[i] = e.data[i - startIndex];
        }
        // 终止线程
        worker.terminate();
        workerFinishCount++;
        if (workerFinishCount == THREAD_COUNT) {
          resolve(result);
        }
      };
    }
  });
}
