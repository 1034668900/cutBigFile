import SparkMD5 from 'spark-md5'
export  function createChunk(file, index, CHUNK_SIZE) {
  return new Promise((resolve) => {
    const start = index * CHUNK_SIZE;
    const end = start + CHUNK_SIZE;
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()
    fileReader.onload = e =>{
        spark.append(e.target.result)
        resolve({
            start,
            end,
            index,
            hash:spark.end()
        })
    }
    fileReader.readAsArrayBuffer(file.slice(start,end))
  });
}
