import { AppScreen, AppText, Card } from "@/components/ui";

export default function Index() {
  return (
    <AppScreen>
      <Card>
        <AppText align="center" variant="display" color="primary">
          index page, add quick and advanced evaluation
        </AppText>
      </Card>
    </AppScreen>
  );
}



/*

import { ScrollView, View } from "react-native";

import {
  AppScreen,
  AppText,
  Button,
  Card,
} from "@/components/ui";

import { useTheme } from "@/theme";

export default function Index() {
  const { theme, mode, setMode } = useTheme();

  return (
    <AppScreen scrollable>
      <ScrollView
        contentContainerClassName="gap-6 py-6"
        showsVerticalScrollIndicator={false}
      >

        <View className="gap-2">
          <AppText variant="display">
            Worth It
          </AppText>

          <AppText
            variant="body"
            color="foregroundSecondary"
          >
            Component and theme test
          </AppText>

          <View
            className="self-start rounded-full px-3 py-1"
            style={{
              backgroundColor: theme.surfaceSecondary,
            }}
          >
            <AppText
              variant="caption"
              color="muted"
            >
              Current mode: {mode}
            </AppText>
          </View>
        </View>

  
        <Card variant="outlined">
          <View className="gap-4">
            <AppText variant="h3">
              Theme
            </AppText>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button
                  size="sm"
                  onPress={() => setMode("light")}
                >
                  Light
                </Button>
              </View>

              <View className="flex-1">
                <Button
                  size="sm"
                  onPress={() => setMode("dark")}
                >
                  Dark
                </Button>
              </View>
            </View>
          </View>
        </Card>

   
        <Card>
          <View className="gap-3">
            <AppText variant="h2">
              Typography
            </AppText>

            <AppText variant="h1">
              Heading 1
            </AppText>

            <AppText variant="h2">
              Heading 2
            </AppText>

            <AppText variant="h3">
              Heading 3
            </AppText>

            <AppText variant="title">
              Title
            </AppText>

            <AppText variant="body">
              Body text for normal content.
            </AppText>

            <AppText variant="bodySmall">
              Smaller body text.
            </AppText>

            <AppText variant="caption" color="muted">
              Caption text
            </AppText>

            <AppText
              variant="label"
              color="primary"
            >
              Label
            </AppText>
          </View>
        </Card>

   
        <View className="gap-3">
          <AppText variant="h2">
            Cards
          </AppText>

          <Card variant="filled">
            <AppText variant="title">
              Filled card
            </AppText>

            <AppText
              variant="bodySmall"
              color="foregroundSecondary"
            >
              Surface background.
            </AppText>
          </Card>

          <Card variant="outlined">
            <AppText variant="title">
              Outlined card
            </AppText>

            <AppText
              variant="bodySmall"
              color="foregroundSecondary"
            >
              Surface with a border.
            </AppText>
          </Card>

          <Card variant="elevated">
            <AppText variant="title">
              Elevated card
            </AppText>

            <AppText
              variant="bodySmall"
              color="foregroundSecondary"
            >
              Surface with elevation/shadow.
            </AppText>
          </Card>
        </View>

 
        <Card>
          <View className="gap-4">
            <AppText variant="h2">
              Buttons
            </AppText>

            <Button variant="primary">
              Primary
            </Button>

            <Button variant="secondary">
              Secondary
            </Button>

            <Button variant="outline">
              Outline
            </Button>

            <Button variant="ghost">
              Ghost
            </Button>

            <Button variant="destructive">
              Destructive
            </Button>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button size="sm">
                  Small
                </Button>
              </View>

              <View className="flex-1">
                <Button size="md">
                  Medium
                </Button>
              </View>

              <View className="flex-1">
                <Button size="lg">
                  Large
                </Button>
              </View>
            </View>

            <Button disabled>
              Disabled
            </Button>
          </View>
        </Card>


        <Card variant="outlined">
          <View className="gap-3">
            <AppText variant="h3">
              Semantic colors
            </AppText>

            <AppText color="primary">
              Primary
            </AppText>

            <AppText color="success">
              Success
            </AppText>

            <AppText color="warning">
              Warning
            </AppText>

            <AppText color="error">
              Error
            </AppText>

            <AppText color="muted">
              Muted
            </AppText>
          </View>
        </Card>
      </ScrollView>
    </AppScreen>
  );
}




*/