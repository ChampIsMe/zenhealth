import {useEffect, useState} from 'react';
import throttle from 'lodash.throttle';

const getDeviceConfig = (width) => {
  /*  if (width < 320) {
      return 'xs';
    } else if (width >= 320 && width < 720) {
      return 'sm';
    } else if (width >= 720 && width < 1024) {
      return 'md';
    } else if (width >= 1024) {
      return 'lg';
    }*/
  if (0 < width && width < 600) {
    return 'xs';
  }
  if (600 < width && width < 960) {
    return 'sm';
  }
  if (960 < width && width < 1280) {
    return 'md';
  }
  if (1280 < width && width < 1920) {
    return 'lg';
  }
  if (width >= 1920) {
    return 'xl';
  }
};

const useBreakpoint = () => {
  const [brkPnt, setBrkPnt] = useState(() => getDeviceConfig(window.innerWidth));
  
  useEffect(() => {
    const calcInnerWidth = throttle(function () {
      setBrkPnt(getDeviceConfig(window.innerWidth))
    }, 200);
    window.addEventListener('resize', calcInnerWidth);
    return () => window.removeEventListener('resize', calcInnerWidth);
  }, []);
  
  return brkPnt;
}
export default useBreakpoint;
