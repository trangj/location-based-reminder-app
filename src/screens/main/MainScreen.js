import { useCallback, useMemo, useRef } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { View, Text } from 'react-native';
import MapView from 'react-native-maps';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

function MainScreen() {
  const bottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => ['10%', '35%', '95%'], []);
  const renderBackdrop = useCallback(props => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={2}
      disappearsOnIndex={1}
    />
  ), [])

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        rotateEnabled={false}
        pitchEnabled={false}
      />
      <BottomSheet
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
        index={0}
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