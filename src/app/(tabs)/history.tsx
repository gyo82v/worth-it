import { AppScreen, AppText, Card } from "@/components/ui";

export default function Index() {
  return (
    <AppScreen center>
       <Card>
         <AppText variant="display" align="center" color="primary">
        History here
      </AppText>
      <AppText
        variant="body"
        align="center"
       style={{
                marginTop: 8,
            }}
        color="muted"
      >
       Check your past worth it calculations here
      </AppText>
       </Card>
    </AppScreen>
  );
}