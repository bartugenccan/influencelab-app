import { createStackNavigator } from '@react-navigation/stack';
import {
  HomeScreen,
  HomeDetail,
  CameraScreen,
  GalleryScreen,
  FeedbackModeSelectionScreen,
} from '@/screens';
import { AppRoutes, HomeStackParamList } from '@/types/navigation';
import { UploadContentScreen } from '@/screens/UploadContentScreen';
const Stack = createStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AppRoutes.HOME} component={HomeScreen} />
      <Stack.Screen name={AppRoutes.HOME_DETAIL} component={HomeDetail} />
      <Stack.Screen name={AppRoutes.CAMERA} component={CameraScreen} />
      <Stack.Screen name={AppRoutes.GALLERY} component={GalleryScreen} />
      <Stack.Screen name={AppRoutes.UPLOAD_CONTENT} component={UploadContentScreen} />
      <Stack.Screen
        name={AppRoutes.FEEDBACK_MODE_SELECTION}
        component={FeedbackModeSelectionScreen}
      />
    </Stack.Navigator>
  );
};
