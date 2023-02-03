import { extendTheme } from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const theme = extendTheme({
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
  },
  components: {
    Button: {
      baseStyle: {
        rounded: 'lg'
      }
    },
    IconButton: {
      baseStyle: {
        rounded: 'full'
      },
      variants: {
        header: {
          bg: 'gray.100',
          _dark: {
            bg: 'gray.800'
          },
          _pressed: {
            bg: 'gray.200',
            _dark: {
              bg: 'gray.700'
            }
          },
          _icon: {
            color: 'gray.600',
            _dark: {
              color: 'gray.400'
            }
          }
        },
      }
    },
    Input: {
      baseStyle: {
        rounded: 'lg',
        py: 0,
        h: 10
      },
      defaultProps: {
        size: 'lg'
      },
      variants: {
        alt: (props) => {
          const style = props.theme.components["Input"].variants.filled(props);
          return {
            ...style,
            "bg": "gray.100",
            "borderColor": "gray.100",
            _dark: {
              "bg": "gray.800",
              "borderColor": "gray.800",
            }
          }
        }
      }
    },
    Checkbox: {
      baseStyle: {
        rounded: 'full'
      }
    },
    Text: {
      baseStyle: {
        fontSize: 'md'
      },
      variants: {
        alt: {
          fontSize: 'sm',
          color: 'gray.600',
          _dark: {
            color: 'gray.400'
          }
        },
      }
    },
    Divider: {
      baseStyle: {
        bg: 'gray.100',
        _dark: {
          bg: 'gray.800'
        }
      }
    },
  },
  config: {
    useSystemColorMode: true
  }
})

export const colorModeManager = {
  get: async () => {
    try {
      let val = await AsyncStorage.getItem('@color-mode');
      return val === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  },
  set: async (value) => {
    try {
      await AsyncStorage.setItem('@color-mode', value);
    } catch (e) {
      console.log(e);
    }
  },
};

export const darkModeMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
]