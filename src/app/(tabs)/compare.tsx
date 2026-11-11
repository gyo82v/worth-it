import { AppScreen, AppText, Card } from "@/components/ui";

export default function Index() {
  return (
    <AppScreen center>
       <Card>
         <AppText variant="display" align="center" color="primary">
        compare with other jobs and see if you are being paid fairly.
      </AppText>
      <AppText
        variant="body"
        align="center"
       style={{
                marginTop: 8,
            }}
        color="muted"
      >
        Compare your current job's compensation against similar positions in your area.
      </AppText>
       </Card>
    </AppScreen>
  );
}