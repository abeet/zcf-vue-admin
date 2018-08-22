import _ from 'lodash'
import axios from 'axios'

function imageLoad (imagePath) {
  let img = new Image()

  img.crossOrigin = 'anonymous'
  img.src = imagePath

  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img)

    img.onerror = reject
  })
}

function readImageFile (file) {
  let reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.readAsDataURL(file)

    reader.onload = () => {
      resolve(reader.result)
    }

    reader.onerror = reject
  })
}

const operateType = [
  'top',
  'right',
  'bottom',
  'left',
  'top-left',
  'top-right',
  'bottom-right',
  'bottom-left',
  'move'
]

function cutBoxRatioOperate ({ type, originalCutBox, container }, offset) {
  let result = _.cloneDeep(originalCutBox)

  const ratio = originalCutBox.width / originalCutBox.height

  let _h = 0, _w = 0

  switch (type) {
    case 'top-left':
      if ((offset.x > 0 && offset.y > 0) || (offset.x < 0 && offset.y < 0)) {
        _h = originalCutBox.height + offset.y
        _w = _h * ratio
      } else {
        return result
      }
      break
    case 'top-right':
      if ((offset.x < 0 && offset.y > 0) || (offset.x > 0 && offset.y < 0)) {
        _h = originalCutBox.height + offset.y
        _w = _h * ratio
      } else {
        return result
      }
      break
    case 'bottom-right':
      if ((offset.x > 0 && offset.y > 0) || (offset.x < 0 && offset.y < 0)) {
        _h = originalCutBox.height - offset.y
        _w = _h * ratio
      } else {
        return result
      }
      break
    case 'bottom-left':
      if ((offset.x < 0 && offset.y > 0) || (offset.x > 0 && offset.y < 0)) {
        _h = originalCutBox.height - offset.y
        _w = _h * ratio
      } else {
        return result
      }
      break
  }

  if (_h > container.height) {
    _h = container.height
    _w = _h * ratio
  }

  if (_w > container.width) {
    _w = container.width
    _h = _w / ratio
  }

  switch (type) {
    case 'top-left':
      result = Object.assign(result, {
        left: originalCutBox.left - (_w - originalCutBox.width),
        top: originalCutBox.top - (_h - originalCutBox.height),
        width: _w,
        height: _h
      })

      break
    case 'top-right':
      result = Object.assign(result, {
        top: originalCutBox.top - (_h - originalCutBox.height),
        width: _w,
        height: _h
      })

      break
    case 'bottom-right':
      result = Object.assign(result, {
        width: _w,
        height: _h
      })

      break
    case 'bottom-left':
      result = Object.assign(result, {
        left: originalCutBox.left - (_w - originalCutBox.width),
        width: _w,
        height: _h
      })

      break
  }

  return result
}

function cutBoxOperate (
  { type, startPosition, originalCutBox, container },
  { pageX, pageY },
  isLockSize,
  isLockRatio
) {
  const offset = {
    x: startPosition.x - pageX,
    y: startPosition.y - pageY
  }

  let result = _.cloneDeep(originalCutBox)

  // 锁定高宽
  if (isLockSize && type !== 'move') {
    return result
  }

  // 锁定比例
  if (isLockRatio && ['top', 'right', 'bottom', 'left'].includes(type)) {
    return result
  }

  switch (type) {
    case 'top':
      result = Object.assign(result, {
        height: originalCutBox.height + offset.y,
        top: originalCutBox.top - offset.y
      })
      break
    case 'right':
      result = Object.assign(result, {
        width: originalCutBox.width - offset.x
      })
      break
    case 'bottom':
      result = Object.assign(result, {
        height: originalCutBox.height - offset.y
      })
      break
    case 'left':
      result = Object.assign(result, {
        width: originalCutBox.width + offset.x,
        left: originalCutBox.left - offset.x
      })

      break
    case 'top-left':
      result = isLockRatio
        ? cutBoxRatioOperate({ type, originalCutBox, container }, offset)
        : Object.assign(result, {
          top: originalCutBox.top - offset.y,
          left: originalCutBox.left - offset.x,
          height: originalCutBox.height + offset.y,
          width: originalCutBox.width + offset.x
        })
      break
    case 'top-right':
      result = isLockRatio
        ? cutBoxRatioOperate({ type, originalCutBox, container }, offset)
        : Object.assign(result, {
          top: originalCutBox.top - offset.y,
          height: originalCutBox.height + offset.y,
          width: originalCutBox.width - offset.x
        })
      break
    case 'bottom-right':
      result = isLockRatio
        ? cutBoxRatioOperate({ type, originalCutBox, container }, offset)
        : Object.assign(result, {
          height: originalCutBox.height - offset.y,
          width: originalCutBox.width - offset.x
        })
      break
    case 'bottom-left':
      result = isLockRatio
        ? cutBoxRatioOperate({ type, originalCutBox, container }, offset)
        : Object.assign(result, {
          left: originalCutBox.left - offset.x,
          height: originalCutBox.height - offset.y,
          width: originalCutBox.width + offset.x
        })
      break
    case 'move':
      result = Object.assign(result, {
        top: originalCutBox.top - offset.y < 0
          ? 0
          : originalCutBox.top - offset.y,
        left: originalCutBox.left - offset.x < 0
          ? 0
          : originalCutBox.left - offset.x
      })

      if (container.width < result.left + result.width) {
        result.left = container.width - result.width
      }

      if (container.height < result.top + result.height) {
        result.top = container.height - result.height
      }
      break
  }

  if (result.top < 0) {
    result.height += result.top
    result.top = 0
  }

  if (result.left < 0) {
    result.width += result.left
    result.left = 0
  }

  if (container.width < result.width + result.left) {
    result.width = container.width - result.left
  }

  if (container.height < result.height + result.top) {
    result.height = container.height - result.top
  }

  return result
}

function getImageExt (imagePath) {
  const index = imagePath.lastIndexOf('.')
  const ext = imagePath.substr(index + 1).toLowerCase()

  return ext
}

function getImageType (imagePath) {
  const ext = getImageExt(imagePath)

  if (['jpg', 'jpeg'].includes(ext)) {
    return 'image/jpeg'
  }

  return 'image/png'
}

async function cutImage (
  canvas1,
  canvas2,
  { previewImageHeight, previewImageWidth },
  cutBox,
  imagePath
) {
  canvas1.height = previewImageHeight
  canvas1.width = previewImageWidth

  canvas2.height = cutBox.height
  canvas2.width = cutBox.width

  const context1 = canvas1.getContext('2d')
  const context2 = canvas2.getContext('2d')

  const img = await imageLoad(imagePath)

  context1.drawImage(img, 0, 0, previewImageWidth, previewImageHeight)

  const imgData = context1.getImageData(
    cutBox.left,
    cutBox.top,
    cutBox.width,
    cutBox.height
  )

  context2.putImageData(imgData, 0, 0, 0, 0, imgData.width, imgData.height)

  const type = getImageType(imagePath)

  return canvas2.toDataURL(type)
}

function dataURLtoBlob (dataURL) {
  let arr = dataURL.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bStr = atob(arr[1]),
    n = bStr.length,
    u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bStr.charCodeAt(n)
  }

  return new Blob([u8arr], { type: mime })
}

async function uploadBase64Image (dataURL, imagePath, siteID) {
  const imgBlob = dataURLtoBlob(dataURL)
  const ext = getImageExt(imagePath)
  let imageName = imagePath.substring(imagePath.lastIndexOf('/'),imagePath.lastIndexOf('?'))
  // console.log('-----------------------')
  // console.log(imgBlob)
  // console.log(ext)
  const formData = new FormData()
  formData.append('file', imgBlob, imageName)
  formData.append('siteID', siteID)
  formData.append('path', imagePath)
  formData.append('saveAs', 'NewFile')
  const res = await axios.post('/api/commonimagecutting/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return res
}

async function watermarkImage (
  canvas,
  { width, height, top, left, opacity, watermark },
  imagePath
) {
  const img = await imageLoad(imagePath)

  canvas.width = img.width
  canvas.height = img.height

  const context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.globalAlpha = 1
  context.drawImage(img, 0, 0, img.width, img.height)

  const watermarkImage = new Image()
  watermarkImage.src = watermark

  context.globalAlpha = opacity
  context.drawImage(watermarkImage, left, top, width, height)

  const type = getImageType(imagePath)

  return canvas.toDataURL(type)
}

async function watermarkText (
  canvas,
  {
    content,
    top,
    left,
    width,
    fontFamily,
    fontSize,
    lineHeight,
    color,
    opacity,
    isBold,
    isItalic,
    isUnderline,
    isTextStroke,
    textStrokeSize,
    textStrokeColor
  },
  imagePath
) {
  function canvasTextAutoLine (str, ctx, initX, initY, lineHeight, canvasWidth) {
    let lineWidth = 0
    let lastSubStrIndex = 0
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width
      if (lineWidth > canvasWidth - initX) {
        // 减去initX,防止边界出现的问题
        ctx.fillText(str.substring(lastSubStrIndex, i), initX, initY)
        initY += lineHeight
        lineWidth = 0
        lastSubStrIndex = i
      }
      if (i == str.length - 1) {
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY)
      }
    }
  }

  const img = await imageLoad(imagePath)

  canvas.width = img.width
  canvas.height = img.height

  const canvasContext = canvas.getContext('2d')
  canvasContext.clearRect(0, 0, canvas.width, canvas.height)

  canvasContext.globalAlpha = 1
  canvasContext.drawImage(img, 0, 0, img.width, img.height)

  canvasContext.font =
    (isItalic ? 'italic normal ' : 'normal normal ') +
    (isBold ? 'bold ' : 'normal ') +
    fontSize +
    'px "' +
    fontFamily +
    '"'

  canvasContext.textBaseline = 'top'
  canvasContext.globalAlpha = opacity
  canvasContext.fillStyle = color
  canvasTextAutoLine(
    content,
    canvasContext,
    left,
    top,
    lineHeight * fontSize,
    width
  )

  const type = getImageType(imagePath)

  return canvas.toDataURL(type)
}

let autoTextarea = function (elem, extra, maxHeight) {
  extra = extra || 0
  let isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
    isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
    addEvent = function (type, callback) {
      elem.addEventListener
        ? elem.addEventListener(type, callback, false)
        : elem.attachEvent('on' + type, callback)
    },
    getStyle = elem.currentStyle ? function (name) {
      let val = elem.currentStyle[name]
      if (name === 'height' && val.search(/px/i) !== 1) {
        let rect = elem.getBoundingClientRect()
        return rect.bottom - rect.top -
          parseFloat(getStyle('paddingTop')) -
          parseFloat(getStyle('paddingBottom')) + 'px'
      }

      return val
    } : function (name) {
      return getComputedStyle(elem, null)[name]
    },
    minHeight = parseFloat(getStyle('height'))
  elem.style.resize = 'none'

  let change = function () {
    let scrollTop, height,
      padding = 0,
      style = elem.style

    if (elem._length === elem.value.length) return
    elem._length = elem.value.length

    if (!isFirefox && !isOpera) {
      padding = parseInt(getStyle('paddingTop')) +
        parseInt(getStyle('paddingBottom'))
    }

    scrollTop = document.body.scrollTop || document.documentElement.scrollTop

    elem.style.height = minHeight + 'px'
    if (elem.scrollHeight > minHeight) {
      if (maxHeight && elem.scrollHeight > maxHeight) {
        height = maxHeight - padding
        style.overflowY = 'auto'
      } else {
        height = elem.scrollHeight - padding
        style.overflowY = 'hidden'
      }

      style.height = height + extra + 'px'
      scrollTop += parseInt(style.height) - elem.currHeight
      document.body.scrollTop = scrollTop
      document.documentElement.scrollTop = scrollTop
      elem.currHeight = parseInt(style.height)
    }

  }

  addEvent('propertychange', change)
  addEvent('input', change)
  addEvent('focus', change)
  change()
}

export {
  operateType,
  imageLoad,
  readImageFile,
  cutBoxOperate,
  cutImage,
  getImageType,
  uploadBase64Image,
  watermarkImage,
  watermarkText,
  autoTextarea
}
