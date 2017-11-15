/**
 * getLocalStream
 * @param {MediaMediaStreamConstraints} constraints
 * @returns Promise<MediaStream>
 */
function getLocalStream () {
  const constraints = {
    audio: true,
    video: {
      width: { min: 800, ideal: 1280, max: 1920 },
      height: { min: 500, ideal: 720, max: 1080 }
    }
  }

  return navigator.mediaDevices.getUserMedia(constraints)
}

export default getLocalStream
