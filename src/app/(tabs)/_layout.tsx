import { NativeTabs } from 'expo-router/native-tabs';
import { useTheme } from "@/theme";

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <NativeTabs
      tintColor={theme.primary}
      backgroundColor={theme.surface}
      indicatorColor={theme.divider}
      rippleColor={theme.divider}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon 
          md="home"
          sf={{ default: 'house', selected: 'house.fill' }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="history">
        <NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon 
          sf={{ default: 'clock', selected: 'clock.fill' }}
          md="history"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="compare">
        <NativeTabs.Trigger.Label>Compare</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'arrow.left.arrow.right.circle', selected: 'arrow.left.arrow.right.circle.fill' }}
          md="compare_arrows"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person', selected: 'person.fill' }}
          md="person"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
