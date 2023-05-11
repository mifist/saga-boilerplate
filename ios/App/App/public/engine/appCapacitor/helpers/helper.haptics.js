// The Haptics API provides physical feedback to the user through touch or vibration.
// On devices that don't have Taptic Engine or Vibrator, the API calls will resolve without performing any action.
// Docs: https://capacitorjs.com/docs/apis/haptics#selectionchanged
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const hapticsImpactMedium = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
};

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

const hapticsVibrate = async () => {
  await Haptics.vibrate();
};

const hapticsSelectionStart = async () => {
  await Haptics.selectionStart();
};

const hapticsSelectionChanged = async () => {
  await Haptics.selectionChanged();
};

const hapticsSelectionEnd = async () => {
  await Haptics.selectionEnd();
};

export default {
  hapticsImpactMedium,
  hapticsImpactLight,
  hapticsVibrate,
  hapticsSelectionStart,
  hapticsSelectionChanged,
  hapticsSelectionEnd
}