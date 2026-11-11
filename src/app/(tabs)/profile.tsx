import { AppScreen, AppText, Card } from "@/components/ui";

export default function Index() {
  return (
    <AppScreen center>
       <Card>
         <AppText variant="display" align="center" color="primary">
        Profile here.
      </AppText>
      <AppText
        variant="body"
        align="center"
       style={{
                marginTop: 8,
            }}
        color="muted"
      >
        This is the profile page. You can add your profile information here.
      </AppText>
       </Card>
    </AppScreen>
  );
}