import { useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { SelectableCard } from "@/components/ui";

export default function Example() {

    const [goal, setGoal] = useState("money");

    return (
        <View className="gap-3 p-4">

            <SelectableCard
                title="Money"
                description="Prioritise financial earnings."
                icon={
                    <Ionicons
                        name="wallet-outline"
                        size={24}
                        color="#16A34A"
                    />
                }
                selected={goal === "money"}
                onPress={() => setGoal("money")}
            />

            <SelectableCard
                title="Career growth"
                description="Prioritise learning and professional development."
                icon={
                    <Ionicons
                        name="school-outline"
                        size={24}
                        color="#64748B"
                    />
                }
                selected={goal === "careerGrowth"}
                onPress={() => setGoal("careerGrowth")}
            />

            <SelectableCard
                title="Satisfaction"
                description="Prioritise your working experience and wellbeing."
                icon={
                    <Ionicons
                        name="heart-outline"
                        size={24}
                        color="#64748B"
                    />
                }
                selected={goal === "satisfaction"}
                onPress={() => setGoal("satisfaction")}
            />

        </View>
    );
}