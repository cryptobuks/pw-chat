/**
 * getLocalStream
 * @param {MediaMediaStreamConstraints} constraints
 * @returns Promise<MediaStream>
 */
function getLocalStream (constraints = undefined) {
  if (!constraints) {
    constraints = {
      audio: true,
      video: {
        width: { min: 700, ideal: 1280, max: 1920 },
        height: { min: 400, ideal: 720, max: 1080 }
      }
    }
  }
  return navigator.mediaDevices.getUserMedia(constraints)
}

export default getLocalStream
