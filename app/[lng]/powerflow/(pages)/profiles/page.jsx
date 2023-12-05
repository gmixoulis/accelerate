import Profiles from "../../components/Profiles/Profiles";

export default async function Page() {
    const data = [
        {
            status: true,
            name: "Profile 1",
            description: "Profile 1 description",
            system_prompt: "System prompt 1",
            model_id: 1
        },
        {
            status: false,
            name: "Profile 2",
            description: "Profile 2 description",
            system_prompt: "System prompt 2",
            model_id: 2
        },
        {
            status: false,
            name: "Profile 3",
            description: "Profile 3 description",
            system_prompt: "System prompt 3",
            model_id: 3
        }
    ];
    
    return <Profiles data={data} />;
}
