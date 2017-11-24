/**
 * getLocalStream
 * @param {MediaMediaStreamConstraints} constraints
 * @returns Promise<MediaStream>
 */
function getLocalStream () {
  const constraints = {
    audio: true,
    video: true
  }

  return navigator.mediaDevices.getUserMedia(constraints)
}

export default getLocalStream
