import { createChunk } from "./createChunk";
onmessage = async (e) => {
  const { file, CHUNK_SIZE, startIndex, endIndex } = e.data;
  const promises = [];
  for (let i = startIndex; i < endIndex; i++) {
    // const chunk = await createChunk(file, i, CHUNK_SIZE)
    // 上述写法还得等待上一个完成才能进行下一个，效率不佳，可以利用Promise.all可以提高效率,并发执行
    promises.push(createChunk(file, i, CHUNK_SIZE));
  }
  const chunks = await Promise.all(promises);
  postMessage(chunks);
};
