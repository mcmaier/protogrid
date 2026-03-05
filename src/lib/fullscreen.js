  export function fullscreen(node) {
    let isFullscreen = false;
    
    function enter() {
      if (node.requestFullscreen) node.requestFullscreen();
      else if (node.webkitRequestFullscreen) node.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);      
    }
    
    function exit() {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
    
    function toggle() {
      if (!document.fullscreenElement) {
        enter();
      } else {
        exit();
      }
    }
    
    // Reagiere auf Fullscreen-Änderungen (auch durch ESC/F11)
    const handleFullscreenChange = () => {
      isFullscreen = !!document.fullscreenElement;
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    
    return {
      update() {}, // Für Reaktivität
      destroy() {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      },
      enter,
      exit,
      toggle,
      isFullscreen: () => isFullscreen
    };
  }