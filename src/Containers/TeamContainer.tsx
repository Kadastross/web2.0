import React, { ReactElement, useEffect, useState } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { RouteComponentProps } from "react-router-dom";
import { IMoiraApi } from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";

type Props = RouteComponentProps<{ id: string }> & { moiraApi: IMoiraApi };

const useApiRequest = <T extends unknown>(
    request: Promise<T>
): [T | undefined, string | undefined, boolean] => {
    const [response, setResponse] = useState<T | undefined>();
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        request
            .then(setResponse)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [request]);

    return [response, error, loading];
};

function TeamContainer({ moiraApi, match }: Props): ReactElement {
    type Item = { name: string };
    const arr: Array<Item | undefined> = [undefined, { name: "item" }];
    arr.filter(Boolean).map((item) => item.name);

    useEffect(() => {
        document.title = "Moira - Team";
    }, []);
    const [team, teamError, loading] = useApiRequest(moiraApi.getTeam(match.params.id));
    const [users, usersError, userLoading] = useApiRequest(moiraApi.getUsers(match.params.id));

    const handleAddUser = async () => ({});

    return (
        <Layout loading={loading || userLoading} error={teamError || usersError}>
            <LayoutContent>
                <LayoutTitle>{team?.name}</LayoutTitle>
                {users?.map((user) => (
                    <div key={user.id}>{user.name}</div>
                ))}
                <Button onClick={handleAddUser}>Add user</Button>
            </LayoutContent>
        </Layout>
    );
}

export default withMoiraApi(TeamContainer);
