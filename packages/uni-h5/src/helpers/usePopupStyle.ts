import { onMounted, computed, ref, onUnmounted } from 'vue'

type Popover = {
  left: number
  width: number
  top: number
  height: number
}

export function usePopupStyle(props: Data) {
  const popupWidth = ref(0)
  const popupHeight = ref(0)

  const isDesktop = computed(
    () => popupWidth.value >= 500 && popupHeight.value >= 500
  )
  const popupStyle = computed(() => {
    const style: {
      content: Data
      triangle: Data
    } = { content: {}, triangle: {} }
    const contentStyle = (style.content = {
      transform: '',
      left: '',
      top: '',
      bottom: '',
    })
    const triangleStyle = (style.triangle = {
      left: '',
      top: '',
      bottom: '',
      'border-width': '',
      'border-color': '',
    })
    const popover: Popover = props.popover as Popover
    function getNumber(value: number | string) {
      return Number(value) || 0
    }
    if (isDesktop.value && popover) {
      Object.assign(triangleStyle, {
        position: 'absolute',
        width: '0',
        height: '0',
        'margin-left': '-6px',
        'border-style': 'solid',
      })
      const popoverLeft = getNumber(popover.left)
      const popoverWidth = getNumber(popover.width)
      const popoverTop = getNumber(popover.top)
      const popoverHeight = getNumber(popover.height)
      const center = popoverLeft + popoverWidth / 2
      contentStyle.transform = 'none !important'
      const contentLeft = Math.max(0, center - 300 / 2)
      contentStyle.left = `${contentLeft}px`
      let triangleLeft = Math.max(12, center - contentLeft)
      triangleLeft = Math.min(300 - 12, triangleLeft)
      triangleStyle.left = `${triangleLeft}px`
      const vcl = popupHeight.value / 2
      if (popoverTop + popoverHeight - vcl > vcl - popoverTop) {
        contentStyle.top = 'auto'
        contentStyle.bottom = `${popupHeight.value - popoverTop + 6}px`
        triangleStyle.bottom = '-6px'
        triangleStyle['border-width'] = '6px 6px 0 6px'
        triangleStyle['border-color'] =
          '#fcfcfd transparent transparent transparent'
      } else {
        contentStyle.top = `${popoverTop + popoverHeight + 6}px`
        triangleStyle.top = '-6px'
        triangleStyle['border-width'] = '0 6px 6px 6px'
        triangleStyle['border-color'] =
          'transparent transparent #fcfcfd transparent'
      }
    }
    return style
  })

  onMounted(() => {
    const fixSize = () => {
      const { windowWidth, windowHeight, windowTop } = uni.getSystemInfoSync()
      popupWidth.value = windowWidth
      popupHeight.value = windowHeight + windowTop
    }
    window.addEventListener('resize', fixSize)
    fixSize()

    onUnmounted(() => {
      window.removeEventListener('resize', fixSize)
    })
  })

  return {
    isDesktop,
    popupStyle,
  }
}
