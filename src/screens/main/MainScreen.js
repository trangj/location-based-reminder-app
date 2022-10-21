import { useMemo, useRef } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { View, Text, StatusBar } from 'react-native';
import MapView from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';

function MainScreen() {
  const bottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => ['10%', '50%'], []);

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        rotateEnabled={false}
        pitchEnabled={false}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
      >
        <View style={styles.contentContainer}>
          <Text>This is a bottom sheet</Text>
        </View>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default MainScreen